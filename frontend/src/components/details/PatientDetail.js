import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import moment from 'moment';

import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'
import S3 from 'react-aws-s3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';
import PdfView from '../pdfView/PdfView';

import PatientAddressList from '../lists/patient/PatientAddressList';
import PatientNextOfKinList from '../lists/patient/PatientNextOfKinList'
import PatientAllergyList from '../lists/patient/PatientAllergyList'
import PatientMedicationList from '../lists/patient/PatientMedicationList'
import PatientComorbidityList from '../lists/patient/PatientComorbidityList'
import PatientImageList from '../lists/patient/PatientImageList'
import PatientFileList from '../lists/patient/PatientFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import PatientNoteList from '../lists/patient/PatientNoteList'
import PatientTagList from '../lists/patient/PatientTagList'
import VisitList from '../lists/visit/VisitList'

import FilterAddressForm from '../forms/filter/FilterAddressForm';
import FilterAllergyForm from '../forms/filter/FilterAllergyForm';
import FilterMedicationForm from '../forms/filter/FilterMedicationForm';
import FilterComorbidityForm from '../forms/filter/FilterComorbidityForm';
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
import AddComorbidityForm from '../forms/add/AddComorbidityForm';
import AddAttachmentForm from '../forms/add/AddAttachmentForm';

import FloatMenu from '../../components/floatMenu/FloatMenu';
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
    menuSelect: 'basic',
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
    addAttachmentForm: false,
    addAttachmentArgs: null,
    calendarAppointments: null,
    calendarVisits: null,
    pocketVars: null,
    s3State: {
      action: null,
      target: null,
      status: null
    },
    showPdfView: false,
    showPdfData: {
      type: null,
      data: null
    }
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
    this.getPocketVars(seshStore);
  }
  this.setState({
    selectedPatient: this.context.selectedPatient,
    menuSelect: this.props.subMenu
  })
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
  this.parseForCalendar({
    appointments: this.props.patient.appointments,
    visits: this.props.patient.visits,
  })

}
componentWillUnmount() {

}

getPocketVars (args) {
    console.log('...retriving pocketVars..');
    this.context.setUserAlert('...retriving pocketVars..')
    const token = args.token;
    const activityId = args.activityId;
    const requestBody = {
          query:`
            query {getPocketVars(
              activityId:"${activityId}")}
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
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          let pocketVarsParsed = JSON.parse(resData.data.getPocketVars)
          console.log('...retriving pocketVars success...');
          this.context.setUserAlert('...retriving pocketVars success...')
          this.setState({
            pocketVars: pocketVarsParsed
          });
        }

      })
      .catch(err => {
        console.log(err);
        this.context.setUserAlert(err);
      });
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
  const patientId = this.props.patient._id;
  const number = event.target.number.value;
  const street = event.target.street.value;
  const town = event.target.town.value;
  const city = event.target.city.value;
  const parish = event.target.parish.value;
  const country = event.target.country.value;
  const postalCode = event.target.postalCode.value;

  if (
      number.trim().length === 0 ||
      street.trim().length === 0 ||
      city.trim().length === 0 ||
      country.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientAddress)
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
  const patientId = this.props.patient._id;

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientAddress)
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
  const patientId = this.props.patient._id;

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
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.setPatientAddressPrimary)
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
  const patientId = this.props.patient._id;
  const name = event.target.name.value;
  const relation = event.target.relation.value;
  const email = event.target.email.value;
  const phone = event.target.phone.value;
  const phone2 = event.target.phone2.value;

  if (
      name.trim().length === 0 ||
      relation.trim().length === 0 ||
      phone.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientNextOfKin)
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
  const patientId = this.props.patient._id;

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientNextOfKin)
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
  const patientId = this.props.patient._id;
  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');

  if (
      description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'patient/'+patientId+'/allergy/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    file2Path = filePath2;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading file ...")
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'allergy attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'allergy attachment',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'allergy attachment',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'allergy attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addPatientAllergy(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          allergyType:"${type}",
          allergyTitle:"${title}",
          allergyDescription:"${description}",
          allergyAttachment:"${file2Path}"
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientAllergy)
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
  const patientId = this.props.patient._id;

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientAllergy)
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


      const preAttachments = args.attachments;

      const filePath = 'patient/'+patientId+'/allergy/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/patient/'+patientId+'/allergy/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `allergy attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
        .then(response => {
          console.log(response)
          this.context.setUserAlert(response)
          this.setState({
            overlayStatus: null,
            overlay: false,
          })
        })
        .catch(err => {
          console.error(err)
          this.setState({
            overlayStatus: null,
            overlay: false,
          })
        })


      }
      console.log('end');



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
  const patientId = this.props.patient._id;
  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');

  if (
      title.trim().length === 0 ||
      type.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'patient/'+patientId+'/medication/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    file2Path = filePath2;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading file ...")
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'medication attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'medication attachment',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'medication attachment',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'medication attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addPatientMedication(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          medicationType:"${type}",
          medicationTitle:"${title}",
          medicationDescription:"${description}",
          medicationAttachment:"${file2Path}"
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientMedication)
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
  const patientId = this.props.patient._id;

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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientMedication)
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


      const preAttachments = args.attachments;

      const filePath = 'patient/'+patientId+'/medication/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/patient/'+patientId+'/medication/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `medication attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
        .then(response => {
          console.log(response)
          this.context.setUserAlert(response)
          this.setState({
            overlayStatus: null,
            overlay: false,
          })
        })
        .catch(err => {
          console.error(err)
          this.setState({
            overlayStatus: null,
            overlay: false,
          })
        })


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddComorbidityForm = (event) => {
  event.preventDefault();
  console.log('...add comorbidities...');
  this.context.setUserAlert('...adding comorbidities...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;
  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');

  if (
      title.trim().length === 0 ||
      type.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addPatientComorbidity(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          comorbidityType:"${type}",
          comorbidityTitle:"${title}",
          comorbidityDescription:"${description}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.addPatientComorbidity);
      let responseAlert = '...Comorbidity add success!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientComorbidity)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addPatientComorbidity,
        activityA: `addPatientComorbidity?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addPatientComorbidity;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteComorbidity = (args) => {
  console.log('...deleting medication...',args);
  this.context.setUserAlert('...deleting medication...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;

  let requestBody = {
    query: `
      mutation {deletePatientComorbidity(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          comorbidityType:"${args.type}",
          comorbidityTitle:"${args.title}",
          comorbidityDescription:"${args.description}"
        })
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.deletePatientComorbidity);
      let responseAlert = '...Comorbidity delete success!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientComorbidity)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientComorbidity,
        activityA: `deletePatientComorbidity?activityId:${activityId},patientId:${patientId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.deletePatientComorbidity;
      this.logUserActivity({activityId: activityId,token: token});

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

startAddAttachment = (args) => {
  console.log('...start add attachment...');
  this.setState({
    addAttachmentForm: true,
    addAttachmentArgs: args
  })
}
cancelAddAttachment = () => {
  this.setState({
    addAttachmentForm: false
  })
}
addAttachment = (event) => {
  event.preventDefault();
  console.log('...adding attachment...');
  this.context.setUserAlert('...adding attachment...');
  this.setState({
    isLoading: true,
    addAttachmentForm: false
  })

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;
  const patientName = this.props.patient.name;
  let args = this.state.addAttachmentArgs;
  let field = args.field;
  let file2Path;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'patient/'+patientId+'/'+field+'/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    file2Path = filePath2;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading allergy attachment ...")
    console.log('...s3 uploading allergy attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: `${field} attachment`,
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: `${field} attachment`,
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: `${field} attachment`,
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: `${field} attachment`,
              status: 'failed'
            }
          });
        })
      }


  let allergyTitle;
  let allergyType;
  let allergyDescription;
  let allergyAttachment;
  let medicationTitle;
  let medicationType;
  let medicationDescription;
  let medicationAttachment;

  if (field === 'allergy') {
    allergyTitle = args.data.title;
    allergyType = args.data.type;
    allergyDescription = args.data.description;
    allergyAttachment = file2Path;
  }
  if (field === 'medication') {
    medicationTitle = args.data.title;
    medicationType = args.data.type;
    medicationDescription = args.data.description;
    medicationAttachment = file2Path;
  }

  let requestBody;
  if (field === 'allergy') {
    requestBody = {
      query: `
        mutation {addPatientAllergyAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            allergyType:"${allergyType}",
            allergyTitle:"${allergyTitle}",
            allergyDescription:"${allergyDescription}",
            allergyAttachment:"${file2Path}"
          })
          {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
      `};
  }
  if (field === 'medication') {
    requestBody = {
      query: `
        mutation {addPatientMedicationAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            medicationType:"${medicationType}",
            medicationTitle:"${medicationTitle}",
            medicationDescription:"${medicationDescription}",
            medicationAttachment:"${file2Path}"
          })
          {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
      `};
  }



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
      if (field === 'allergy') {
        // console.log('...resData...',resData.data.addPatientAllergyAttachment);
      }
      if (field === 'medication') {
        // console.log('...resData...',resData.data.addPatientMedicationAttachment);
      }

      let responseAlert = '...add attachment success!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }

      this.context.setUserAlert(responseAlert)

      if (field === 'allergy') {
        this.props.updatePatient(resData.data.addPatientAllergyAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.addPatientAllergyAttachment,
          activityA: `addPatientAllergyAttachmentRegex?activityId:${activityId},patientId:${patientId}`
        });
      }
      if (field === 'medication') {
        this.props.updatePatient(resData.data.addPatientMedicationAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.addPatientMedicationAttachment,
          activityA: `addPatientMedicationAttachment?activityId:${activityId},patientId:${patientId}`
        });
      }

      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}
deleteAttachment = (args) => {
  console.log('...deleting attachment...');
  this.context.setUserAlert('...adding attachment...');
  this.setState({isLoading: true})

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;
  const patientName = this.props.patient.name;

  const field = args.type;
  const attachment = args.attachment;
  const item = args.item;

  let requestBody;

  if (field === 'allergy') {
    let allergyType = item.type;
    let allergyTitle = item.title;
    let allergyDescription = item.description;
    let allergyAttachment = attachment;

    requestBody = {
      query: `
        mutation {deletePatientAllergyAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            allergyType:"${allergyType}",
            allergyTitle:"${allergyTitle}",
            allergyDescription:"${allergyDescription}",
            allergyAttachment:"${allergyAttachment}"
          })
          {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
      `};
  }
  if (field === 'medication') {
    let medicationType = item.type;
    let medicationTitle = item.title;
    let medicationDescription = item.description;
    let medicationAttachment = attachment;

    requestBody = {
      query: `
        mutation {deletePatientMedicationAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            medicationType:"${medicationType}",
            medicationTitle:"${medicationTitle}",
            medicationDescription:"${medicationDescription}",
            medicationAttachment:"${medicationAttachment}"
          })
          {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
      `};
  }

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
      if (field === 'allergy') {
        // console.log('...resData...',resData.data.deletePatientAllergyAttachment);
      }
      if (field === 'medication') {
        // console.log('...resData...',resData.data.deletePatientMedicationAttachment);
      }

      let responseAlert = '...delete attachment success!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }

      this.context.setUserAlert(responseAlert)

      if (field === 'allergy') {
        this.props.updatePatient(resData.data.deletePatientAllergyAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.deletePatientAllergyAttachment,
          activityA: `deletePatientAllergyAttachment?activityId:${activityId},patientId:${patientId}`
        });
      }
      if (field === 'medication') {
        this.props.updatePatient(resData.data.deletePatientMedicationAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.deletePatientMedicationAttachment,
          activityA: `deletePatientMedicationAttachment?activityId:${activityId},patientId:${patientId}`
        });
      }

      this.logUserActivity({activityId: activityId,token: token});

      const filePath = 'patient/'+patientId+'/'+field+'/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/patient/'+patientId+'/'+field+'/attachments/';
      const filename = attachment;
      const filename2 = filename.replace(filePath2,'');
      console.log('1:',filePath);
      console.log('2:',filename);
      console.log('3:',filename2);
      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachment..')
      console.log('...s3 deleting attachment..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `${field} attachment`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: `${field} attachment`,
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename2, config)
      .then(response => {
        console.log(response)
        this.context.setUserAlert(response)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}

submitAddImageForm = (event) => {
  event.preventDefault();
  console.log('...adding image...');
  this.context.setUserAlert('...adding image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;

  const patientName = this.props.patient.name;
  let imageName;
  let imageType;
  let imagePath;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'patient/'+patientId+'/images';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    imagePath = filePath2;
    imageName = fileName2;
    imageType = fileType;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading image ...")
    console.log('...s3 uploading image..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'image'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'image',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'image',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'image',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addPatientImage(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          imageName:"${imageName}",
          imageType:"${imageType}",
          imagePath:"${imagePath}"
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientImage)
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
  const patientId = this.props.patient._id;
  const patientName = this.props.patient.name;

  const filePath = 'patient/'+patientId+'/images';
  const filename = args.name;

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
    {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientImage)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientImage,
        activityA: `deletePatientImage?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientImage;
      this.logUserActivity({activityId: activityId,token: token});


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting image..')
      console.log('...s3 deleting image..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: 'image'
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'image',
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename, config)
      .then(response => {
        console.log(response)
        this.context.setUserAlert(response.message)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })

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
  const patientId = this.props.patient._id;

  const patientName = this.props.patient.name;

  let file2Name;
  let file2Type;
  let file2Path;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'patient/'+patientId+'/files';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    file2Path = filePath2;
    file2Name = fileName2;
    file2Type = fileType;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading file ...")
    console.log('...s3 uploading file..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'file'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'file',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'file',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'file',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addPatientFile(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          fileName:"${file2Name}",
          fileType:"${file2Type}",
          filePath:"${file2Path}"
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientFile)
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
  const patientId = this.props.patient._id;
  const patientName = this.props.patient.name;

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
    {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientFile)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientFile,
        activityA: `deletePatientFile?activityId:${activityId},patientId:${patientId}`
      });
      this.context.selectedPatient = resData.data.deletePatientFile;
      this.logUserActivity({activityId: activityId,token: token});

      const filePath = 'patient/'+patientId+'/files';
      const filename = args.name;
      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting file..')
      console.log('...s3 deleting file..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: 'file'
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename, config)
      .then(response => {
        console.log(response)
        this.context.setUserAlert(response.message)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })


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
  const patientId = this.props.patient._id;
  const notes = event.target.notes.value.replace(/\n/g, '');

  if (
      notes.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addPatientNotes(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          notes:"${notes}",
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientNotes)
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
  const patientId = this.props.patient._id;

  let requestBody = {
    query: `
      mutation {deletePatientNote(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          note:"${args}"
        })
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientNote)
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
  const patientId = this.props.patient._id;
  const tags = event.target.tags.value.replace(/\n/g, '');

  if (
      tags.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addPatientTags(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          tags:"${tags}",
        })
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.addPatientTags)
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
  const patientId = this.props.patient._id;

  let requestBody = {
    query: `
      mutation {deletePatientTag(
        activityId:"${activityId}",
        patientId:"${patientId}",
        patientInput:{
          tag:"${args}"
        })
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.deletePatientTag)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deletePatientTag,
        activityA: `deletePatienTag?activityId:${activityId},patientId:${patientId}`
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
  const patientId = this.props.patient._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  if (
      query.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
    mutation {updatePatientSingleField(
      activityId:"${activityId}",
      patientId:"${patientId}",
      field:"${field}",
      query:"${query}"
    )
    {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updatePatient(resData.data.updatePatientSingleField)
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
toggleFilter = () => {
  this.setState({
    startFilter: !this.state.startFilter
  })
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

parseForCalendar = (args) => {
  console.log('...parsing patient dates for calendar...');

  let calendarAppointments = args.appointments.map(x => ({
      title: x.title,
      date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        _id: x._id,
        date: x.date,
        title: x.title,
        type: x.type,
        subType: x.subType,
        time: x.time,
        location: x.location,
        description: x.description,
        important: x.important,
        field: 'appointments'
      }
    }))
  let calendarVisits = args.visits.map(x => ({
      title: x.title,
      date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        _id: x._id,
        date: x.date,
        title: x.title,
        type: x.type,
        subType: x.subType,
        time: x.time,
        field: 'visits'
      }
    }))
    this.setState({
      calendarAppointments: calendarAppointments,
      calendarVisits: calendarVisits,
    })
}
viewCalendarEvent = (args) => {

  let input = args.event.extendedProps.props;
  let data;

  if (input.field === 'appointments') {
    data = {
      _id: input._id,
      date: input.date,
      title: input.title,
      type: input.type,
      subType: input.subType,
      time: input.time,
      location: input.location,
      description: input.description,
      important: input.important,
      patient: this.props.patient,
    }
    this.setState({
      overlay: true,
      overlayStatus: {type: 'calendarAppointment', data: data, goLink: true}
    })
  }
  if (input.field === 'visits') {
    data = {
      _id: input._id,
      date: input.date,
      title: input.title,
      type: input.type,
      subType: input.subType,
      time: input.time,
      patient: this.props.patient,
    }
    this.setState({
      overlay: true,
      overlayStatus: {type: 'calendarVisit', data: data, goLink: true}
    })
  }

}
dateClick = (args) => {
  console.log('dateClick',args)
  if (this.props.subMenu === 'appointment') {
    this.setState({
      overlay: true,
      overlayStatus: {type: 'dateClickAppointmentPatient', data: {
        date: args.dateStr,
        patient: this.props.patient,
      }}
    })
  }
  // if (this.props.subMenu === 'visit') {
  //   this.setState({
  //     overlay: true,
  //     overlayStatus: {type: 'dateClickVisitPatient', data: {
  //       date: args.dateStr,
  //       patient: this.props.patient,
  //     }}
  //   })
  // }

}

toggleOverlay = () => {
  this.setState({
    overlay: false
  })
}
showPdfView = (args) => {
  this.setState({
    showPdfView: true,
    showPdfData: {
      type: args.type,
      data: args.data
    }
  })
}

closePdfView = () => {
  this.setState({
    showPdfView: false,
    showPdfData: {
      type: null,
      data: null
    }
  })
}
new = (args) => {
  console.log('new: ',args)

  // <Link
  //   to={{
  //     pathname: "/appointments",
  //     state: {appointment: props.appointment._id}
  //   }}
  // >
  // </Link>
}

render() {

  return (
    <React.Fragment>



    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
        toggleOverlay={this.toggleOverlay}
      />
    )}

    <div className="detailContainer">

      <Row className="">
        {!this.props.patient && (
          <h3>...</h3>
        )}
      </Row>

      <Row className="">
        {this.props.patient && (
          <Col md={12} className="">
            {this.state.startFilter === true && (
              <Col>
                {this.props.subMenu === 'address' && (
                  <FilterAddressForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'nextOfKin' && (
                  <FilterNextOfKinForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'allergy' && (
                  <FilterAllergyForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'medication' && (
                  <FilterMedicationForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'comorbidities' && (
                  <FilterComorbidityForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'image' && (
                  <FilterImageForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'file' && (
                  <FilterFileForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'appointment' && (
                  <FilterAppointmentForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'visit' && (
                  <FilterVisitForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.props.subMenu === 'tag' && (
                  <FilterTagForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
              </Col>

            )}

            {this.state.updateSingleField.state === true && (
              <UpdatePatientSingleFieldForm
                field={this.state.updateSingleField.field}
                onConfirm={this.submitUpdateSingleFieldForm}
                onCancel={this.cancelUpdateSingleField}
              />
            )}
            {this.props.subMenu === 'all' && (
              <Row className="tabRowAll">
              <ul className="summaryList">
              <li className="summaryListItem">
              <Col className="subTabCol">
              <Link
                to={{
                  pathname: "/appointments",
                  state: {newAppointment: this.props.patient}
                }}
              >
              <Button variant="primary" className="searchBtn" onClick={this.new.bind(this, 'appointment')}>New Appointment</Button>
              </Link>
              <Link
                to={{
                  pathname: "/visits",
                  state: {newVisit: this.props.patient}
                }}
              >
              <Button variant="primary" className="searchBtn" onClick={this.new.bind(this, 'visit')}>New Visit</Button>
              </Link>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.patient.title}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                  <p className="listGroupText">Fisrt Name:</p>
                  <p className="listGroupText bold">{this.props.patient.name}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                  <p className="listGroupText">Last Name:</p>
                  <p className="listGroupText bold">{this.props.patient.lastName}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'lastName')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText">Username:</p>
                  <p className="listGroupText bold">{this.props.patient.username}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">DOB:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.dob.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                  <p className="listGroupText">Age:</p>
                  <p className="listGroupText bold">{this.props.patient.age}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Gender:</p>
                  <p className="listGroupText bold">{this.props.patient.gender}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                  <p className="listGroupText">Phone 2:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.phone2}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Role:</p>
                  <p className="listGroupText bold">{this.props.patient.role}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'role')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Registration:</p>
                  <p className="listGroupText">Date:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.registration.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <p className="listGroupText">Number:</p>
                  <p className="listGroupText bold">{this.props.patient.registration.number}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Referral:</p>
                  <p className="listGroupText">Date:</p>
                  {this.props.patient.referral.date && (
                    <p className="listGroupText bold">{moment.unix(this.props.patient.referral.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  )}
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.date')}>Edit</Button>
                  <p className="listGroupText">Reason:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.reason}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.reason')}>Edit</Button>
                  <p className="listGroupText">Referral Physician:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.name}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.name')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Referral Physician:</p>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.email')}>Edit</Button>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.phone')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Attending Physician:</p>
                <p className="listGroupText bold">{this.props.patient.attendingPhysician}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'attendingPhysician')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Occupation:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.role}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.role')}>Edit</Button>
                <p className="listGroupText">Employer:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.employer.name}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.name')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Contact:</p>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.occupation.employer.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.phone')}>Edit</Button>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.occupation.employer.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.email')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Address:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.employer.address}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.address')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Insurance:</p>
                  <p className="listGroupText bold">{this.props.patient.insurance.company}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.company')}>Edit</Button>
                  <p className="listGroupText bold">{this.props.patient.insurance.policyNumber}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.policyNumber')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText bold">{this.props.patient.insurance.description}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.description')}>Edit</Button>
                {this.props.patient.insurance.expiryDate && (
                  <p className="listGroupText bold">{moment.unix(this.props.patient.insurance.expiryDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                )}
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.expiryDate')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Subscriber:</p>
                <p className="listGroupText bold">{this.props.patient.insurance.subscriber.company}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.subscriber.company')}>Edit</Button>
                <p className="listGroupText bold">{this.props.patient.insurance.subscriber.description}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.subscriber.description')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date of Death:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.expiryDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'expiryDate')}>Edit</Button>
                </ListGroup.Item>
              </ListGroup>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Admin Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Id:</p>
                  <p className="listGroupText bold">{this.props.patient._id}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">LoggedIn:</p>
                  <p className="listGroupText bold">{this.props.patient.loggedIn.toString()}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">ClientConnected:</p>
                  <p className="listGroupText bold">{this.props.patient.clientConnected.toString()}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Verified:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.verified.toString()}</p>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.type}</p>
                  <p className="listGroupText">Code:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.code}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientAddressList
                  filter={this.state.filter}
                  addresses={this.props.patient.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Next of Kin:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'nextOfKin')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'nextOfKin' && (
                    <AddNextOfKinForm
                      onConfirm={this.submitAddNextOfKinForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientNextOfKinList
                  filter={this.state.filter}
                  nextOfKin={this.props.patient.nextOfKin}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteNextOfKin}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Allergies:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'allergy')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'allergy' && (
                    <AddAllergyForm
                      onConfirm={this.submitAddAllergyForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.addAttachmentForm === true && (
                  <AddAttachmentForm
                    onCancel={this.cancelAddAttachment}
                    onConfirm={this.addAttachment}
                  />
                )}
                <PatientAllergyList
                  filter={this.state.filter}
                  allergies={this.props.patient.allergies}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteAllergy}
                  onAddAttachment={this.startAddAttachment}
                  deleteAttachment={this.deleteAttachment}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Medication:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'medication')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'medication' && (
                    <AddMedicationForm
                      onConfirm={this.submitAddMedicationForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.addAttachmentForm === true && (
                  <AddAttachmentForm
                    onCancel={this.cancelAddAttachment}
                    onConfirm={this.addAttachment}
                  />
                )}
                <PatientMedicationList
                  filter={this.state.filter}
                  medication={this.props.patient.medication}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteMedication}
                  onAddAttachment={this.startAddAttachment}
                  deleteAttachment={this.deleteAttachment}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Comorbidities:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'comorbidity')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'comorbidity' && (
                    <AddComorbidityForm
                      onConfirm={this.submitAddComorbidityForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientComorbidityList
                  filter={this.state.filter}
                  comorbidities={this.props.patient.comorbidities}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteComorbidity}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Images:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'image' && (
                    <AddImageForm
                      onConfirm={this.submitAddImageForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientImageList
                  filter={this.state.filter}
                  images={this.props.patient.images}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteImage}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Files:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'file' && (
                    <AddFileForm
                      onConfirm={this.submitAddFileForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientFileList
                  filter={this.state.filter}
                  files={this.props.patient.files}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteFile}
                />
              </Col>
              </li>
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Appointments:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
              </Col>
                <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <UserAppointmentList
                    filter={this.state.filter}
                    appointments={this.props.patient.appointments}
                    authId={this.context.activityId}
                  />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin]}
                      events={this.state.calendarAppointments}
                      eventClick={this.viewCalendarEvent}
                      dateClick={this.dateClick}
                    />
                  </Tab>
                </Tabs>
              </Col>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Visits:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                </Col>
                <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <VisitList
                    filter={this.state.filter}
                    visits={this.props.patient.visits}
                    authId={this.context.activityId}
                    patientPage={true}
                  />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin]}
                      events={this.state.calendarVisits}
                      eventClick={this.viewCalendarEvent}
                      dateClick={this.dateClick}
                    />
                  </Tab>
                </Tabs>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Notes:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.context.role === 'Admin' && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'note' && (
                    <AddNoteForm
                      onConfirm={this.submitAddNoteForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientNoteList
                  filter={this.state.filter}
                  notes={this.props.patient.notes}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteNote}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Tags:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'tag' && (
                    <AddTagForm
                      onConfirm={this.submitAddTagForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientTagList
                  filter={this.state.filter}
                  tags={this.props.patient.tags}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteTag}
                />
              </Col>
              </li>
              </ul>
              </Row>
            )}

            {this.props.subMenu === 'basic' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.patient.title}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                  <p className="listGroupText">Fisrt Name:</p>
                  <p className="listGroupText bold">{this.props.patient.name}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                  <p className="listGroupText">Last Name:</p>
                  <p className="listGroupText bold">{this.props.patient.lastName}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'lastName')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText">Username:</p>
                  <p className="listGroupText bold">{this.props.patient.username}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">DOB:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.dob.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                  <p className="listGroupText">Age:</p>
                  <p className="listGroupText bold">{this.props.patient.age}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">DOB:</p>
                  <p className="listGroupText">Gender:</p>
                  <p className="listGroupText bold">{this.props.patient.gender}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                  <p className="listGroupText">Phone 2:</p>
                  <p className="listGroupText bold">{this.props.patient.contact.phone2}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Role:</p>
                  <p className="listGroupText bold">{this.props.patient.role}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'role')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Registration:</p>
                  <p className="listGroupText">Date:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.registration.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <p className="listGroupText">Number:</p>
                  <p className="listGroupText bold">{this.props.patient.registration.number}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Referral:</p>
                  <p className="listGroupText">Date:</p>
                  {this.props.patient.referral.date && (
                    <p className="listGroupText bold">{moment.unix(this.props.patient.referral.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  )}
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.date')}>Edit</Button>
                  <p className="listGroupText">Reason:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.reason}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.reason')}>Edit</Button>
                  <p className="listGroupText">Referral Physician:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.name}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.name')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Referral Physician:</p>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.email')}>Edit</Button>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.referral.physician.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'referral.physician.phone')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Attending Physician:</p>
                <p className="listGroupText bold">{this.props.patient.attendingPhysician}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'attendingPhysician')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Occupation:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.role}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.role')}>Edit</Button>
                <p className="listGroupText">Employer:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.employer.name}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.name')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Contact:</p>
                  <p className="listGroupText">Phone:</p>
                  <p className="listGroupText bold">{this.props.patient.occupation.employer.phone}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.phone')}>Edit</Button>
                  <p className="listGroupText">Email:</p>
                  <p className="listGroupText bold">{this.props.patient.occupation.employer.email}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.email')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Address:</p>
                <p className="listGroupText bold">{this.props.patient.occupation.employer.address}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'occupation.employer.address')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Insurance:</p>
                  <p className="listGroupText bold">{this.props.patient.insurance.company}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.company')}>Edit</Button>
                  <p className="listGroupText bold">{this.props.patient.insurance.policyNumber}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.policyNumber')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText bold">{this.props.patient.insurance.description}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.description')}>Edit</Button>
                {this.props.patient.insurance.expiryDate && (
                  <p className="listGroupText bold">{moment.unix(this.props.patient.insurance.expiryDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                )}
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.expiryDate')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Subscriber:</p>
                <p className="listGroupText bold">{this.props.patient.insurance.subscriber.company}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.subscriber.company')}>Edit</Button>
                <p className="listGroupText bold">{this.props.patient.insurance.subscriber.description}</p>
                <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'insurance.subscriber.description')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date of Death:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.patient.expiryDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'expiryDate')}>Edit</Button>
                </ListGroup.Item>
              </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'admin' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Admin Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Id:</p>
                  <p className="listGroupText bold">{this.props.patient._id}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">LoggedIn:</p>
                  <p className="listGroupText bold">{this.props.patient.loggedIn.toString()}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">ClientConnected:</p>
                  <p className="listGroupText bold">{this.props.patient.clientConnected.toString()}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Verified:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.verified.toString()}</p>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.type}</p>
                  <p className="listGroupText">Code:</p>
                  <p className="listGroupText bold">{this.props.patient.verification.code}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'address' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientAddressList
                  filter={this.state.filter}
                  addresses={this.props.patient.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
            )}
            {this.props.subMenu === 'nextOfKin' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Next of Kin:</h3>
            </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'nextOfKin')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'nextOfKin' && (
                    <AddNextOfKinForm
                      onConfirm={this.submitAddNextOfKinForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientNextOfKinList
                  filter={this.state.filter}
                  nextOfKin={this.props.patient.nextOfKin}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteNextOfKin}
                />
              </Col>
            )}
            {this.props.subMenu === 'allergy' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Allergies:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'allergy')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'allergy' && (
                    <AddAllergyForm
                      onConfirm={this.submitAddAllergyForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.addAttachmentForm === true && (
                  <AddAttachmentForm
                    onCancel={this.cancelAddAttachment}
                    onConfirm={this.addAttachment}
                  />
                )}
                <PatientAllergyList
                  filter={this.state.filter}
                  allergies={this.props.patient.allergies}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteAllergy}
                  onAddAttachment={this.startAddAttachment}
                  deleteAttachment={this.deleteAttachment}
                />
              </Col>
            )}
            {this.props.subMenu === 'medication' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Medication:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'medication')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'medication' && (
                    <AddMedicationForm
                      onConfirm={this.submitAddMedicationForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.addAttachmentForm === true && (
                  <AddAttachmentForm
                    onCancel={this.cancelAddAttachment}
                    onConfirm={this.addAttachment}
                  />
                )}
                <PatientMedicationList
                  filter={this.state.filter}
                  medication={this.props.patient.medication}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteMedication}
                  onAddAttachment={this.startAddAttachment}
                  deleteAttachment={this.deleteAttachment}
                />
              </Col>
            )}
            {this.props.subMenu === 'comorbidities' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Comorbidities:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'comorbidity')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'comorbidity' && (
                    <AddComorbidityForm
                      onConfirm={this.submitAddComorbidityForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientComorbidityList
                  filter={this.state.filter}
                  comorbidities={this.props.patient.comorbidities}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteComorbidity}
                />
              </Col>
            )}
            {this.props.subMenu === 'image' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Images:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'image' && (
                    <AddImageForm
                      onConfirm={this.submitAddImageForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientImageList
                  filter={this.state.filter}
                  images={this.props.patient.images}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteImage}
                />
              </Col>
            )}
            {this.props.subMenu === 'file' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Files:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'file' && (
                    <AddFileForm
                      onConfirm={this.submitAddFileForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientFileList
                  filter={this.state.filter}
                  files={this.props.patient.files}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteFile}
                />
              </Col>
            )}
            {this.props.subMenu === 'appointment' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Appointments:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
              </Col>
                <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <UserAppointmentList
                    filter={this.state.filter}
                    appointments={this.props.patient.appointments}
                    authId={this.context.activityId}
                  />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin]}
                      events={this.state.calendarAppointments}
                      eventClick={this.viewCalendarEvent}
                      dateClick={this.dateClick}
                    />
                  </Tab>
                </Tabs>
              </Col>
            )}
            {this.props.subMenu === 'visit' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Visits:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                </Col>
                <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <VisitList
                    filter={this.state.filter}
                    visits={this.props.patient.visits}
                    authId={this.context.activityId}
                    patientPage={true}
                  />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin]}
                      events={this.state.calendarVisits}
                      eventClick={this.viewCalendarEvent}
                      dateClick={this.dateClick}
                    />
                  </Tab>
                </Tabs>
              </Col>
            )}
            {this.props.subMenu === 'note' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Notes:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.context.role === 'Admin' && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'note' && (
                    <AddNoteForm
                      onConfirm={this.submitAddNoteForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientNoteList
                  filter={this.state.filter}
                  notes={this.props.patient.notes}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteNote}
                />
              </Col>
            )}
            {this.props.subMenu === 'tag' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Tags:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="success" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'tag' && (
                    <AddTagForm
                      onConfirm={this.submitAddTagForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <PatientTagList
                  filter={this.state.filter}
                  tags={this.props.patient.tags}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteTag}
                />
              </Col>
            )}
            {this.props.subMenu === 'doc' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Document Generator:</h3>
              </Col>
                <Row className="displayPaneHeadRow">
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Test</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'test', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Referral</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'referral', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">admissionReminder</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'admissionReminder', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">sickNote</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'sickNote', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">insurance</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'insurance', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">diagnosisTesting</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'diagnosisTesting', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">prescription</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'prescription', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">treatmentConsent</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'treatmentConsent', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">treatmentInstructions</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'treatmentInstructions', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">unfitToFly</p>
                      <Button variant="outline-primary" size="sm" onClick={this.showPdfView.bind(this, {type: 'unfitToFly', data: 'abc_xyz'})}>Create</Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Row>
                {this.state.showPdfView === true && (
                  <PdfView
                    pdfViewData={this.state.showPdfData}
                    close={this.closePdfView}
                    patient={this.props.patient}
                  />
                )}
              </Col>
            )}
          </Col>
        )}

      </Row>
    </div>
    </React.Fragment>
  );
}

}

export default PatientDetail;
