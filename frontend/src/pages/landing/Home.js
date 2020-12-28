import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import moment from 'moment';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';

import PatientList from '../../components/lists/patient/PatientList';
import AppointmentList from '../../components/lists/appointment/AppointmentList';
import QueueItem from '../../components/items/queue/QueueItem';
import PatientSearchForm from '../../components/forms/search/PatientSearchForm';
import UserSearchForm from '../../components/forms/search/UserSearchForm';
import UserList from '../../components/lists/user/UserList';
import loadingGif from '../../assets/loading.gif';
import './landing.css';

class HomePage extends Component {
  state = {
    role: null,
    userAlert: "landing",
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
    isLoading: false,
    seshStore: null,
    filter: {
      field: null,
      key: null,
      value: null
    },
    todayAppointments: null,
    queue: null,
    weekImportantAppointments: null,
    recentPatients: null,
    queueToday: null,
    addingQueueSlot: false,
    queueSlotAddStage: null,
    users: null,
    patients: null,
    selectedUser: null,
    selectedPatient: null,
    sublistPatientSearch: false,
    sublistUserSearch: false,
  };
  static contextType = AuthContext;


componentDidMount () {
  console.log('...home component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));

    this.getAppointmentsToday(seshStore);
    this.getAppointmentsImportantWeek(seshStore);
    this.getRecentPatients(seshStore);
    this.getQueueToday(seshStore);
    this.getAllPatients(seshStore);
    this.getAllUsers(seshStore);

  }
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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      });
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
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
      console.log('...all users retrieval success!...');
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
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};

loadHome = () => {
  const args = {
    token: this.context.token,
    activityId: this.context.activityId
  }

  this.getAppointmentsToday(args);
  this.getAppointmentsImportantWeek(args);
  this.getRecentPatients(args);
  this.getQueueToday(args);
  this.getAllPatients(args);
  this.getAllUsers(args);

}

getAppointmentsToday = (args) => {
  console.log('...retrieving todays appointments...');
  this.context.setUserAlert('...retrieving todays appointments...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getAppointmentsToday(
        activityId:"${activityId}")
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
      // console.log('...resData...',resData.data.getAppointmentsToday);
      console.log('...get todays appointments success!...');
      let responseAlert = '...get todays appointments success!...';
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
        todayAppointments: resData.data.getAppointmentsToday,
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

getAppointmentsImportantWeek = (args) => {
  console.log('...retrieving important appointments for week...');
  this.context.setUserAlert('...retrieving important appointments for week...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getAppointmentsImportantNextWeek(
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
      // console.log('...resData...',resData.data.getAppointmentsImportantNextWeek);
      console.log('...get week important appointments success!...');
      let responseAlert = '...get week important appointments success!...';
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
        weekImportantAppointments: resData.data.getAppointmentsImportantNextWeek,
      });
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

getRecentPatients = (args) => {
  console.log('...retrieving recent patients...');
  this.context.setUserAlert('...retrieving recent patients...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getRecentPatients(
        activityId:"${activityId}",
        amount:7
      )
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.getRecentPatients);
      console.log('...retrieve recent patients success!...');
      let responseAlert = '...retrieve recent patients success!...';
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
        recentPatients: resData.data.getRecentPatients,
      });
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

getQueueToday = (args) => {
  console.log('...retrieving todays queue...');
  this.context.setUserAlert('...retrieving todays queue...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;

  let requestBody = {
    query: `
      query {getQueueToday(
        activityId:"${activityId}"
      )
      {_id,date,currentSlot,slots{number,time,patient{_id,username,name},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      // console.log('...resData...',resData.data.getQueueToday);
      console.log('...retrieve recent patients success!...');
      let responseAlert = '...retrieve recent patients success!...';
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
        queueToday: resData.data.getQueueToday,
      });
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

toggleOverlay = () => {
  this.setState({
    overlay: false
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

startAddQueueSlot = () => {
  this.setState({
    addingQueueSlot: true,
    queueSlotAddStage: 1
  })
}
cancelAddQueueSlot = () => {
  this.setState({
    addingQueueSlot: false,
    queueSlotAddStage: null
  })
}
createQueue = () => {
  console.log('...creating new queue...');
  this.context.setUserAlert('...creating new queue...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;

  let requestBody = {
    query: `
      mutation {createQueue(
        activityId:"${activityId}"
      )
        {_id,date,currentSlot,slots{number,time,patient{_id,username},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      // console.log('...resData...',resData.data.getRecentPatients);
      console.log('...create queue success!...');
      let responseAlert = '...create queue success!...';
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
        queueToday: resData.data.createQueue,
      });
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}

submitQueueSlotAddPatient = (args) => {
  const queuePatients = this.state.queueToday.slots.map(x=> x.patient._id)
  const existingPatient = queuePatients.includes(args._id);
  console.log('1:',args);
  console.log('2:',queuePatients);
  console.log('3:',existingPatient);
  if (existingPatient === true ) {
    console.log('...this patient is already in the queue!...');
    this.context.setUserAlert('...this patient is already in the queue!...')
  } else {
    this.setState({
      selectPatient: args,
      queueSlotAddStage: 2
    })
  }

}
submitQueueSlotAddConsultant = (args) => {
  console.log('...creating new queue...');
  this.context.setUserAlert('...creating new queue...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const queueId = this.state.queueToday._id;
  const patientId = this.state.selectPatient._id;
  const consultantId = args._id;

  if (args.role !== 'Nurse' && args.role !== 'Doctor') {
    console.log('...please choose a nurse or doctor...');
    this.context.setUserAlert('...please choose a nurse or doctor...')
    this.setState({isLoading: false})
    return
  }

  let requestBody = {
    query: `
      mutation {addQueueSlot(
        activityId:"${activityId}",
        queueId:"${queueId}",
        patientId:"${patientId}",
        consultantId:"${consultantId}"
      )
      {_id,date,slots{number,time,patient{_id,username,name,lastName},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      console.log('...add queue slot success!...');
      let responseAlert = '...add queue slot success!...';
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
        queueToday: resData.data.addQueueSlot,
        addingQueueSlot: false,
        queueSlotAddStage: null,
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}
queueSlotSeen = (args) => {
  console.log('...updating queue slot...');
  this.context.setUserAlert('...updating queue slot...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const queueId = this.state.queueToday._id;
  const slotNumber = args.number;

  let requestBody = {
    query: `
      mutation {queueSlotSeen(
        activityId:"${activityId}",
        queueId:"${queueId}",
        queueInput:{
          slotNumber:${slotNumber}
        })
        {_id,date,slots{number,time,patient{_id,username,name,lastName},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      // console.log('...resData...',resData.data.queueSlotSeen);
      console.log('...update queue slot seen success!...');
      let responseAlert = '...update queue slot seen success!...';
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
        queueToday: resData.data.queueSlotSeen,
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}
queueSlotUnseen = (args) => {
  console.log('...updating queue slot...');
  this.context.setUserAlert('...updating queue slot...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const queueId = this.state.queueToday._id;
  const slotNumber = args.number;

  let requestBody = {
    query: `
      mutation {queueSlotUnseen(
        activityId:"${activityId}",
        queueId:"${queueId}",
        queueInput:{
          slotNumber:${slotNumber}
        })
        {_id,date,slots{number,time,patient{_id,username,name,lastName},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      // console.log('...resData...',resData.data.queueSlotUnseen);
      console.log('...update queue slot unseen success!...');
      let responseAlert = '...update queue slot unseen success!...';
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
        queueToday: resData.data.queueSlotUnseen,
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}
deleteQueSlot = (args) => {
  console.log('...deleting queue slot...');
  this.context.setUserAlert('...deleting queue slot...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const queueId = this.state.queueToday._id;
  const slotNumber = args.number;

  let requestBody = {
    query: `
      mutation {deleteQueueSlot(
        activityId:"${activityId}",
        queueId:"${queueId}",
        queueInput:{
          slotNumber:${slotNumber}
        })
        {_id,date,slots{number,time,patient{_id,username,name,lastName},consultant{_id,username,role},seen,seenTime},creator{_id,username,role}}}
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
      // console.log('...resData...',resData.data.deleteQueueSlot);
      console.log('...delete queue slot success!...');
      let responseAlert = '...delete queue slot success!...';
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
        queueToday: resData.data.deleteQueueSlot,
      });

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}

startPatientSearch = () => {
  this.setState({sublistPatientSearch: true})
}
cancelSublistPatientSearch = () => {
  this.setState({
    sublistPatientSearch: false
  })
  this.getAllPatients({
    activityId: this.context.activityId,
    token: this.context.token
   })
}
submitSublistPatientSearchForm = (event) => {
  event.preventDefault();
  console.log('...searching patients...');
  this.context.setUserAlert('...searching patients...')
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
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2},highlighted},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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

startUserSearch = () => {
  this.setState({sublistUserSearch: true})
}
cancelSublistUserSearch = () => {
  this.setState({
    sublistUserSearch: false
  })
  this.getAllUsers({
    activityId: this.context.activityId,
    token: this.context.token
   })
}
submitSublistUserSearchForm = (event) => {
  event.preventDefault();
  console.log('...searching users...');
  this.context.setUserAlert('...searching users...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = activityId;

  const field = event.target.field.value;
  const query = event.target.query.value;
  let regex = true;
  if (field === 'age' ||
      field === 'dob' ||
      field === 'employmentDate' ||
      field === 'addresses.number' ||
      field === 'addresses.primary' ||
      field === 'loggedIn' ||
      field === 'clientConnected' ||
      field === 'verification.verified' ||
      field === 'attendance.date' ||
      field === 'leave.startDate' ||
      field === 'leave.endDate'
    ) {
      regex = false;
  }
  console.log('regex',regex);

  let requestBody;
  if (regex === true) {
    requestBody = {
      query: `
        query {getUsersByFieldRegex(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description,highlighted},leave{type,startDate,endDate,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
      `};
  }
  if (regex === false) {
    requestBody = {
      query: `
        query {getUsersByField(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description,highlighted},leave{type,startDate,endDate,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
        // console.log('...resData...',resData.data.getUsersByFieldRegex);
      }
      if (regex === false) {
        // console.log('...resData...',resData.data.getUsersByField);
      }

      let responseAlert = '...staff search success!...';
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
          users: resData.data.getUsersByFieldRegex,
          activityA: `getUsersByFieldRegex?activityId:${activityId},userId:${userId}`
        });
        this.context.activityUser = resData.data.getUsersByFieldRegex;
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          users: resData.data.getUsersByField,
          activityA: `getUsersByField?activityId:${activityId},userId:${userId}`
        });
        this.context.activityUser = resData.data.getUsersByField;
      }

      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}

selectPatient = (args) => {
  console.log('...selecting...');
  this.setState({
    selectedPatient: args
  })
}
selectUser = (args) => {
  console.log('...selecting...');
  this.setState({
    selectedUser: args
  })
}



  render() {

    return (
      <React.Fragment>

      {
        this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
          toggleOverlay={this.toggleOverlay}
        />
      )
    }
      <Container className="landingPageContainer">

      <Row className="landingPageTopRow">

        <Button variant="secondary" size="md" onClick={this.loadHome}>Refresh</Button>
        {this.state.isLoading ? (
          <Image src={loadingGif} className="loadingGif" fluid />
        ):(
          <p>.</p>
        )}

      </Row>

      <Row className="landingPageRow">
      <Col md={6} className="landingPageCol">
        <h3>Todays appts</h3>
        {this.state.todayAppointments && (
          <AppointmentList
            filter={this.state.filter}
            appointments={this.state.todayAppointments}
            authId={this.context.activityId}
            homePage={true}
          />
        )}
      </Col>
      <Col md={6} className="landingPageCol">
        <h3>Queue</h3>
        {!this.state.queueToday && (
          <React.Fragment>
            <Button variant="secondary" onClick={this.createQueue}>New</Button>
          </React.Fragment>
        )}
        {this.state.queueToday && (
          <React.Fragment>
          {this.state.addingQueueSlot !== true && (
            <OverlayTrigger
              key={'right'}
              placement={'right'}
              overlay={
                <Popover id={`popover-positioned-${'right'}`}>
                  <Popover.Content>
                    <strong>Add Patient to Queue</strong>
                  </Popover.Content>
                </Popover>
              }
            >
              <FontAwesomeIcon icon={faUserPlus} className="listIcon" onClick={this.startAddQueueSlot}/>
            </OverlayTrigger>

          )}
          {this.state.addingQueueSlot === true && (
            <Button variant="danger" onClick={this.cancelAddQueueSlot}>Cancel</Button>
          )}

          {
            this.state.addingQueueSlot === true &&
            this.state.queueSlotAddStage === 1 && (
              <React.Fragment>
              <p>Adding Queue Slot: Patient</p>
              <Button variant="primary" onClick={this.startPatientSearch}>Search</Button>
              <Row className="patientSubListRow">
              {this.state.sublistPatientSearch === true && (
                <PatientSearchForm
                  onCancel={this.cancelSublistPatientSearch}
                  onConfirm={this.submitSublistPatientSearchForm}
                />
              )}
              </Row>
              <Row className="patientSubListRow">
              <PatientList
                filter={this.state.filter}
                patients={this.state.patients}
                authId={this.context.activityId}
                onSelect={this.submitQueueSlotAddPatient}
                appointmentPage={true}
              />
              </Row>
              </React.Fragment>
          )}
        {
          this.state.addingQueueSlot === true &&
          this.state.queueSlotAddStage === 2 && (
            <React.Fragment>
            <p>Adding Queue Slot: Consultant</p>
            <Button variant="primary" onClick={this.startUserSearch}>Search</Button>
            <Row className="patientSubListRow">
            {this.state.sublistUserSearch === true && (
              <UserSearchForm
                onCancel={this.cancelSublistUserSearch}
                onConfirm={this.submitSublistUserSearchForm}
              />
            )}
            </Row>
            <Row className="patientSubListRow">
            <UserList
              filter={this.state.filter}
              users={this.state.users}
              authId={this.context.activityId}
              selectUser={this.submitQueueSlotAddConsultant}
              homePage={true}
            />
            </Row>
            </React.Fragment>
        )}

          <QueueItem
            queue={this.state.queueToday}
            slotSeen={this.queueSlotSeen}
            slotUnseen={this.queueSlotUnseen}
            onDelete={this.deleteQueSlot}
          />
          </React.Fragment>
        )}
      </Col>
      </Row>

      <Row className="landingPageRow">
      <Col md={5}className="landingPageCol">
        <h3>Week's important</h3>
        {this.state.weekImportantAppointments && (
          <AppointmentList
            filter={this.state.filter}
            appointments={this.state.weekImportantAppointments}
            authId={this.context.activityId}
            homePage={true}
          />
        )}
      </Col>
      <Col md={4}className="landingPageCol">
        <h3>Recent patients</h3>
        {this.state.recentPatients && (
          <PatientList
            filter={this.state.filter}
            patients={this.state.recentPatients}
            authId={this.context.activityId}
            homePage={true}
          />
        )}
      </Col>
      <Col md={3}className="landingPageCol">
        <h3>more stats</h3>
      </Col>
      </Row>

      </Container>

      </React.Fragment>
    );

  }


}

export default HomePage;
