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
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import bootstrapPlugin from '@fullcalendar/bootstrap';
// import '../../calendar.scss'

import FloatMenu from '../../components/floatMenu/FloatMenu';
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
    sideCol: 'menuVisit',
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
    selectedAppointment: null,
    selectedVisit: null,
    creatingVisit: false,
    newVisit: null,
    calendarVisits: null,
    calendarAppointments: null,
    fromGoLink: null,
    goLinkId: null,
    sublistSearch: false,
    tabKey: 'list',
    newVisitPatient: false,
    otfAppt: false,
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
    // if (this.props.location.state &&
    //     this.props.location.state.newVisit ) {
    //     this.newVisitPatient();
    // }
  }
}
componentWillUnmount() {

}
componentDidUpdate () {
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
      {_id,date,time,title,type,subType,
        patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description}},
        consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      let responseAlert = '...visits loaded!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

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
      let responseAlert = '...appointments loaded...';
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
        appointments: resData.data.getAllAppointments,
        activityA: `getAllAppointments?activityId:${activityId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.parseForCalendarAppts(resData.data.getAllAppointments)

      if (this.props.location.state &&
          this.props.location.state.newVisit ) {
            console.log('foo')
          this.newVisitPatient({dateClick: false});
      }
      if (this.props.location.state &&
          this.props.location.state.newVisitDate ) {
            console.log('bar')
          this.newVisitPatient({dateClick: true});
      }

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
      // console.log('...resData...',resData.data.getAllPatients);
      let responseAlert = '...patients loaded...';
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

newVisitPatient = (args) => {
  console.log('...new Visit from patient details...');
  this.context.setUserAlert('...creating new appointment...')
  this.setState({
    isLoading: true,
    otfAppt: true
  });
  const token = this.context.token;
  const activityId = this.context.activityId;
  const patient = this.props.location.state.newVisit;
  const today = moment().format('YYYY-MM-DD,h:mm a')

  const title = patient.name+'appt'+today;
  const type = 'new_unreferred';
  const subType = '';
  const date = today.split(',')[0];
  const time = today.split(',')[1];
  const location = '';
  const description = 'appointment on-the-fly';
  const important = false;

  let requestBody = {
    query: `
      mutation {createAppointment(
        activityId:"${activityId}",
        patientId:"${patient._id}",
        appointmentInput:{
          title:"${title}",
          type:"${type}",
          subType:"${subType}",
          date:"${date}",
          time:"${time}",
          location:"${location}",
          description:"${description}",
          important:${important}
        })
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id,name},inProgress,attended,important,notes,tags,reminders{_id},creator{_id}}}
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
      // console.log('...resData...',resData.data.createAppointment);
      let responseAlert = '...create appointment success!...';
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
        activityA: `createAppointment?activityId:${activityId},appointmentId:${resData.data.createAppointment._id}`,
        creatingVisit: true,
        selectedAppointment: resData.data.createAppointment,
        menuSelect: 'new',
      });
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
  if (this.state.otfAppt === true) {
    console.log('...cleaning up on the fly appointment...');
    this.deleteOtfAppointment()
  }
}
submitCreateNewVisitForm = (event) => {
  event.preventDefault();
  console.log('...creating new visit...',this.state.selectedAppointment.patient);
  this.context.setUserAlert('...creating new visit...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.state.selectedAppointment._id;

  const title = this.state.selectedAppointment.patient.name+'visit'+this.state.selectedAppointment.date;
  const type = event.target.type.value;
  const subType = '';

  if (
      // title.trim().length === 0 ||
      type.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
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
      // console.log('...resData...',resData.data.createVisit);
      let responseAlert = '...create visit success!...';
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
        creatingVisit: false,
        selectedVisit: resData.data.createVisit,
        newVisit: resData.data.createVisit,
        otfAppt: false,
        // tabKey: 'detail',
        menuSelect: 'detail',
        activityA: `createVisit?activityId:${activityId},visitId:${resData.data.createVisit._id}`
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
deleteOtfAppointment = () => {
  console.log('...deleting otf appointment...');
  this.context.setUserAlert('...deleting otf appointment...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.state.selectedAppointment._id;
  // console.log('foo',appointmentId);

  let requestBody = {
    query: `
      mutation {deleteAppointmentById(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}"
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
      // console.log('...resData...',resData.data.deleteAppointmentById);
      let responseAlert = '...delete appointment success!...';
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
        activityA: `deleteAppointment?activityId:${activityId},visitId:${resData.data.deleteAppointmentById._id}`
      });
      this.logUserActivity({activityId: activityId,token: token});
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
  if (args === 'detail' && this.state.selectedVisit) {
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

selectAppointment = (args) => {
  this.setState({
    selectedAppointment: args
  })
}
selectCalendarAppointment = (args) => {
  this.setState({
    selectedAppointment: args.event.extendedProps.props
  })
}

showDetails = (args) => {
  this.setState({
    showDetails: true,
    selectedVisit: args,
    overlay: false,
    tabKey: 'detail',
    menuSelect: 'detail',
    subMenuState: true
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
parseForCalendarAppts = (args) => {
  console.log('...parsing appointments for calendar...');
  let calendarAppointments = args.map(x => ({
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
      }
    }))
    this.setState({
      calendarAppointments: calendarAppointments
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
dateClick = (args) => {
  console.log('dateClick',args)
  // this.setState({
  //   overlay: true,
  //   overlayStatus: {type: 'dateClickVisit', data: args.dateStr}
  // })
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
          appointments: resData.data.getAppointmentsByFieldRegex,
          activityA: `getAppointmentsByFieldRegex?activityId:${activityId},userId:${userId}`
        });
        this.parseForCalendarAppts(resData.data.getAppointmentsByFieldRegex)
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          appointments: resData.data.getAppointmentsByField,
          activityA: `getAppointmentsByField?activityId:${activityId},userId:${userId}`
        });
        this.parseForCalendarAppts(resData.data.getAppointmentsByField)
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
clearSearch = () => {
  this.setState({
    searchVisits: null
  })
}


render() {

  return (
    <React.Fragment>

    <FloatMenu
      state={this.state.sideCol}
      menuSelect={this.menuSelect}
      subMenuState={this.state.subMenuState}
      subMenu={this.state.subMenu}
      subMenuSelect={this.subMenuSelect}
      page='visit'
      role={this.context.role}
    />

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
        selectCalendarDetails={this.showDetails}
        toggleOverlay={this.toggleOverlay}
      />
    )}

    <div className="topContainer">
      <div className="headTop">
        <Row className="">
          <h1>Visits:
          {this.state.showDetails === true &&
            this.state.selectedVisit &&
            this.state.tabKey === 'detail' && (
                this.state.selectedVisit.title
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

        {this.state.visits && (
          <Col md={12} className="">

          {this.state.startFilter === true && (
            <Col>
              <FilterVisitForm
                onCancel={this.toggleFilter}
                onConfirm={this.submitFilterForm}
              />
            </Col>
          )}

          {this.state.menuSelect === 'list' && (
            <Col className="tabCol tabRowAppt">
            <Col className="subTabCol">
              <Button variant="primary" className="searchBtn" onClick={this.toggleFilter}>Filter</Button>
              <Button variant="warning" className="searchBtn" onClick={this.resetFilter}>Reset</Button>
            </Col>
              <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                <Tab eventKey="1" title="list">
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
                  <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
                    events={this.state.calendarVisits}
                    eventClick={this.viewCalendarEvent}
                    dateClick={this.dateClick}
                  />
                </Tab>
              </Tabs>
            </Col>
          )}
          {this.state.menuSelect === 'search' && (
            <Col className="tabCol">
              <Col className="subTabCol">
                <h3>Search</h3>
                <Row className="">
                  <VisitSearchForm
                    onConfirm={this.searchVisits}
                    onCancel={this.clearSearch}
                  />
                </Row>
                <Row>
                  {this.state.searchVisits && (
                    <Button variant="primary" onClick={this.toggleFilter} className="centered_btn">Filter</Button>
                  )}
                </Row>
                <Row className="">
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
            </Col>
          )}
          {this.state.menuSelect === 'detail' && (
            <Col className="tabCol tabColDetail">
              {this.state.showDetails === false &&
                !this.state.selectedVisit &&(
                <h3>Select a Visit to see details</h3>
              )}
              {this.state.showDetails === true &&
                this.state.selectedVisit && (
                  <VisitDetail
                    visit={this.state.selectedVisit}
                    updateVisit={this.updateVisit}
                    subMenu={this.state.subMenu}
                  />
              )}
            </Col>
          )}
          {this.state.menuSelect === 'new' && (
            <Col className="tabCol">
              {this.state.creatingVisit === false && (
                <Button variant="secondary" className="filterFormBtn" onClick={this.onStartCreateNewVisit}>Create New</Button>
              )}
              {this.state.creatingVisit === true &&
                this.state.appointments &&
                !this.state.selectedAppointment && (
                <Col className="">
                <Col className="subTabCol">
                <h3>
                Choose an Appointment
                </h3>
                <Button variant="secondary" className="patientSublistSearchBtn" onClick={this.startSublistSearch}>Search</Button>
                </Col>
                <Row className="">
                {this.state.sublistSearch === true && (
                  <AppointmentSearchForm
                    onCancel={this.cancelSublistSearch}
                    onConfirm={this.submitSublistSearchForm}
                  />
                )}
                </Row>
                <Col className="subTabCol">
                <Tabs defaultActiveKey="2" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                    <AppointmentList
                      filter={this.state.filter}
                      appointments={this.state.appointments}
                      authId={this.context.activityId}
                      onSelect={this.selectAppointment}
                      visitPage={true}
                    />
                  </Tab>
                  <Tab eventKey="2" title="calendar" className="calendarTab">
                    <h3>Calendar</h3>
                    <FullCalendar
                      initialView="dayGridMonth"
                      plugins={[dayGridPlugin, interactionPlugin]}
                      events={this.state.calendarAppointments}
                      eventClick={this.selectCalendarAppointment}
                      dateClick={this.dateClick}
                    />
                  </Tab>
                </Tabs>
                </Col>
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

export default VisitPage;
