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
import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';

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
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class AppointmentDetail extends Component {
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
      startTime: moment.unix(this.props.appointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00',
      endTime: moment.unix(this.props.appointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00',
    },
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.propsPatient = this.props.appointment;
  }

componentDidMount () {
  console.log('...appointment details component mounted...');
  // console.log(moment.unix(this.props.appointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')+'T'+this.props.appointment.time+':00-05:00');
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
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const notes = event.target.notes.value;

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentNotes)
      this.setState({
        isLoading: false,
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
      this.setState({isLoading: false })
    });
}
deleteNote = (args) => {

  console.log('...deleting notes...');
  this.context.setUserAlert('...deleting notes...')
  this.setState({isLoading: true});

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.deleteAppointmentNote)
      this.setState({
        isLoading: false,
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
  const appointmentId = this.props.appointment._id;
  const tags = event.target.tags.value;

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentTags)
      this.setState({
        isLoading: false,
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
      this.setState({isLoading: false })
    });
}
deleteTag = (args) => {

  console.log('...deleting tags...');
  this.context.setUserAlert('...deleting tags...')
  this.setState({isLoading: true});

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.deleteAppointmentTag)
      this.setState({
        isLoading: false,
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
      this.setState({isLoading: false })
    });
}

submitAddUserForm = (event) => {
  event.preventDefault();
  console.log('...adding consultant...');
  this.context.setUserAlert('...adding consultant...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = event.target.user.value;
  const appointmentId = this.props.appointment._id;

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentConsultant)
      this.setState({
        isLoading: false,
        activityA: `addAppointmentConsultant?activityId:${activityId},appointmentId:${appointmentId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteConsultant = (args) => {
  console.log('...deleting consultant...');
  this.context.setUserAlert('...deleting consultant...')
  this.setState({isLoading: true});
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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.deleteAppointmentConsultant)
      this.setState({
        isLoading: false,
        activityA: `deleteAppointmentConsultant?activityId:${activityId},appointmentId:${appointmentId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
startUpdatePatient = () => {
  console.log('show update patient select list');
}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

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
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.updateAppointmentSingleField)
      this.setState({
        isLoading: false,
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
          {!this.props.appointment && (
            <h3>...</h3>
          )}
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="detailPageContainerRow mainRow2">
          <Col md={3} className="detailPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column subMenu">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'basic')}>Basic</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'admin')}>Admin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'consultant')}>Consultants</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'note')}>Notes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'tag')}>Tags</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                {this.state.menuSelect === 'consultant' && (
                  <FilterUserForm
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

          {this.props.appointment && (
            <Col md={9} className="detailPageContainerCol specialCol2">
              {this.state.updateSingleField.state === true && (
                <UpdatePatientSingleFieldForm
                  field={this.state.updateSingleField.field}
                  onConfirm={this.submitUpdateSingleFieldForm}
                  onCancel={this.cancelUpdateSingleField}
                />
              )}
                <Tab.Content className="tabContent">
                  <Tab.Pane eventKey="1">
                    Appointment Basic:
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
                        <p className="listGroupText">subType:</p>
                        <p className="listGroupText bold">{this.props.appointment.subType}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Date:</p>
                        <p className="listGroupText bold">{moment.unix(this.props.appointment.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
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
                        <p className="listGroupText">In Progress:</p>
                        <p className="listGroupText bold">{this.props.appointment.inProgress.toString()}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'inProgress')}>Edit</Button>
                        <p className="listGroupText">Attended:</p>
                        <p className="listGroupText bold">{this.props.appointment.attended.toString()}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'attended')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Patient:</p>
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
                        >Go!
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
                        <p className="listGroupText">Export:</p>
                        <AddToCalendar event={this.state.calEvent} />
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="2">
                    Appointment Admin
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
                  </Tab.Pane>
                  <Tab.Pane eventKey="3">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Appointment Consultant List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                      )}
                    </Row>
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
                  </Tab.Pane>
                  <Tab.Pane eventKey="4">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Appointment Note List:</p>
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
                    <AppointmentNoteList
                      filter={this.state.filter}
                      notes={this.props.appointment.notes}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteNote}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="5">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Appointment Tag List:</p>
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
                    <AppointmentTagList
                      filter={this.state.filter}
                      tags={this.props.appointment.tags}
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

export default AppointmentDetail;
