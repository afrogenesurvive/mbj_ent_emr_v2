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
import moment from 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';

import CreatePatientForm from '../../components/forms/create/CreatePatientForm';
import PatientList from '../../components/lists/patient/PatientList';
import SearchPatientList from '../../components/lists/patient/SearchPatientList';
import PatientDetail from '../../components/details/PatientDetail';

import FilterPatientForm from '../../components/forms/filter/FilterPatientForm';
import PatientSearchForm from '../../components/forms/search/PatientSearchForm';

import FloatMenu from '../../components/floatMenu/FloatMenu';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './patient.css';

class PatientPage extends Component {
  state = {
    activityA: null,
    role: null,
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
    activityUser: null,
    users: null,
    patients: null,
    searchPatients: null,
    isLoading: false,
    seshStore: null,
    profileLoaded: false,
    canDelete: false,
    sideCol: 'menuPatient',
    startFilter: false,
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    menuSelect: 'list',
    subMenuState: false,
    subMenu: 'all',
    adding: {
      state: null,
      field: null
    },
    showDetails: false,
    selectedUser: null,
    selectedPatient: null,
    creatingPatient: false,
    newPatient: null,
    fromGoLink: null,
    goLinkId: null,
    tabKey: 'list',
    dateClickPatientSelect: false,
    hasComorbidities: false,
    hasAllergies: false,
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...all patients component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    if (seshStore.role === 'Admin') {
      this.setState({canDelete:true})
    }

    if (this.props.location.state) {
      if (this.props.location.state.patient) {
        this.setState({
          fromGoLink: true,
          goLinkId: this.props.location.state.patient
        })
        if (this.props.location.state) {
          if (this.props.location.state.selectPatient) {
            this.setState({
              dateClickPatientSelect: true
            })
          }
        }
      }
    }
    this.getAllPatients(seshStore);
    if (this.props.selectedPatient) {
      console.log('...found existing Patient selection... loading...');
      this.setState({
        showDetails: true,
        tabKey: 'detail',
        menuSelect: 'detail',
        subMenuState: true,
        selectedPatient: this.props.selectedPatient
      })
    }
  }
}
componentWillUnmount() {

}

getAllPatients (args) {
  console.log('...retrieving all patients...');
  this.context.setUserAlert('...retrieving all patients...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;
  const userId = activityId;

  let requestBody = {
    query: `
      query {getAllPatients(
        activityId:"${activityId}"
      )
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.getAllPatients);
      let responseAlert = '...all patients retrieval success!...';
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
      this.setState({
        isLoading: false,
        patients: resData.data.getAllPatients,
        activityA: `getAllPatients?activityId:${activityId},userId:${userId}`
      });
      this.logUserActivity({activityId: activityId,token: token});

      if (this.state.fromGoLink === true) {
        let goLinkPatient = resData.data.getAllPatients.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedPatient: goLinkPatient,
          tabKey: 'detail'
        })
        this.context.setUserAlert('...Check the details tab...')
      }
      if (this.state.dateClickPatientSelect.true) {
        this.setState({
          menuSelect: 'list',
          dateClickPatientSelect: false
        })
      }

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};
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
      if (resData.errors) {
        this.context.setUserAlert(resData.errors[0].message);
      }
      if (resData.data.error) {
        this.context.setUserAlert(resData.data.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

searchPatients = (event) => {
  event.preventDefault();
  console.log('...searching patients...');
  this.context.setUserAlert('...searching patients...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.context.activityId;
  const field = event.target.field.value;
  const query = event.target.query.value;
  let regex = true;
  if (field === 'active' ||
      field === 'age' ||
      field === 'dob' ||
      field === 'addresses.number' ||
      field === 'addresses.primary' ||
      field === 'loggedIn' ||
      field === 'clientConnected' ||
      field === 'verification.verified' ||
      field === 'registration.date' ||
      field === 'expiryDate' ||
      field === 'referral.date' ||
      field === 'insurance.expiryDate' ||
      field === 'insurance.expiryDate'
    ) {
      regex = false;
  }
  // console.log('regex',regex);

  let requestBody;
  if (regex === true) {
    requestBody = {
      query: `
        query {getPatientsByFieldRegex(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
      `};
  }
  if (regex === false) {
    requestBody = {
      query: `
        query {getPatientsByField(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
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
      if (regex === true) {
        // console.log('...resData...',resData.data.getPatientsByFieldRegex);
      }
      if (regex === false) {
        // console.log('...resData...',resData.data.getPatientsByField);
      }

      let responseAlert = '...patient search success!...';
      let error = null;

      if (regex === true) {
        if (resData.errors) {
          error = resData.errors[0].message;
          responseAlert = error;
        }
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }
      if (regex === false) {
        if (resData.errors) {
          error = resData.errors[0].message;
          responseAlert = error;
        }
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (regex === true) {
        this.setState({
          isLoading: false,
          searchPatients: resData.data.getPatientsByFieldRegex,
          activityA: `getPatientsByFieldRegex?activityId:${activityId},userId:${userId}`
        });
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          searchPatients: resData.data.getPatientsByField,
          activityA: `getPatientsByField?activityId:${activityId},userId:${userId}`
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

onStartCreateNewPatient = () => {
  this.setState({
    creatingPatient: true
  })
}
cancelCreateNewPatient = () => {
  this.setState({
    creatingPatient: false
  })
}
submitCreateNewPatientForm = (event) => {
  event.preventDefault();
  console.log('...creating new patient...');
  this.context.setUserAlert('...creating new patient...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;

  const active = false;
  // const active = event.target.active.checked;
  const title = event.target.title.value;
  const name = event.target.name.value;
  const lastName = event.target.lastName.value;
  const username = event.target.username.value;
  const dob = event.target.dob.value;
  const role = event.target.role.value;
  const gender = event.target.gender.value;
  const contactEmail = event.target.contactEmail.value;
  const contactPhone = event.target.contactPhone.value;
  const contactPhone2 = event.target.contactPhone2.value;
  let addressNumber = event.target.addressNumber.value;
  if (addressNumber === '') {
    addressNumber = 0;
  }
  const addressStreet = event.target.addressStreet.value;
  const addressTown = event.target.addressTown.value;
  const addressCity = event.target.addressCity.value;
  const addressParish = event.target.addressParish.value;
  const addressCountry = event.target.addressCountry.value;
  const addressPostalCode = event.target.addressPostalCode.value;
  const referralDate = event.target.referralDate.value;
  const referralReason = event.target.referralReason.value.replace(/\n/g, ' ');
  const referralPhysicianName = event.target.referralPhysicianName.value;
  const referralPhysicianPhone = event.target.referralPhysicianPhone.value;
  const referralPhysicianEmail = event.target.referralPhysicianEmail.value;
  const referralPhysicianAddress = event.target.referralPhysicianAddress.value.replace(/\n/g, ' ');
  const attendingPhysician = event.target.attendingPhysician.value;
  const occupationRole = event.target.occupationRole.value;
  const occupationEmployerName = event.target.occupationEmployerName.value;
  const occupationEmployerEmail = event.target.occupationEmployerEmail.value;
  const occupationEmployerPhone = event.target.occupationEmployerPhone.value;
  const occupationEmployerAddress = event.target.occupationEmployerAddress.value.replace(/\n/g, ' ');
  const insuranceCompany = event.target.insuranceCompany.value;
  const insurancePolicyNumber = event.target.insurancePolicyNumber.value;
  const insuranceDescription = event.target.insuranceDescription.value.replace(/\n/g, ' ');
  const insuranceExpiryDate = event.target.insuranceExpiryDate.value;
  const insuranceSubscriberCompany = event.target.insuranceSubscriberCompany.value;
  const insuranceSubscriberDescription = event.target.insuranceSubscriberDescription.value.replace(/\n/g, ' ');

  if (

      title.trim().length === 0 ||
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      dob.trim().length === 0 ||
      role.trim().length === 0 ||
      gender.trim().length === 0 ||
      contactEmail.trim().length === 0 ||
      contactPhone.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {createPatient(
        activityId:"${activityId}",
        patientInput:{
          active:${active},
          username:"${username}",
          dob:"${dob}",
          title:"${title}",
          name:"${name}",
          lastName:"${lastName}",
          role:"${role}",
          gender:"${gender}",
          contactEmail:"${contactEmail}",
          contactPhone:"${contactPhone}",
          contactPhone2:"${contactPhone2}",
          addressNumber:${addressNumber},
          addressStreet:"${addressStreet}",
          addressTown:"${addressTown}",
          addressCity:"${addressCity}",
          addressParish:"${addressParish}",
          addressCountry:"${addressCountry}",
          addressPostalCode:"${addressPostalCode}",
          referralDate:"${referralDate}",
          referralReason:"${referralReason}",
          referralPhysicianName:"${referralPhysicianName}",
          referralPhysicianEmail:"${referralPhysicianEmail}",
          referralPhysicianPhone:"${referralPhysicianPhone}",
          attendingPhysician:"${attendingPhysician}",
          occupationRole:"${occupationRole}",
          occupationEmployerName:"${occupationEmployerName}",
          occupationEmployerPhone:"${occupationEmployerPhone}",
          occupationEmployerEmail:"${occupationEmployerEmail}",
          occupationEmployerAddress:"${occupationEmployerAddress}",
          insuranceCompany:"${insuranceCompany}",
          insurancePolicyNumber:"${insurancePolicyNumber}",
          insuranceDescription:"${insuranceDescription}",
          insuranceExpiryDate:"${insuranceExpiryDate}",
          insuranceSubscriberCompany:"${insuranceSubscriberCompany}",
          insuranceSubscriberDescription:"${insuranceSubscriberDescription}"
        })
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.createPatient);
      let responseAlert = '...create patient success!...';
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
      this.setState({
        isLoading: false,
        showDetails: true,
        creatingPatient: false,
        tabKey: 'detail',
        menuSelect: 'detail',
        selectedPatient: resData.data.createPatient,
        newPatient: resData.data.createPatient,
        activityA: `createPatient?activityId:${activityId},patientId:${resData.data.createPatient._id}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      const seshStore = JSON.parse(sessionStorage.getItem('logInfo'))
      this.getAllPatients(seshStore);
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

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
  this.setState({
    menuSelect: args,
    tabKey: args
  })
  if (args === 'detail' && this.state.selectedPatient) {
    this.setState({
      subMenuState: true
    })
  } else {
    this.setState({
      subMenuState: false
    })
  }
}
subMenuSelect = (args) => {
  this.setState({
    subMenu: args
  })
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
showDetails = (args) => {

  this.setState({
    showDetails: true,
    selectedPatient: args,
    tabKey: 'detail',
    menuSelect: 'detail',
    subMenuState: true
  })
  this.props.selectPatient(args);
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

updatePatient = (args) => {
  console.log('...updating selected patient...');
  this.setState({
    selectedPatient: args
  })
  this.props.selectPatient(args)
}
deletePatient = (args) => {
  console.log('...deleteing patient...',args);
  this.context.setUserAlert('...deleteing patient...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = args._id;

  let requestBody = {
    query: `
      mutation {deletePatientById(
        activityId:"${activityId}",
        patientId:"${patientId}"
      )
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.deletePatientById);
      let responseAlert = '...delete patient success!...';
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
      this.setState({
        isLoading: false,
        activityA: `deletePatientById?activityId:${activityId},patientId:${patientId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.getAllPatients({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

resetFilter = () => {
  this.setState({
    filter: {
      field: null,
      key: null,
      value: null
    }
  })
}
clearSearch = () => {
  this.setState({
    searchPatients: null
  })
}
setAllergyCheck = (args) => {
  this.setState({
    hasAllergies: args.hasAllergies,
    hasComorbidities: args.hasComorbidities,
  })
}

render() {

  return (
    <React.Fragment>
    <FloatMenu
      state={this.state.sideCol}
      menuSelect={this.menuSelect}
      subMenuState={this.state.subMenuState}
      menu={this.state.menuSelect}
      subMenu={this.state.subMenu}
      subMenuSelect={this.subMenuSelect}
      page='patient'
      role={this.context.role}
      hasAllergies={this.state.hasAllergies}
      hasComorbidities={this.state.hasComorbidities}
    />
    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <div className="topContainer">
      <div className="headTop">
        <Row className="">
          <h1>Patients:
          {this.state.showDetails === true &&
            this.state.selectedPatient &&
            this.state.tabKey === 'detail' && (
                this.state.selectedPatient.name
            )}
            </h1>
        </Row>
        <Row className="">
            {this.state.isLoading ? (
              <Image src={loadingGif} className="loadingGif" fluid />
            ):(
              <p>.</p>
            )}
        </Row>
      </div>

      <Row className="">
        {this.state.patients && (
          <Col lg={12} className="">

          {
          //   this.state.startFilter === true && (
          //   <Col>
          //     <FilterPatientForm
          //       onCancel={this.toggleFilter}
          //       onConfirm={this.submitFilterForm}
          //     />
          //   </Col>
          // )
        }

          {this.state.menuSelect === 'list' && (

            <Col className="tabCol">
            {this.state.startFilter === true && (
              <Col>
                <FilterPatientForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              </Col>
            )}
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="warning" className="searchBtn" onClick={this.resetFilter}>Reset</Button>
              </Col>
              <PatientList
                filter={this.state.filter}
                patients={this.state.patients}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                showDetails={this.showDetails}
                onDelete={this.deletePatient}
              />
            </Col>
          )}

          {this.state.menuSelect === 'search' && (
            <Col className="tabCol">

              <Col className="subTabCol">
                <h3>Search Patient</h3>
                <Row className="">
                  <PatientSearchForm
                    onConfirm={this.searchPatients}
                    onCancel={this.clearSearch}
                  />
                </Row>
                <Row>
                  {this.state.searchPatients && (
                    <Button variant="primary" className="centered_btn" onClick={this.toggleFilter}>Filter</Button>
                  )}
                </Row>

                {this.state.startFilter === true && (
                  <Col>
                    <FilterPatientForm
                      onCancel={this.toggleFilter}
                      onConfirm={this.submitFilterForm}
                    />
                  </Col>
                )}

                <Row className="">
                  {this.state.searchPatients && (
                    <SearchPatientList
                      filter={this.state.filter}
                      patients={this.state.searchPatients}
                      authId={this.context.activityId}
                      showDetails={this.showDetails}
                    />
                  )}
                </Row>
              </Col>
            </Col>
          )}
          {this.state.menuSelect === 'detail' && (
            <Col className="tabCol tabColDetail">

            {this.state.showDetails === false &&
              !this.state.selectedPatient &&(
              <h3>Select a Patient to see details</h3>
            )}
            {this.state.showDetails === true &&
              this.state.selectedPatient && (
              <PatientDetail
                patient={this.state.selectedPatient}
                updatePatient={this.updatePatient}
                subMenu={this.state.subMenu}
                setAllergyCheck={this.setAllergyCheck}
              />
            )}
            </Col>
          )}
          {this.state.menuSelect === 'new' && (
            <Col className="tabCol">
              {this.state.creatingPatient === false && (
                <Button variant="secondary" className="filterFormBtn" onClick={this.onStartCreateNewPatient}>Create New</Button>
              )}
              {this.state.creatingPatient === true && (
                <CreatePatientForm
                  onConfirm={this.submitCreateNewPatientForm}
                  onCancel={this.cancelCreateNewPatient}
                />
              )}
              {
              //   this.state.newPatient && (
              //   <Row>
              //     <h3>Review New Patient</h3>
              //     {this.state.newPatient.username}
              //   </Row>
              // )
            }
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

export default PatientPage;
