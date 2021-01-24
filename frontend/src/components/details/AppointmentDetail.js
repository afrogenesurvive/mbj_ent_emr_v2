import React, { Component } from 'react';
import {Link} from 'react-router-dom';
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
import AddToCalendar from 'react-add-to-calendar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';
import LoadingOverlay2 from '../overlay/LoadingOverlay2';

import PatientAddressList from '../lists/patient/PatientAddressList';
import PatientNextOfKinList from '../lists/patient/PatientNextOfKinList'
import PatientAllergyList from '../lists/patient/PatientAllergyList'
import PatientMedicationList from '../lists/patient/PatientMedicationList'
import PatientImageList from '../lists/patient/PatientImageList'
import PatientFileList from '../lists/patient/PatientFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import AppointmentNoteList from '../lists/appointment/AppointmentNoteList'
import AppointmentTagList from '../lists/appointment/AppointmentTagList'
import UserList from '../lists/user/UserList'


import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';
import FilterTagForm from '../forms/filter/FilterTagForm';
import FilterUserForm from '../forms/filter/FilterUserForm';

import UpdatePatientSingleFieldForm from '../forms/add/UpdatePatientSingleFieldForm';

import AddUserForm from '../forms/add/AddUserForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddTagForm from '../forms/add/AddTagForm';
import loadingGif from '../../assets/loading.gif';
import {
  faBatteryThreeQuarters,
  faPlusSquare,
  faBatteryEmpty,
  faFolderMinus,
  faEye,
  faEraser,
  faTrashAlt,
  faBan,
  faCheckSquare,
  faExternalLinkAlt,
  faBath
} from '@fortawesome/free-solid-svg-icons';
import './details.css';

class AppointmentDetail extends Component {
  state = {
    activityA: null,
    role: null,
    overlay: false,
    overlay2: false,
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
    startFilter: false,
    selectFilter: null,
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
    selectedPatient: null,
    selectedAppointment: this.props.appointment,
    addAttachmentForm: false,
    addAttachmentArgs: null,
    showAddConsultantForm: false,
    users: null,
    calEvent: {
      title: this.props.appointment.title,
      description: this.props.appointment.description,
      location: this.props.appointment.location,
      startTime: moment.unix(this.props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00',
      endTime: moment.unix(this.props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00',
    },
  };
  static contextType = AuthContext;

constructor(props) {
  super(props);
  this.propsPatient = this.props.appointment;
}

componentDidMount () {
  console.log('...appointment details component mounted...',this.props.appointment);
  // console.log(moment.unix(this.props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00');
  let seshStore;
  if (sessionStorage.getItem('logInfo')) {
    seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
  }
  this.setState({
    selectedPatient: this.context.selectedPatient
  })
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
  this.getAllUsers(seshStore);
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
getAllUsers (args) {
  console.log('...retrieving all users...');
  this.context.setUserAlert('...retrieving all users...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;
  const userId = activityId;

  let requestBody = {
    query: `
      query {getAllUsers(
        activityId:"${activityId}" )
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description,highlighted},leave{type,startDate,endDate,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.getAllUsers);
      let responseAlert = '...all users retrieval success!...';
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
        users: resData.data.getAllUsers,
        activityA: `getAllUsers?activityId:${activityId},userId:${userId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};

submitAddNoteForm = (event) => {
  event.preventDefault();
  console.log('...adding notes...');
  this.context.setUserAlert('...adding notes...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
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
      mutation {addAppointmentNotes(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          notes:"${notes}"
        })
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
      // console.log('...resData...',resData.data.addAppointmentNotes);
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
      this.props.updateAppointment(resData.data.addAppointmentNotes)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedAppointment: resData.data.addAppointmentNotes,
        activityA: `addAppointmentNotes?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.addAppointmentNotes;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteNote = (args) => {

  console.log('...deleting notes...');
  this.context.setUserAlert('...deleting notes...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const note = args;

  let requestBody = {
    query: `
      mutation {deleteAppointmentNote(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          note:"${note}"
        })
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
      // console.log('...resData...',resData.data.deleteAppointmentNote);
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
      this.props.updateAppointment(resData.data.deleteAppointmentNote)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedAppointment: resData.data.deleteAppointmentNote,
        activityA: `deleteAppointmentNote?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.deleteAppointmentNote;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
submitAddTagForm = (event) => {
  event.preventDefault();
  console.log('...adding tags...');
  this.context.setUserAlert('...adding tags...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
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
      mutation {addAppointmentTags(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          tags:"${tags}"
        })
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
      // console.log('...resData...',resData.data.addAppointmentTags);
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
      this.props.updateAppointment(resData.data.addAppointmentTags)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedAppointment: resData.data.addAppointmentTags,
        activityA: `addAppointmentTags?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.addAppointmentTags;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteTag = (args) => {

  console.log('...deleting tags...');
  this.context.setUserAlert('...deleting tags...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const tag = args;

  let requestBody = {
    query: `
      mutation {deleteAppointmentTag(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          tag:"${tag}"
        })
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
      // console.log('...resData...',resData.data.deleteAppointmentTag);
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
      this.props.updateAppointment(resData.data.deleteAppointmentTag)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedAppointment: resData.data.deleteAppointmentTag,
        activityA: `deleteAppointmentTag?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.deleteAppointmentTag;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}

submitAddUserForm = (event) => {
  event.preventDefault();
  console.log('...adding consultant...');
  this.context.setUserAlert('...adding consultant...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = event.target.user.value;
  const appointmentId = this.props.appointment._id;

  if (
      consultantId.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  const userRole = this.state.users.filter(x => x._id === consultantId)[0].role;
  if (userRole !== 'Doctor' && userRole !== 'Nurse') {
    console.log('...please choose a Doctor or Nurse to add please...');
    this.context.setUserAlert('...please choose a Doctor or Nurse to add please...')
    return
  }

  let requestBody = {
    query: `
      mutation {addAppointmentConsultant(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        consultantId:"${consultantId}"
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
      // console.log('...resData...',resData.data.addAppointmentConsultant);
      let responseAlert = '...add consultant success!...';
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
      this.props.updateAppointment(resData.data.addAppointmentConsultant)
      this.setState({
        isLoading: false,
        overlay2: false,
        activityA: `addAppointmentConsultant?activityId:${activityId},appointmentId:${appointmentId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
      this.checkConsultantAppointments(this.props.appointment.date, consultantId)
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteConsultant = (args) => {
  console.log('...deleting consultant...');
  this.context.setUserAlert('...deleting consultant...')
  this.setState({isLoading: true, overlay2: true});
  //
  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = args._id;
  const appointmentId = this.props.appointment._id;

  let requestBody = {
    query: `
      mutation {deleteAppointmentConsultant(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        consultantId:"${consultantId}"
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
      // console.log('...resData...',resData.data.deleteAppointmentConsultant);
      let responseAlert = '...delete consultant success!...';
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
      this.props.updateAppointment(resData.data.deleteAppointmentConsultant)
      this.setState({
        isLoading: false,
        overlay2: false,
        activityA: `deleteAppointmentConsultant?activityId:${activityId},appointmentId:${appointmentId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
startUpdatePatient = () => {
  console.log('show update patient select list');
}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
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
      mutation {updateAppointmentSingleField(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        field:"${field}",
        query:"${query}"
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
      // console.log('...resData...',resData.data.updateAppointmentSingleField);
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
      this.props.updateAppointment(resData.data.updateAppointmentSingleField)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedPatient: resData.data.updateAppointmentSingleField,
        activityA: `updateAppointmentSingleField?activityId:${activityId},appointmentId:${appointmentId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.updateAppointmentSingleField;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
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
toggleFilter = (args) => {
  this.setState({
    startFilter: !this.state.startFilter,
    selectFilter: args
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

checkConsultantAppointments = (date, consultant) => {
  console.log('...checking consultant appointments',date);
  this.context.setUserAlert('...checking consultant appointments');

  const token = this.context.token;
  const activityId = this.context.activityId;
  const date2 = moment.unix(date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD');

  let requestBody = {
    query: `
      query {checkConsultantAppointments(
        activityId:"${activityId}",
        consultantId:"${consultant}",
        date:"${date2}"
      )}
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
      console.log('...resData...',resData.data.checkConsultantAppointments);
      window.alert(`Consultant has ${resData.data.checkConsultantAppointments} appointments scheduled for that date`)
      let responseAlert = `Consultant has ${resData.data.checkConsultantAppointments} appointments scheduled for that date`;
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
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}

render() {

  return (
    <React.Fragment>

    {this.state.overlay2 === true && (
      <LoadingOverlay2
        toggleOverlay2={this.toggleOverlay2}
      />
    )}

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <div className="topContainer">

      <Row className="">
        {!this.props.appointment && (
          <h3>...</h3>
        )}
      </Row>

      <Row className="">
        {this.props.appointment && (
          <Col md={12} className="">
            {
          //     this.state.startFilter === true && (
          //   <Col>
          //     {this.state.selectFilter === 'consultant' && (
          //       <FilterUserForm
          //         onCancel={this.toggleSideCol}
          //         onConfirm={this.submitFilterForm}
          //       />
          //     )}
          //     {this.state.selectFilter === 'note' && (
          //       <FilterNoteForm
          //         onCancel={this.toggleSideCol}
          //         onConfirm={this.submitFilterForm}
          //       />
          //     )}
          //     {this.state.selectFilter === 'tag' && (
          //       <FilterTagForm
          //         onCancel={this.toggleSideCol}
          //         onConfirm={this.submitFilterForm}
          //       />
          //     )}
          //   </Col>
          // )
        }

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
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.appointment.title}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.appointment.type}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'type')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">subType:</p>
                  <p className="listGroupText bold">{this.props.appointment.subType}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Time:</p>
                  <p className="listGroupText bold">{this.props.appointment.time}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'time')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Location:</p>
                  <p className="listGroupText bold">{this.props.appointment.location}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'location')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Description:</p>
                  <p className="listGroupText bold">{this.props.appointment.description}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'description')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Important:</p>
                  <p className="listGroupText bold">{this.props.appointment.important.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'important')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">In Progress:</p>
                  <p className="listGroupText bold">{this.props.appointment.inProgress.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'inProgress')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Attended:</p>
                  <p className="listGroupText bold">{this.props.appointment.attended.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'attended')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText underlined">Patient:</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Name:</p>
                  <p className="listGroupText bold">{this.props.appointment.patient.title}</p>
                  <p className="listGroupText bold">{this.props.appointment.patient.name}</p>
                  <Link
                    to={{
                      pathname: "/patients",
                      state: {patient: this.props.appointment.patient._id}
                    }}
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Id:</p>
                <p className="listGroupText bold">{this.props.appointment.patient._id}</p>
                </ListGroup.Item>
                {this.props.appointment.visit && (
                  <ListGroup.Item>
                    <p className="listGroupText">Visit:</p>
                    <p className="listGroupText bold">{this.props.appointment.visit._id}</p>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <AddToCalendar event={this.state.calEvent} />
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
                  <p className="listGroupText bold">{this.props.appointment._id}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Creator:</p>
                  <p className="listGroupText bold">{this.props.appointment.creator._id}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Consultants:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'consultant')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'consultant' && (
                  <FilterUserForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'consultant' &&
                  this.state.users && (
                    <AddUserForm
                      onConfirm={this.submitAddUserForm}
                      onCancel={this.cancelAdd}
                      filter={this.state.filter}
                      users={this.state.users}
                    />
                )}
                <UserList
                  filter={this.state.filter}
                  authId={this.context.activityId}
                  users={this.props.appointment.consultants}
                  appointmentPage={true}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteConsultant}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Notes:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'note')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'note' && (
                    <AddNoteForm
                      onConfirm={this.submitAddNoteForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <AppointmentNoteList
                  filter={this.state.filter}
                  notes={this.props.appointment.notes}
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
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'tag')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'tag' && (
                  <FilterTagForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'tag' && (
                    <AddTagForm
                      onConfirm={this.submitAddTagForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <AppointmentTagList
                  filter={this.state.filter}
                  tags={this.props.appointment.tags}
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
                  <p className="listGroupText bold">{this.props.appointment.title}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.appointment.type}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'type')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">subType:</p>
                  <p className="listGroupText bold">{this.props.appointment.subType}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date:</p>
                  <p className="listGroupText bold">{moment.unix(this.props.appointment.date.substr(0,10)).tz("America/Bogota").format('YYYY-MM-DD')}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Time:</p>
                  <p className="listGroupText bold">{this.props.appointment.time}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'time')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Location:</p>
                  <p className="listGroupText bold">{this.props.appointment.location}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'location')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Description:</p>
                  <p className="listGroupText bold">{this.props.appointment.description}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'description')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Important:</p>
                  <p className="listGroupText bold">{this.props.appointment.important.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'important')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">In Progress:</p>
                  <p className="listGroupText bold">{this.props.appointment.inProgress.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'inProgress')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Attended:</p>
                  <p className="listGroupText bold">{this.props.appointment.attended.toString()}</p>
                  <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'attended')}>Edit</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText underlined">Patient:</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Name:</p>
                  <p className="listGroupText bold">{this.props.appointment.patient.title}</p>
                  <p className="listGroupText bold">{this.props.appointment.patient.name}</p>
                  <Link
                    to={{
                      pathname: "/patients",
                      state: {patient: this.props.appointment.patient._id}
                    }}
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Id:</p>
                <p className="listGroupText bold">{this.props.appointment.patient._id}</p>
                </ListGroup.Item>
                {this.props.appointment.visit && (
                  <ListGroup.Item>
                    <p className="listGroupText">Visit:</p>
                    <p className="listGroupText bold">{this.props.appointment.visit._id}</p>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <AddToCalendar event={this.state.calEvent} />
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
                  <p className="listGroupText bold">{this.props.appointment._id}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Creator:</p>
                  <p className="listGroupText bold">{this.props.appointment.creator._id}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'consultant' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Consultants:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'consultant')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'consultant' && (
                  <FilterUserForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'consultant' &&
                  this.state.users && (
                    <AddUserForm
                      onConfirm={this.submitAddUserForm}
                      onCancel={this.cancelAdd}
                      filter={this.state.filter}
                      users={this.state.users}
                    />
                )}
                <UserList
                  filter={this.state.filter}
                  authId={this.context.activityId}
                  users={this.props.appointment.consultants}
                  appointmentPage={true}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteConsultant}
                />
              </Col>
            )}
            {this.props.subMenu === 'note' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Notes:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'note')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                </Col>

                {this.state.startFilter === true &&
                  this.state.selectFilter === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'note' && (
                    <AddNoteForm
                      onConfirm={this.submitAddNoteForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <AppointmentNoteList
                  filter={this.state.filter}
                  notes={this.props.appointment.notes}
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
                  <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'tag')}>Filter</Button>
                  <Button variant="success" className="searchBtn" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'tag' && (
                  <FilterTagForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'tag' && (
                    <AddTagForm
                      onConfirm={this.submitAddTagForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <AppointmentTagList
                  filter={this.state.filter}
                  tags={this.props.appointment.tags}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteTag}
                />
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

export default AppointmentDetail;
