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

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'

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
    selectedAppointment: null,
    creatingAppointment: false,
    newAppointment: null,
    calendarAppointments: null,
    fromGoLink: null,
    goLinkId: null,
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
      if (resData.data.getAllAppointments.error) {
        error = resData.data.getAllAppointments.error;
        responseAlert = error;
      }
      if (this.state.fromGoLink === true) {
        let goLinkAppointment = resData.data.getAllAppointments.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedAppointment: goLinkAppointment
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
      if (resData.data.getAllPatients.error) {
        error = resData.data.getAllPatients.error;
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
        console.log('...resData...',resData.data.getAppointmentsByFieldRegex);
      }
      if (regex === false) {
        console.log('...resData...',resData.data.getAppointmentsByField);
      }

      let responseAlert = '...appointment search success!...';
      let error = null;

      if (regex === true) {
        if (resData.data.getAppointmentsByFieldRegex.error) {
          error = resData.data.getAppointmentsByFieldRegex.error;
          responseAlert = error;
        }
      }
      if (regex === false) {
        if (resData.data.getAppointmentsByField.error) {
          error = resData.data.getAppointmentsByField.error;
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

  const title = event.target.title.value;
  const type = event.target.type.value;
  const subType = event.target.subType.value;
  const date = event.target.date.value;
  const time = event.target.time.value;
  const location = event.target.location.value;
  const description = event.target.description.value;
  const important = event.target.important.value;

  // if (
  //     active.trim().length === 0 ||
  //   ) {
  //   this.context.setUserAlert("...blank fields!!!...")
  //   return;
  // }

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
      console.log('...resData...',resData.data.createAppointment);
      let responseAlert = '...create appointment success!...';
      let error = null;
      if (resData.data.createAppointment.error) {
        error = resData.data.createAppointment.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        showDetails: true,
        creatingAppointment: false,
        selectedAppointment: resData.data.createAppointment,
        newAppointment: resData.data.createAppointment,
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

showDetails = (args) => {
  // console.log('bar',args.visits);
  this.setState({
    showDetails: true,
    selectedAppointment: args,
    overlay: false
  })
  this.context.selectedAppointment = args;
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
      if (resData.data.deleteAppointmentById.error) {
        error = resData.data.deleteAppointmentById.error;
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
      calendarAppointments: calendarAppointments
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
          <h1>Appointment List</h1>
        </Col>
        <Col md={3} className="staffPageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <h4>x</h4>
          )}
        </Col>
      </Row>

      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="staffPageContainerRow mainRow2">

          <Col md={2} className="staffPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'list')}>List</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'search')}>Search</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'detail')}>Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'new')}>New</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                <FilterAppointmentForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              </Col>
            )}
          </Col>

          {this.state.appointments && (
            <Col md={10} className="staffPageContainerCol specialCol2">
              <Tab.Content>
                <Tab.Pane eventKey="1">

                <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                  <Tab eventKey="1" title="list">
                  <Row className="displayPaneHeadRow">
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                    <AppointmentList
                      filter={this.state.filter}
                      appointments={this.state.appointments}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      showDetails={this.showDetails}
                      onDelete={this.deleteAppointment}
                    />
                  </Tab>
                  <Tab eventKey="2" title="calendar">
                    <h3>Calendar</h3>
                    <FullCalendar
                      defaultView="dayGridMonth"
                      plugins={[dayGridPlugin]}
                      events={this.state.calendarAppointments}
                      eventClick={this.viewCalendarEvent}
                    />
                  </Tab>
                </Tabs>


                </Tab.Pane>
                <Tab.Pane eventKey="2">
                <Col className="userSearchCol">
                  <h3>Search Appointment</h3>
                  <Row className="userSearchRow">
                    <AppointmentSearchForm
                      onConfirm={this.searchAppointments}
                    />
                  </Row>
                  <Row>
                    {this.state.searchAppointments && (
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    )}
                  </Row>
                  <Row className="userSearchRow results">
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
                </Tab.Pane>
                <Tab.Pane eventKey="3">
                {this.state.showDetails === true &&
                  this.state.selectedAppointment && (
                  <AppointmentDetail
                    appointment={this.state.selectedAppointment}
                    updateAppointment={this.updateAppointment}
                  />
                )}
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                {this.state.creatingAppointment === false && (
                  <Button variant="outline-secondary" className="filterFormBtn" onClick={this.onStartCreateNewAppointment}>Create New</Button>
                )}
                {this.state.creatingAppointment === true &&
                  this.state.patients &&
                  !this.state.selectedPatient && (
                  <Row>
                    <PatientList
                      filter={this.state.filter}
                      patients={this.state.patients}
                      authId={this.context.activityId}
                      onSelect={this.selectPatient}
                      appointmentPage={true}
                    />
                  </Row>
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

export default AppointmentPage;
