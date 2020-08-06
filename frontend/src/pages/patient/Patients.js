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
import moment from 'moment';

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
    creatingPatient: false,
    newPatient: null,
    fromGoLink: null,
    goLinkId: null,
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
      }
    }
    this.getAllPatients(seshStore);
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
      if (this.state.fromGoLink === true) {
        let goLinkPatient = resData.data.getAllPatients.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedPatient: goLinkPatient
        })
        this.context.setUserAlert('...Check the details tab...')
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        patients: resData.data.getAllPatients,
        activityA: `getAllPatients?activityId:${activityId},userId:${userId}`
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
        {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
        {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id,date,time,title,type,subType},reminders{_id},activity{date,request}}}
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
        if (resData.data.getPatientsByFieldRegex.error) {
          error = resData.data.getPatientsByFieldRegex.error;
          responseAlert = error;
        }
      }
      if (regex === false) {
        if (resData.data.getPatientsByField.error) {
          error = resData.data.getPatientsByField.error;
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

  const active = event.target.active.value;
  const title = event.target.title.value;
  const name = event.target.name.value;
  const username = event.target.username.value;
  const dob = event.target.dob.value;
  const role = event.target.role.value;
  const gender = event.target.gender.value;
  const contactEmail = event.target.contactEmail.value;
  const contactPhone = event.target.contactPhone.value;
  const contactPhone2 = event.target.contactPhone2.value;
  const addressNumber = event.target.addressNumber.value;
  const addressStreet = event.target.addressStreet.value;
  const addressTown = event.target.addressTown.value;
  const addressCity = event.target.addressCity.value;
  const addressParish = event.target.addressParish.value;
  const addressCountry = event.target.addressCountry.value;
  const addressPostalCode = event.target.addressPostalCode.value;
  const referralDate = event.target.referralDate.value;
  const referralReason = event.target.referralReason.value;
  const referralPhysicianName = event.target.referralPhysicianName.value;
  const referralPhysicianPhone = event.target.referralPhysicianPhone.value;
  const referralPhysicianEmail = event.target.referralPhysicianEmail.value;
  const referralPhysicianAddress = event.target.referralPhysicianAddress.value;
  const attendingPhysician = event.target.attendingPhysician.value;
  const occupationRole = event.target.occupationRole.value;
  const occupationEmployerName = event.target.occupationEmployerName.value;
  const occupationEmployerEmail = event.target.occupationEmployerEmail.value;
  const occupationEmployerPhone = event.target.occupationEmployerPhone.value;
  const occupationEmployerAddress = event.target.occupationEmployerAddress.value;
  const insuranceCompany = event.target.insuranceCompany.value;
  const insurancePolicyNumber = event.target.insurancePolicyNumber.value;
  const insuranceDescription = event.target.insuranceDescription.value;
  const insuranceExpiryDate = event.target.insuranceExpiryDate.value;
  const insuranceSubscriberCompany = event.target.insuranceSubscriberCompany.value;
  const insuranceSubscriberDescription = event.target.insuranceSubscriberDescription.value;

  if (
      active.trim().length === 0 ||
      title.trim().length === 0 ||
      name.trim().length === 0 ||
      username.trim().length === 0 ||
      dob.trim().length === 0 ||
      role.trim().length === 0 ||
      gender.trim().length === 0 ||
      contactEmail.trim().length === 0 ||
      contactPhone.trim().length === 0 ||
      contactPhone2.trim().length === 0
    ) {
    this.context.setUserAlert("...blank fields!!!...")
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
      // console.log('...resData...',resData.data.createPatient);
      let responseAlert = '...create patient success!...';
      let error = null;
      if (resData.data.createPatient.error) {
        error = resData.data.createPatient.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        showDetails: true,
        creatingPatient: false,
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

  this.setState({
    showDetails: true,
    selectedPatient: args
  })
  this.context.selectedPatient = args;
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
      // console.log('...resData...',resData.data.deletePatientById);
      let responseAlert = '...delete patient success!...';
      let error = null;
      if (resData.data.deletePatientById.error) {
        error = resData.data.deletePatientById.error;
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

render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <Container className="staffPageContainer">
      <Row className="staffPageContainerRow headRow">
        <Col md={9} className="staffPageContainerCol">
          <h1>Patient List</h1>
        </Col>
        <Col md={3} className="staffPageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <p>.</p>
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
                <FilterPatientForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              </Col>
            )}
          </Col>

          {this.state.patients && (
            <Col md={10} className="staffPageContainerCol specialCol2">
              <Tab.Content>
                <Tab.Pane eventKey="1">
                  <Row className="displayPaneHeadRow">
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                    <PatientList
                      filter={this.state.filter}
                      patients={this.state.patients}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      showDetails={this.showDetails}
                      onDelete={this.deletePatient}
                    />
                </Tab.Pane>
                <Tab.Pane eventKey="2">
                <Col className="userSearchCol">
                  <h3>Search Patient</h3>
                  <Row className="userSearchRow">
                    <PatientSearchForm
                      onConfirm={this.searchPatients}
                    />
                  </Row>
                  <Row>
                    {this.state.searchPatients && (
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    )}
                  </Row>
                  <Row className="userSearchRow results">
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
                </Tab.Pane>
                <Tab.Pane eventKey="3">
                {this.state.showDetails === true &&
                  this.state.selectedPatient && (
                  <PatientDetail
                    patient={this.state.selectedPatient}
                    updatePatient={this.updatePatient}
                  />
                )}
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                {this.state.creatingPatient === false && (
                  <Button variant="outline-secondary" className="filterFormBtn" onClick={this.onStartCreateNewPatient}>Create New</Button>
                )}
                {this.state.creatingPatient === true && (
                  <CreatePatientForm
                    onConfirm={this.submitCreateNewPatientForm}
                    onCancel={this.cancelCreateNewPatient}
                  />
                )}
                {this.state.newPatient && (
                  <Row>
                    <h3>Review New Patient</h3>
                    {this.state.newPatient.username}
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

export default PatientPage;
