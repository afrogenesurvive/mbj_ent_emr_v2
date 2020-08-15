import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';

import PatientList from '../../components/lists/patient/PatientList';
import AppointmentList from '../../components/lists/appointment/AppointmentList';
import QueueItem from '../../components/items/queue/QueueItem';
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
      {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
        {_id,active,title,name,lastName,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
      console.log('...resData...',resData.data.getQueueToday);
      console.log('...retrieve recent patients success!...');
      let responseAlert = '...retrieve recent patients success!...';
      let error = null;
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

        <Button variant="outline-secondary" size="md" onClick={this.loadHome}>Load</Button>
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
        {this.state.queueToday && (
          <React.Fragment>
          <Button variant="outline-primary" onClick={this.startAddQueueSlot}>Add</Button>
          <QueueItem
            queue={this.state.queueToday}
          />

          {this.state.addingQueueSlot === true &&
            this.state.queueSlotAddStage === 1 && (
            <p>add queue slot patient</p>
          )}
          {this.state.addingQueueSlot === true &&
            this.state.queueSlotAddStage === 2 && (
            <p>add queue slot consultant</p>
          )}
          </React.Fragment>
        )}
      </Col>
      </Row>

      <Row className="landingPageRow">
      <Col md={5}className="landingPageCol">
        <h3>Weeks important</h3>
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
