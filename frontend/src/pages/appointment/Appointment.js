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

import CreateAppointmentForm from '../../components/forms/create/CreateAppointmentForm';
import AppointmentList from '../../components/lists/appointment/AppointmentList';
import PatientList from '../../components/lists/patient/PatientList';
// import SearchAppointmentList from '../../components/lists/appointment/SearchAppointmentList';
import AppointmentDetail from '../../components/details/AppointmentDetail';

import FilterAppointmentForm from '../../components/forms/filter/FilterAppointmentForm';
import AppointmentSearchForm from '../../components/forms/search/AppointmentSearchForm';
import PatientSearchForm from '../../components/forms/search/PatientSearchForm';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'

import FloatMenu from '../../components/floatMenu/FloatMenu';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './appointment.css';

class AppointmentPage extends Component {
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
    canDelete: false,
    appointments: null,
    searchAppointments: null,
    isLoading: false,
    seshStore: null,
    profileLoaded: false,
    sideCol: 'menuAppointment',
    startFilter: false,
    filter: {
      calendar: false,
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    menuSelect: 'list',
    subMenuState: false,
    subMenu: 'basic',
    adding: {
      state: null,
      field: null
    },
    showDetails: false,
    selectedUser: null,
    selectedPatient: null,
    selectedAppointment: null,
    creatingAppointment: false,
    newAppointment: null,
    calendarAppointments: null,
    fromGoLink: null,
    goLinkId: null,
    sublistSearch: false,
    tabKey: 'list',
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...all appointments component mounted...');

  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    if (seshStore.role === 'Admin') {
      this.setState({canDelete:true})
    }

    this.getAllPatients(seshStore);
    if (this.props.location.state) {
      if (this.props.location.state.appointment) {
        this.setState({
          fromGoLink: true,
          goLinkId: this.props.location.state.appointment
        })
      }
    }
    this.getAllAppointments(seshStore);
    if (this.props.selectedAppointment) {
      console.log('...found existing Appointment selection... loading...');
      this.setState({
        showDetails: true,
        selectedAppointment: this.props.selectedAppointment
      })
    }
  }
}
componentWillUnmount() {

}

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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      if (this.state.fromGoLink === true) {
        let goLinkAppointment = resData.data.getAllAppointments.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedAppointment: goLinkAppointment,
          tabKey: 'detail'
        })
        this.context.setUserAlert('...Check the details tab...')
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        appointments: resData.data.getAllAppointments,
        activityA: `getAllAppointments?activityId:${activityId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.parseForCalendar(resData.data.getAllAppointments)
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
        this.context.setUserAlert(resData.errors[0].message)
      }
      if (resData.data.addUserActivity.error) {
        this.context.setUserAlert(resData.data.addUserActivity.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

searchAppointments = (event) => {
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
          searchAppointments: resData.data.getAppointmentsByFieldRegex,
          activityA: `getAppointmentsByFieldRegex?activityId:${activityId},userId:${userId}`
        });
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          searchAppointments: resData.data.getAppointmentsByField,
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

onStartCreateNewAppointment = () => {
  this.setState({
    creatingAppointment: true
  })
}
cancelCreateNewAppointment = () => {
  this.setState({
    creatingAppointment: false,
    selectedPatient: null
  })
}
submitCreateNewAppointmentForm = (event) => {
  event.preventDefault();
  console.log('...creating new appointment...');
  this.context.setUserAlert('...creating new appointment...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.state.selectedPatient._id;

  const title = this.state.selectedPatient.name+'appt'+event.target.date.value;
  const type = event.target.type.value;
  const subType = '';
  const date = event.target.date.value;
  const time = event.target.time.value;
  const location = event.target.location.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  const important = event.target.important.checked;

  if (
      title.trim().length === 0 ||
      date.trim().length === 0 ||
      time.trim().length === 0 ||
      location.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    return;
  }
  console.log('foo',date);

  if (date < moment().format('YYYY-MM-DD')) {
    console.log('...ummm no! Please pick a date today or in the future...');
    this.context.setUserAlert('...ummm no! Please pick a date today or in the future...')
    this.setState({isLoading:false})
    return
  }

  let requestBody = {
    query: `
      mutation {createAppointment(
        activityId:"${activityId}",
        patientId:"${patientId}",
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
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,reminders{_id},creator{_id}}}
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
        showDetails: true,
        creatingAppointment: false,
        selectedAppointment: resData.data.createAppointment,
        newAppointment: resData.data.createAppointment,
        tabKey: 'detail',
        activityA: `createAppointment?activityId:${activityId},appointmentId:${resData.data.createAppointment._id}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      const seshStore = JSON.parse(sessionStorage.getItem('logInfo'))
      this.getAllAppointments(seshStore);
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
toggleFilter = (args) => {
  if (args === 'calendar') {
    this.setState({
      filter: {
        calendar: !this.state.calendar,
        field: this.state.field,
        key: this.state.key,
        value: this.state.value
      }
    })
  }
  this.setState({
    startFilter: !this.state.startFilter
  })
}
menuSelect = (args) => {
  this.setState({
    menuSelect: args,
    tabKey: args
  })
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
      calendar: this.state.filter.calendar,
      field: field,
      key: key,
      value: value
    }
  })
}

showDetails = (args) => {
  this.setState({
    showDetails: true,
    selectedAppointment: args,
    overlay: false,
    tabKey: 'detail',
    menuSelect: 'detail',
    subMenuState: true
  })
  this.props.selectAppointment(args);
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
selectPatient = (args) => {
  this.setState({
    selectedPatient: args
  })

}

updateAppointment = (args) => {
  console.log('...updating selected appointment...');
  this.setState({
    selectedAppointment: args
  })
  this.props.selectAppointment(args);
}
deleteAppointment = (args) => {
  console.log('...deleteing appointment...',args);
  this.context.setUserAlert('...deleteing appointment...')

  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = args._id;

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
        activityA: `deleteAppointmentById?activityId:${activityId},appointmentId:${appointmentId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.getAllAppointments({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

parseForCalendar = (args) => {
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
      calendarAppointments: calendarAppointments,
    })

}
viewCalendarEvent = (args) => {
  console.log('...viewing calendar appointment...',args.event.extendedProps.props);
  const appointment = this.state.appointments.filter(x => x._id === args.event.extendedProps.props._id)[0];
  this.setState({
    overlay: true,
    overlayStatus: {type: 'calendarAppointment', data: appointment}
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
  this.getAllPatients({activityId: this.context.activityId,token: this.context.token});
}
submitSublistSearchForm = (event) => {
  event.preventDefault()
  console.log('...searching patient sublist...');
  this.context.setUserAlert('...searching patient sublist...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = activityId;
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
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},comorbidities{type,title,description},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
          patients: resData.data.getPatientsByFieldRegex,
          activityA: `getPatientsByFieldRegex?activityId:${activityId},userId:${userId}`
        });
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          patients: resData.data.getPatientsByField,
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

resetFilter = () => {
  this.setState({
    filter: {
      field: null,
      key: null,
      value: null,
      calendar: false
    }
  })
}
clearSearch = () => {
  this.setState({
    searchAppointments: null
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
      page='appointment'
      role={this.context.role}
    />

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
        selectCalendarDetails={this.showDetails}
        toggleOverlay={this.toggleOverlay}
      />
    )}

    <Container className="topContainer">
      <Row className="">
        <h1>Appointments:
        {
          this.state.showDetails === true &&
          this.state.selectedAppointment &&
          this.state.tabKey === 'detail' && (
            this.state.selectedAppointment.title
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

      <Row className="">
        {this.state.appointments && (
          <Col md={12} className="">

          {this.state.startFilter === true && (
            <Col>
              <FilterAppointmentForm
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
                  <AppointmentList
                    filter={this.state.filter}
                    appointments={this.state.appointments}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    showDetails={this.showDetails}
                    onDelete={this.deleteAppointment}
                  />
                </Tab>
                <Tab eventKey="2" title="calendar" className="calendarTab">
                  <FullCalendar
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={this.state.calendarAppointments}
                    eventClick={this.viewCalendarEvent}
                  />
                </Tab>
              </Tabs>
            </Col>
          )}
          {this.state.menuSelect === 'search' && (
            <Col className="tabCol">
              <Col className="subTabCol">
                <h3>Search:</h3>
                <Row className="">
                  <AppointmentSearchForm
                    onConfirm={this.searchAppointments}
                    onCancel={this.clearSearch}
                  />
                </Row>
                <Row>
                  {this.state.searchAppointments && (
                    <Button variant="primary" className="centered_btn" onClick={this.toggleFilter}>Filter</Button>
                  )}
                </Row>
                <Row className="">
                  {this.state.searchAppointments && (
                    <AppointmentList
                      filter={this.state.filter}
                      appointments={this.state.searchAppointments}
                      authId={this.context.activityId}
                      showDetails={this.showDetails}
                    />
                  )}
                </Row>
              </Col>
            </Col>
          )}
          {this.state.menuSelect === 'detail' && (
            <Col className="tabCol">
              {this.state.showDetails === false &&
                !this.state.selectedAppointment &&(
                <h3>Select a Appointment to see details</h3>
              )}
              {this.state.showDetails === true &&
                this.state.selectedAppointment && (
                <AppointmentDetail
                  appointment={this.state.selectedAppointment}
                  updateAppointment={this.updateAppointment}
                  subMenu={this.state.subMenu}
                />
              )}
            </Col>
          )}
          {this.state.menuSelect === 'new' && (
            <Col className="tabCol">
            {this.state.creatingAppointment === false && (
              <Button variant="secondary" className="filterFormBtn" onClick={this.onStartCreateNewAppointment}>Create New</Button>
            )}
            {this.state.creatingAppointment === true &&
              this.state.patients &&
              !this.state.selectedPatient && (
              <Col className="subTabCol">
              <h3>Select a Patient</h3>
              <Row className="">
              <Button variant="success" className="patientSublistSearchBtn" onClick={this.startSublistSearch}>Search</Button>
              </Row>
              <Row className="">
              {this.state.sublistSearch === true && (
                <PatientSearchForm
                  onCancel={this.cancelSublistSearch}
                  onConfirm={this.submitSublistSearchForm}
                />
              )}
              </Row>
              <Row className="">
              <PatientList
                filter={this.state.filter}
                patients={this.state.patients}
                authId={this.context.activityId}
                onSelect={this.selectPatient}
                appointmentPage={true}
              />
              </Row>
              </Col>
            )}
            {this.state.creatingAppointment === true &&
              this.state.selectedPatient && (
              <Row>
                <CreateAppointmentForm
                  onConfirm={this.submitCreateNewAppointmentForm}
                  onCancel={this.cancelCreateNewAppointment}
                  patient={this.state.selectedPatient}
                />
              </Row>
            )}
            {this.state.newAppointment && (
              <Row>
                <h3>Review New Appointment {this.state.newAppointment._id}</h3>
              </Row>
            )}
            </Col>
          )}
          </Col>
        )}
      </Row>
    </Container>
    </React.Fragment>
  );

}


}

export default AppointmentPage;
