import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';

import PatientAddressList from '../lists/patient/PatientAddressList';
import PatientNextOfKinList from '../lists/patient/PatientNextOfKinList'
import PatientAllergyList from '../lists/patient/PatientAllergyList'
import PatientMedicationList from '../lists/patient/PatientMedicationList'
import PatientImageList from '../lists/patient/PatientImageList'
import PatientFileList from '../lists/patient/PatientFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import PatientNoteList from '../lists/patient/PatientNoteList'
import PatientTagList from '../lists/patient/PatientTagList'

import FilterAddressForm from '../forms/filter/FilterAddressForm';
import FilterAllergyForm from '../forms/filter/FilterAllergyForm';
import FilterMedicationForm from '../forms/filter/FilterMedicationForm';
import FilterNextOfKinForm from '../forms/filter/FilterNextOfKinForm';
import FilterVisitForm from '../forms/filter/FilterVisitForm';
import FilterImageForm from '../forms/filter/FilterImageForm';
import FilterFileForm from '../forms/filter/FilterFileForm';
import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';
import FilterTagForm from '../forms/filter/FilterTagForm';

import UpdatePatientSingleFieldForm from '../forms/add/UpdatePatientSingleFieldForm';
import AddAddressForm from '../forms/add/AddAddressForm';
import AddAttendanceForm from '../forms/add/AddAttendanceForm';
import AddLeaveForm from '../forms/add/AddLeaveForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddTagForm from '../forms/add/AddTagForm';
import AddImageForm from '../forms/add/AddImageForm';
import AddFileForm from '../forms/add/AddFileForm';
import AddNextOfKinForm from '../forms/add/AddNextOfKinForm';
import AddAllergyForm from '../forms/add/AddAllergyForm';
import AddMedicationForm from '../forms/add/AddMedicationForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class PatientDetail extends Component {
  state = {
    activityA: null,
    role: null,
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
    activityUser: null,
    isLoading: false,
    seshStore: null,
    profileLoaded: false,
    sideCol: 'menu',
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    adding: {
      state: null,
      field: null
    },
    canDelete: false,
    updateSingleField: {
      state: null,
      field: null
    },
    selectedUser: null,
    selectedPatient: this.props.patient,
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.propsPatient = this.props.patient;
  }

componentDidMount () {
  console.log('...patient details component mounted...');

  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
  }
  this.setState({
    selectedPatient: this.context.selectedPatient
  })
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
}
componentWillUnmount() {

}


logUserActivity(args) {
  console.log('...logUserActivity...');
  const activityId = args.activityId;
  const token = args.token;
  const userId = activityId;
  const request = this.state.activityA;
  const activityDate = moment().format('YYYY-MM-DD');
  let requestBody = {
    query: `
      mutation {addUserActivity(
        activityId:"${activityId}",userId:"${userId}",
        userInput:{
          activityDate:"${activityDate}",
          activityRequest:"${request}"
        })
      {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addUserActivity);
      if (resData.data.addUserActivity.error) {
        console.log('...resDataError...',resData.data.addUserActivity.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

submitAddAddressForm = (event) => {
  event.preventDefault();
  console.log('...adding address...');
  this.context.setUserAlert('...adding address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const number = event.target.number.value;
  const street = event.target.street.value;
  const town = event.target.town.value;
  const city = event.target.city.value;
  const parish = event.target.parish.value;
  const country = event.target.country.value;
  const postalCode = event.target.postalCode.value;

  let requestBody = {
    query: `
      mutation {addPatientAddress(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          addressNumber:${number},
          addressStreet:"${street}",
          addressTown:"${town}",
          addressCity:"${city}",
          addressParish:"${parish}",
          addressCountry:"${country}",
          addressPostalCode:"${postalCode}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientAddress);
      let responseAlert = '...address add success!...';
      let error = null;
      if (resData.data.addPatientAddress.error) {
        error = resData.data.addPatientAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientAddress,
        activityA: `addPatientAddress?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteAddress = (args) => {
  console.log('...deleting address...');
  this.context.setUserAlert('...deleting address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientAddress(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}",
          addressPrimary:${args.primary}
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientAddress);
      let responseAlert = '...address delete success!...';
      let error = null;
      if (resData.data.deletePatientAddress.error) {
        error = resData.data.deletePatientAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientAddress,
        activityA: `deletePatientAddress?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
setAddressPrimary = (args) => {
  console.log('...setting primary address...');
  this.context.setUserAlert('...setting primary address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {setPatientAddressPrimary(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}"
        })
        {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.setPatientAddressPrimary);
      let responseAlert = '...address set primary success!...';
      let error = null;
      if (resData.data.setPatientAddressPrimary.error) {
        error = resData.data.setPatientAddressPrimary.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.setPatientAddressPrimary,
        activityA: `setPatientAddressPrimary?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.setPatientAddressPrimary;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddNextOfKinForm = (event) => {
  event.preventDefault();
  console.log('...add next of kin...');
  this.context.setUserAlert('...adding next of kin...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const name = event.target.name.value;
  const relation = event.target.relation.value;
  const email = event.target.email.value;
  const phone = event.target.phone.value;
  const phone2 = event.target.phone2.value;

  let requestBody = {
    query: `
      mutation {addPatientNextOfKin(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          nextOfKinName:"${name}",
          nextOfKinRelation:"${relation}",
          nextOfKinContactEmail:"${email}",
          nextOfKinContactPhone1:"${phone}",
          nextOfKinContactPhone2:"${phone2}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientNextOfKin);
      let responseAlert = '...next of kin add success!...';
      let error = null;
      if (resData.data.addPatientNextOfKin.error) {
        error = resData.data.addPatientNextOfKin.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientNextOfKin,
        activityA: `addPatientNextOfKin?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientNextOfKin;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteNextOfKin = (args) => {
  console.log('...deleting next of kin...');
  this.context.setUserAlert('...deleting next of kin....')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientNextOfKin(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          nextOfKinName:"${args.name}",
          nextOfKinRelation:"${args.relation}",
          nextOfKinContactEmail:"${args.contact.email}",
          nextOfKinContactPhone1:"${args.contact.phone1}",
          nextOfKinContactPhone2:"${args.contact.phone2}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      console.log('...resData...',resData.data.deletePatientNextOfKin);
      let responseAlert = '...next of kin delete success!...';
      let error = null;
      if (resData.data.deletePatientNextOfKin.error) {
        error = resData.data.deletePatientNextOfKin.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientNextOfKin,
        activityA: `deletePatientNextOfKin?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.deletePatientNextOfKin;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddAllergyForm = (event) => {
  event.preventDefault();
  console.log('...add allergy...');
  this.context.setUserAlert('...adding allergy...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addPatientAllergy(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          allergyType:"${type}",
          allergyTitle:"${title}",
          allergyDescription:"${description}",
          allergyAttachment:"${attachment}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientAllergy);
      let responseAlert = '...allergy add success!...';
      let error = null;
      if (resData.data.addPatientAllergy.error) {
        error = resData.data.addPatientAllergy.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientAllergy,
        activityA: `addPatientAllergy?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientAllergy;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteAllergy = (args) => {
  console.log('...deleting allergy...');
  this.context.setUserAlert('...deleting allergy...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientAllergy(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          allergyType:"${args.type}",
          allergyTitle:"${args.title}",
          allergyDescription:"${args.description}",
          allergyAttachments:"${args.attachments}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientAllergy);
      let responseAlert = '...allergy delete success!...';
      let error = null;
      if (resData.data.deletePatientAllergy.error) {
        error = resData.data.deletePatientAllergy.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientAllergy,
        activityA: `deletePatientAllergy?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.deletePatientAllergy;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddMedicationForm = (event) => {
  event.preventDefault();
  console.log('...add medication...');
  this.context.setUserAlert('...adding medication...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addPatientMedication(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          medicationType:"${type}",
          medicationTitle:"${title}",
          medicationDescription:"${description}",
          medicationAttachment:"${attachment}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientMedication);
      let responseAlert = '...medication add success!...';
      let error = null;
      if (resData.data.addPatientMedication.error) {
        error = resData.data.addPatientMedication.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientMedication,
        activityA: `addPatientMedication?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientMedication;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteMedication = (args) => {
  console.log('...deleting medication...');
  this.context.setUserAlert('...deleting medication...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientMedication(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          medicationType:"${args.type}",
          medicationTitle:"${args.title}",
          medicationDescription:"${args.description}",
          medicationAttachments:"${args.attachments}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientMedication);
      let responseAlert = '...medication delete success!...';
      let error = null;
      if (resData.data.deletePatientMedication.error) {
        error = resData.data.deletePatientMedication.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientMedication,
        activityA: `deletePatientMedication?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.deletePatientMedication;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

addAttachment = (args) => {
  console.log('...adding attachment...', args);
  let field = args.field;
}

submitAddImageForm = (event) => {
  event.preventDefault();
  console.log('...adding image...');
  this.context.setUserAlert('...adding image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const name = event.target.name.value;
  const type = event.target.type.value;
  const path = event.target.path.value;

  let requestBody = {
    query: `
      mutation {addPatientImage(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          imageName:"${name}",
          imageType:"${type}",
          imagePath:"${path}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientImage);
      let responseAlert = '...image add success!...';
      let error = null;
      if (resData.data.addPatientImage.error) {
        error = resData.data.addPatientImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientImage,
        activityA: `addPatientImage?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientImage;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteImage = (args) => {
  console.log('...deleting image...');
  this.context.setUserAlert('...deleting image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
    mutation {deletePatientImage(
      activityId:"${activityId}",
      patientId:"${patientId}",
      patientInput:{
        imageName:"${args.name}",
        imageType:"${args.type}",
        imagePath:"${args.path}"
      })
    {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientImage);
      let responseAlert = '...image delete success!...';
      let error = null;
      if (resData.data.deletePatientImage.error) {
        error = resData.data.deletePatientImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientImage,
        activityA: `deletePatientImage?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientImage;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddFileForm = (event) => {
  event.preventDefault();
  console.log('...adding file...');
  this.context.setUserAlert('...adding file...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const name = event.target.name.value;
  const type = event.target.type.value;
  const path = event.target.path.value;

  let requestBody = {
    query: `
      mutation {addPatientFile(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          fileName:"${name}",
          fileType:"${type}",
          filePath:"${path}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientFile);
      let responseAlert = '...file add success!...';
      let error = null;
      if (resData.data.addPatientFile.error) {
        error = resData.data.addPatientFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientFile,
        activityA: `addPatientFile?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientFile;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteFile = (args) => {
  console.log('...deleting file...');
  this.context.setUserAlert('...deleting file...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
    mutation {deletePatientFile(
      activityId:"${activityId}",
      patientId:"${patientId}",
      patientInput:{
        fileName:"${args.name}",
        fileType:"${args.type}",
        filePath:"${args.path}"
      })
    {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientFile);
      let responseAlert = '...file delete success!...';
      let error = null;
      if (resData.data.deletePatientFile.error) {
        error = resData.data.deletePatientFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientFile,
        activityA: `deletePatientFile?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientFile;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddNoteForm = (event) => {
  event.preventDefault();
  console.log('...adding notes...');
  this.context.setUserAlert('...adding notes...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const notes = event.target.notes.value;

  let requestBody = {
    query: `
      mutation {addPatientNotes(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          notes:"${notes}",
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientNotes);
      let responseAlert = '...notes add success!...';
      let error = null;
      if (resData.data.addPatientNotes.error) {
        error = resData.data.addPatientNotes.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientNotes,
        activityA: `addPatientNotes?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientNotes;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteNote = (args) => {
  console.log('...deleting note...');
  this.context.setUserAlert('...deleting note...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientNote(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          note:"${args}"
        })
        {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientNote);
      let responseAlert = '...note delete success!...';
      let error = null;
      if (resData.data.deletePatientNote.error) {
        error = resData.data.deletePatientNote.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientNote,
        activityA: `deletePatientNote?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientNote;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddTagForm = (event) => {
  event.preventDefault();
  console.log('...adding tags...');
  this.context.setUserAlert('...adding tags...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const tags = event.target.tags.value;

  let requestBody = {
    query: `
      mutation {addPatientTags(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          tags:"${tags}",
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.addPatientTags);
      let responseAlert = '...tags add success!...';
      let error = null;
      if (resData.data.addPatientTags.error) {
        error = resData.data.addPatientTags.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientTags,
        activityA: `addPatientTags?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientTags;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteTag = (args) => {
  console.log('...deleting tag...');
  this.context.setUserAlert('...deleting tag...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  let requestBody = {
    query: `
      mutation {deletePatientTag(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          tag:"${args}"
        })
        {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.deletePatientTag);
      let responseAlert = '...tag delete success!...';
      let error = null;
      if (resData.data.deletePatientTag.error) {
        error = resData.data.deletePatientTag.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientTag,
        activityA: `deletePatientNote?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientTag;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  let requestBody = {
    query: `
    mutation {updatePatientSingleField(
      activityId:"${activityId}",
      patientId:"${patientId}",
      field:"${field}",
      query:"${query}"
    )
    {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
    `};
  fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.updatePatientSingleField);
      let responseAlert = '...field update success!...';
      let error = null;
      if (resData.data.updatePatientSingleField.error) {
        error = resData.data.updatePatientSingleField.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.updatePatientSingleField,
        activityA: `updatePatientSingleField?activityId:${activityId},patientId:${patientId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.updatePatientSingleField;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
startUpdateSingleField = (args) => {
  this.setState({
    updateSingleField: {
      state: true,
      field: args
    }
  })
}
cancelUpdateSingleField = () => {
  this.setState({
    updateSingleField: {
      state: null,
      field: null
    }
  })
}

toggleSideCol = () => {
  if (this.state.sideCol === 'menu') {
    this.setState({sideCol: 'filter'})
  } else {
    this.setState({
      sideCol: 'menu',
      // filter: {
      //   field: null,
      //   key: null,
      //   value: null
      // }
    })
  }

}
menuSelect = (args) => {
  this.setState({menuSelect: args})
}
submitFilterForm = (event) => {
  event.preventDefault();
  let field = event.target.field.value;
  let key = event.target.key.value;
  let value = event.target.value.value;
  if (value === 'true') {
    value = true
  }
  if (value === 'false') {
    value = false 
  }
  this.setState({
    filter: {
      field: field,
      key: key,
      value: value
    }
  })

}
startAdd = (args) => {
  this.setState({
    adding: {
      state: true,
      field: args
    }
  })
}
cancelAdd = () => {
  this.setState({
    adding: {
      state: null,
      field: null
    }
  })
}

render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <Container className="detailPageContainer">

      <Row className="detailPageContainerRow mainRow">
        <Col md={2} className="detailPageContainerCol">

        </Col>
        <Col md={10} className="detailPageContainerCol">
          {!this.state.selectedPatient && (
            <h3>...</h3>
          )}
          {this.state.selectedPatient && (
            <h3>{this.state.selectedPatient.username}</h3>
          )}
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="detailPageContainerRow mainRow2">
          <Col md={2} className="detailPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'basic')}>Basic</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'admin')}>Admin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'address')}>Addresses</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'nextOfKin')}>Next Of Kin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'allergy')}>Allergies</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="6" onClick={this.menuSelect.bind(this, 'medication')}>Medication</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="7" onClick={this.menuSelect.bind(this, 'image')}>Images</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="8" onClick={this.menuSelect.bind(this, 'file')}>Files</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="9" onClick={this.menuSelect.bind(this, 'appointment')}>Appointments</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="10" onClick={this.menuSelect.bind(this, 'visit')}>Visits</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="11" onClick={this.menuSelect.bind(this, 'note')}>Notes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="12" onClick={this.menuSelect.bind(this, 'tag')}>Tag</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                {this.state.menuSelect === 'address' && (
                  <FilterAddressForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'nextOfKin' && (
                  <FilterNextOfKinForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'allergy' && (
                  <FilterAllergyForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'medication' && (
                  <FilterMedicationForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'image' && (
                  <FilterImageForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'file' && (
                  <FilterFileForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'appointment' && (
                  <FilterAppointmentForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'visit' && (
                  <FilterVisitForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'tag' && (
                  <FilterTagForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
              </Col>

            )}
          </Col>

          {this.state.selectedPatient && (
            <Col md={10} className="detailPageContainerCol specialCol2">
              <h3> xxx </h3>
              {this.state.updateSingleField.state === true && (
                <UpdatePatientSingleFieldForm
                  field={this.state.updateSingleField.field}
                  onConfirm={this.submitUpdateSingleFieldForm}
                  onCancel={this.cancelUpdateSingleField}
                />
              )}
                <Tab.Content>
                  <Tab.Pane eventKey="1">
                    Patient Basic:
                    <ListGroup className="profileBasicListGroup">
                      <ListGroup.Item>
                        <p className="listGroupText">Title:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.title}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                        <p className="listGroupText">Name:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.name}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                        <p className="listGroupText">Username:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.username}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">DOB:</p>
                        <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.dob.substr(0,8)).add(1,'days').format('YYYY-MM-DD')}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                        <p className="listGroupText">Age:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.age}</p>
                        <p className="listGroupText">Gender:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.gender}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Email:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.contact.email}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                        <p className="listGroupText">Phone:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.contact.phone}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                        <p className="listGroupText">Phone 2:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.contact.phone2}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Role:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.role}</p>
                        <p className="listGroupText">Registration:</p>
                        <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.registration.date.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.registration.number}</p>
                        <p className="listGroupText">Expiry Date:</p>
                        <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.expiryDate.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Referral:</p>
                        <p className="listGroupText">Date:</p>
                        <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.referral.date.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                        <p className="listGroupText">Reason:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.referral.reason}</p>
                        <p className="listGroupText">Referral Physician:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.name}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.email}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.phone}</p>
                        <p className="listGroupText">Attending Physician:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.attendingPhysician}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Occupation:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.occupation.role}</p>
                        <p className="listGroupText">Employer:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.name}</p>
                        <p className="listGroupText">Contact:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.phone}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.email}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.address}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Insurance:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.insurance.company}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.insurance.policyNumber}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.insurance.description}</p>
                        <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.insurance.expiryDate.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                        <p className="listGroupText">Subscriber:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.insurance.subscriber.company}</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.insurance.subscriber.description}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="2">
                    Patient Admin
                    <ListGroup className="profileBasicListGroup">
                      <ListGroup.Item>
                        <p className="listGroupText">Id:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient._id}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">LoggedIn:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.loggedIn.toString()}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">ClientConnected:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.clientConnected.toString()}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Verified:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.verification.verified.toString()}</p>
                        <p className="listGroupText">Type:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.verification.type}</p>
                        <p className="listGroupText">Code:</p>
                        <p className="listGroupText bold">{this.state.selectedPatient.verification.code}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="3">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">User Address List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'address' && (
                        <AddAddressForm
                          onConfirm={this.submitAddAddressForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientAddressList
                      filter={this.state.filter}
                      addresses={this.state.selectedPatient.addresses}
                      authId={this.context.activityId}
                      onDelete={this.deleteAddress}
                      canDelete={this.state.canDelete}
                      makePrimary={this.setAddressPrimary}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="4">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Next of Kin List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'nextOfKin')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'nextOfKin' && (
                        <AddNextOfKinForm
                          onConfirm={this.submitAddNextOfKinForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientNextOfKinList
                      filter={this.state.filter}
                      nextOfKin={this.state.selectedPatient.nextOfKin}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteNextOfKin}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="5">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Allergies List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'allergy')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'allergy' && (
                        <AddAllergyForm
                          onConfirm={this.submitAddAllergyForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientAllergyList
                      filter={this.state.filter}
                      allergies={this.state.selectedPatient.allergies}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteAllergy}
                      onAddAttachment={this.addAttachment}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="6">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Medication List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'medication')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'medication' && (
                        <AddMedicationForm
                          onConfirm={this.submitAddMedicationForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientMedicationList
                      filter={this.state.filter}
                      medication={this.state.selectedPatient.medication}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteMedication}
                      onAddAttachment={this.addAttachment}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="7">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Image List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'image' && (
                        <AddImageForm
                          onConfirm={this.submitAddImageForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientImageList
                      filter={this.state.filter}
                      images={this.state.selectedPatient.images}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteImage}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="8">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient File List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'file' && (
                        <AddFileForm
                          onConfirm={this.submitAddFileForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientFileList
                      filter={this.state.filter}
                      files={this.state.selectedPatient.files}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteFile}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="9">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Appointment List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    </Row>
                    <UserAppointmentList
                      filter={this.state.filter}
                      appointments={this.state.selectedPatient.appointments}
                      authId={this.context.activityId}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="10">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Visit List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    </Row>
                    <h3>Patient Visit List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="11">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Notes:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'note' && (
                        <AddNoteForm
                          onConfirm={this.submitAddNoteForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientNoteList
                      filter={this.state.filter}
                      notes={this.state.selectedPatient.notes}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteNote}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="12">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Patient Tags:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'tag' && (
                        <AddTagForm
                          onConfirm={this.submitAddTagForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <PatientTagList
                      filter={this.state.filter}
                      tags={this.state.selectedPatient.tags}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteTag}
                    />
                  </Tab.Pane>
                </Tab.Content>

            </Col>
          )}

        </Row>
      </Tab.Container>
    </Container>
    </React.Fragment>
  );
}

}

export default PatientDetail;
