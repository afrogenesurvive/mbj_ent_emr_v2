import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';

import CreateVisitForm from '../../components/forms/create/CreateVisitForm';
import VisitList from '../../components/lists/visit/VisitList';
import PatientList from '../../components/lists/patient/PatientList';
import AppointmentList from '../../components/lists/appointment/AppointmentList';
// import SearchAppointmentList from '../../components/lists/appointment/SearchAppointmentList';
import VisitDetail from '../../components/details/VisitDetail';

import FilterVisitForm from '../../components/forms/filter/FilterVisitForm';
import VisitSearchForm from '../../components/forms/search/VisitSearchForm';
import AppointmentSearchForm from '../../components/forms/search/AppointmentSearchForm';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'

import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './visit.css';

class VisitPage extends Component {
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
    appointments: null,
    canDelete: false,
    visits: null,
    searchVisits: null,
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
    showDetails: false,
    selectedUser: null,
    selectedPatient: null,
    selectedAppointment: null,
    selectedVisit: null,
    creatingVisit: false,
    newVisit: null,
    calendarVisits: null,
    fromGoLink: null,
    goLinkId: null,
    sublistSearch: false,
    tabKey: 'list',
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...all visits component mounted...');

  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    if (seshStore.role === 'Admin') {
      this.setState({canDelete:true})
    }

    if (this.props.location.state) {
      if (this.props.location.state.visit) {
        this.setState({
          fromGoLink: true,
          goLinkId: this.props.location.state.visit
        })
      }
    }
    this.getAllVisits(seshStore);
    this.getAllAppointments(seshStore);
    // this.getAllPatients(seshStore);
    if (this.props.selectedVisit) {
      console.log('...found existing visit selection... loading...');
      this.setState({
        showDetails: true,
        selectedVisit: this.props.selectedVisit
      })
    }
  }
}
componentWillUnmount() {

}

getAllVisits (args) {
  console.log('...retrieving all visits...');
  this.context.setUserAlert('...retrieving all visits...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getAllVisits(
        activityId:"${activityId}"
      )
      {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.getAllVisits);
      let responseAlert = '...all visits retrieval success!...';
      let error = null;
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      if (this.state.fromGoLink === true) {
        let goLinkVisit = resData.data.getAllVisits.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedVisit: goLinkVisit,
          tabKey: 'detail'
        })
        this.context.setUserAlert('...Check the details tab...')
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        visits: resData.data.getAllVisits,
        activityA: `getAllVisits?activityId:${activityId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.parseForCalendar(resData.data.getAllVisits)
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};

getAllAppointments (args) {
  console.log('...retrieving all appointments...');
  this.context.setUserAlert('...retrieving all appointments...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getAllAppointments(
        activityId:"${activityId}"
      )
      {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.getAllAppointments);
      let responseAlert = '...all appointments retrieval success!...';
      let error = null;
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        appointments: resData.data.getAllAppointments,
        activityA: `getAllAppointments?activityId:${activityId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};

getAllPatients (args) {
  console.log('...retrieving all patients...');
  this.context.setUserAlert('...retrieving all patients...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getAllPatients(
        activityId:"${activityId}"
      )
      {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        patients: resData.data.getAllPatients,
        activityA: `getAllPatients?activityId:${activityId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
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
      if (resData.data.addUserActivity.error) {
        console.log('...resDataError...',resData.data.addUserActivity.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

searchVisits = (event) => {
  event.preventDefault();
  console.log('...searching visits...');
  this.context.setUserAlert('...searching visits...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = activityId;
  const field = event.target.field.value;
  const query = event.target.query.value;
  let regex = true;
  if (field === 'date') {
      regex = false;
  }
  // console.log('regex',regex);

  let requestBody;
  if (regex === true) {
    requestBody = {
      query: `
      query {getVisitsByFieldRegex(
        activityId:"${activityId}",
        field:"${field}",
        query:"${query}"
      )
      {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (regex === false) {
    requestBody = {
      query: `
        query {getVisitsByField(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
        // console.log('...resData...',resData.data.getVisitsByFieldRegex);
      }
      if (regex === false) {
        // console.log('...resData...',resData.data.getVisitsByField);
      }

      let responseAlert = '...visit search success!...';
      let error = null;

      if (regex === true) {
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }
      if (regex === false) {
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (regex === true) {
        this.setState({
          isLoading: false,
          searchVisits: resData.data.getVisitsByFieldRegex,
          activityA: `getVisitsByFieldRegex?activityId:${activityId}`
        });
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          searchVisits: resData.data.getVisitsByField,
          activityA: `getVisitsByField?activityId:${activityId}`
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

onStartCreateNewVisit = () => {
  this.setState({
    creatingVisit: true
  })
}
cancelCreateNewVisit = () => {
  this.setState({
    creatingVisit: false,
    selectedAppointment: null
  })
}
submitCreateNewVisitForm = (event) => {
  event.preventDefault();
  console.log('...creating new visit...');
  this.context.setUserAlert('...creating new visit...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.state.selectedAppointment._id;

  const title = event.target.title.value;
  const type = event.target.type.value;
  const subType = event.target.subType.value;

  if (
      title.trim().length === 0 ||
      type.trim().length === 0
    ) {
    this.context.setUserAlert("...blank fields!!!...")
    return;
  }

  const tooEarly = moment().format('YYYY-MM-DD') < moment.unix(this.state.selectedAppointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD');
  const tooLate = moment().format('YYYY-MM-DD') > moment.unix(this.state.selectedAppointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD');

  if (tooEarly === true) {
    console.log('...appointment for this visit is in the future...please wait or create a new appointment...');
    this.context.setUserAlert('...appointment for this visit is in the future...please wait or create a new appointment...')
    this.setState({isLoading: false})
    return
  }
  if (tooLate === true) {
    console.log('...appointment for this visit has already gone... please create a new appointment...');
    this.context.setUserAlert('...appointment for this visit has already gone... please create a new appointment...')
    this.setState({isLoading: false})
    return
  }

  let requestBody = {
    query: `
      mutation {createVisit(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        visitInput:{
          title:"${title}",
          type:"${type}",
          subType:"${subType}"
        })
        {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      console.log('...resData...',resData.data.createVisit);
      let responseAlert = '...create visit success!...';
      let error = null;
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        showDetails: true,
        creatingVisit: false,
        selectedVisit: resData.data.createVisit,
        newVisit: resData.data.createVisit,
        tabKey: 'detail',
        activityA: `createAppointment?activityId:${activityId},visitId:${resData.data.createVisit._id}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      const seshStore = JSON.parse(sessionStorage.getItem('logInfo'))
      this.getAllVisits(seshStore);
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
menuSelect = (args) => {
  this.setState({
    menuSelect: args,
    tabKey: args
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

selectAppointment = (args) => {
  this.setState({
    selectedAppointment: args
  })
}

showDetails = (args) => {
  this.setState({
    showDetails: true,
    selectedVisit: args,
    overlay: false,
    tabKey: 'detail'
  })
  this.props.selectVisit(args);
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
updateVisit = (args) => {
  console.log('...updating selected visit...');
  this.setState({
    selectedVisit: args
  })
  this.props.selectVisit(args);
}

deleteVisit = (args) => {
  console.log('...deleteing visit...');
  this.context.setUserAlert('...deleteing visit...')

  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = args._id;

  let requestBody = {
    query: `
      mutation {deleteVisitById(
        activityId:"${activityId}",
        visitId:"${visitId}"
      )
      {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.deleteVisitById);
      let responseAlert = '...delete visit success!...';
      let error = null;
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        activityA: `deleteVisitById?activityId:${activityId},visitId:${visitId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.getAllVisits({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

parseForCalendar = (args) => {
  console.log('...parsing visits for calendar...');
  let calendarVisits = args.map(x => ({
      title: x.title,
      date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        _id: x._id,
        title: x.title,
        type: x.type,
        date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
        time: x.time,
        subType: x.subType,
      }
    }))
    this.setState({
      calendarVisits: calendarVisits
    })
}

viewCalendarEvent = (args) => {
  console.log('...viewing calendar visit...');
  const visit = this.state.visits.filter(x => x._id === args.event.extendedProps.props._id)[0];
  this.setState({
    overlay: true,
    overlayStatus: {type: 'calendarVisit', data: visit}
  })
}
toggleOverlay = () => {
  this.setState({
    overlay: false
  })
}

startSublistSearch = () => {
  this.setState({
    sublistSearch: true
  })
}
cancelSublistSearch = () => {
  this.setState({
    sublistSearch: false,
  })
  this.getAllAppointments({activityId: this.context.activityId,token: this.context.token});
}
submitSublistSearchForm = (event) => {
  event.preventDefault();
  console.log('...searching appointments...');
  this.context.setUserAlert('...searching appointments...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = activityId;
  const field = event.target.field.value;
  const query = event.target.query.value;
  let regex = true;
  if (field === 'date' ||
      field === 'inProgress' ||
      field === 'attended' ||
      field === 'important' ||
      field === 'important'
    ) {
      regex = false;
  }
  // console.log('regex',regex);

  let requestBody;
  if (regex === true) {
    requestBody = {
      query: `
        query {getAppointmentsByFieldRegex(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,reminders{_id},creator{_id}}}
      `};
  }
  if (regex === false) {
    requestBody = {
      query: `
      query {getAppointmentsByField(
        activityId:"${activityId}",
        field:"${field}",
        query:"${query}"
      )
      {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,reminders{_id},creator{_id}}}
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
        // console.log('...resData...',resData.data.getAppointmentsByFieldRegex);
      }
      if (regex === false) {
        // console.log('...resData...',resData.data.getAppointmentsByField);
      }

      let responseAlert = '...appointment search success!...';
      let error = null;

      if (regex === true) {
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }
      if (regex === false) {
        if (resData.data.error) {
          error = resData.data.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (regex === true) {
        this.setState({
          isLoading: false,
          appointments: resData.data.getAppointmentsByFieldRegex,
          activityA: `getAppointmentsByFieldRegex?activityId:${activityId},userId:${userId}`
        });
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          appointments: resData.data.getAppointmentsByField,
          activityA: `getAppointmentsByField?activityId:${activityId},userId:${userId}`
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

resetFilter = () => {
  this.setState({
    filter: {
      field: null,
      key: null,
      value: null
    }
  })
}


render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
        selectCalendarDetails={this.showDetails}
        toggleOverlay={this.toggleOverlay}
      />
    )}

    <Container className="staffPageContainer">
      <Row className="staffPageContainerRow headRow">
        <Col md={9} className="staffPageContainerCol">
          <h1>Visit List</h1>
        </Col>
        <Col md={3} className="staffPageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <p>.</p>
          )}
        </Col>
      </Row>

      <Tab.Container id="left-tabs-example" activeKey={this.state.tabKey}>
        <Row className="staffPageContainerRow mainRow2">

          <Col md={3} className="staffPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column mainMenu">
                <Nav.Item>
                  <Nav.Link eventKey="list" onClick={this.menuSelect.bind(this, 'list')}>List</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="search" onClick={this.menuSelect.bind(this, 'search')}>Search</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="detail" onClick={this.menuSelect.bind(this, 'detail')}>Details</Nav.Link>
                </Nav.Item>
                {this.context.role === 'Nurse' && (
                  <Nav.Item>
                    <Nav.Link eventKey="new" onClick={this.menuSelect.bind(this, 'new')}>New</Nav.Link>
                  </Nav.Item>
                )}
                {this.context.role === 'Doctor' && (
                  <Nav.Item>
                    <Nav.Link eventKey="new" onClick={this.menuSelect.bind(this, 'new')}>New</Nav.Link>
                  </Nav.Item>
                )}

              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                <FilterVisitForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              </Col>
            )}
          </Col>

          {this.state.visits && (
            <Col md={9} className="staffPageContainerCol specialCol2">
              <Tab.Content>
                <Tab.Pane eventKey="list">

                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <Row className="displayPaneHeadRow">
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-warning" onClick={this.resetFilter}>Reset</Button>
                  </Row>
                    <VisitList
                      filter={this.state.filter}
                      visits={this.state.visits}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      showDetails={this.showDetails}
                      onDelete={this.deleteVisit}
                    />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <h3>Calendar</h3>
                    <FullCalendar
                      intitialView="dayGridMonth"
                      plugins={[dayGridPlugin]}
                      events={this.state.calendarVisits}
                      eventClick={this.viewCalendarEvent}
                    />
                  </Tab>
                </Tabs>

                </Tab.Pane>
                <Tab.Pane eventKey="search">
                <Col className="userSearchCol">
                  <h3>Search Visit</h3>
                  <Row className="userSearchRow">
                    <VisitSearchForm
                      onConfirm={this.searchVisits}
                    />
                  </Row>
                  <Row>
                    {this.state.searchVisits && (
                      <Button variant="outline-primary" onClick={this.toggleSideCol} className="centered_btn">Filter</Button>
                    )}
                  </Row>
                  <Row className="userSearchRow results">
                    {this.state.searchVisits && (
                      <VisitList
                        filter={this.state.filter}
                        visits={this.state.searchVisits}
                        authId={this.context.activityId}
                        showDetails={this.showDetails}
                      />
                    )}
                  </Row>
                </Col>
                </Tab.Pane>
                <Tab.Pane eventKey="detail">
                {this.state.showDetails === true &&
                  this.state.selectedVisit && (
                    <VisitDetail
                      visit={this.state.selectedVisit}
                      updateVisit={this.updateVisit}
                    />
                )}
                </Tab.Pane>
                <Tab.Pane eventKey="new">
                {this.state.creatingVisit === false && (
                  <Button variant="outline-secondary" className="filterFormBtn" onClick={this.onStartCreateNewVisit}>Create New</Button>
                )}
                {this.state.creatingVisit === true &&
                  this.state.appointments &&
                  !this.state.selectedAppointment && (
                  <Col className="patientSubListCol">
                  <Row className="patientSubListRow">
                  <Button variant="outline-secondary" className="patientSublistSearchBtn" onClick={this.startSublistSearch}>Search</Button>
                  </Row>
                  <Row className="patientSubListRow">
                  {this.state.sublistSearch === true && (
                    <AppointmentSearchForm
                      onCancel={this.cancelSublistSearch}
                      onConfirm={this.submitSublistSearchForm}
                    />
                  )}
                  </Row>
                  <Row className="patientSubListRow">
                  <AppointmentList
                    filter={this.state.filter}
                    appointments={this.state.appointments}
                    authId={this.context.activityId}
                    onSelect={this.selectAppointment}
                    visitPage={true}
                  />
                  </Row>

                  </Col>
                )}
                {this.state.creatingVisit === true &&
                  this.state.selectedAppointment && (
                  <Row>
                    <CreateVisitForm
                      onConfirm={this.submitCreateNewVisitForm}
                      onCancel={this.cancelCreateNewVisit}
                      appointment={this.state.selectedAppointment}
                    />
                  </Row>
                )}
                {this.state.newVisit && (
                  <Row>
                    <h3>Review New Visit {this.state.newVisit._id}</h3>
                  </Row>
                )}
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

export default VisitPage;
