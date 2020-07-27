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
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';

import UserAddressList from '../lists/user/UserAddressList'
import UserAttendanceList from '../lists/user/UserAttendanceList'
import UserLeaveList from '../lists/user/UserLeaveList'
import UserImageList from '../lists/user/UserImageList'
import UserFileList from '../lists/user/UserFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import UserNoteList from '../lists/user/UserNoteList'

import FilterAddressForm from '../forms/filter/FilterAddressForm';
import FilterAttendanceForm from '../forms/filter/FilterAttendanceForm';
import FilterLeaveForm from '../forms/filter/FilterLeaveForm';
import FilterImageForm from '../forms/filter/FilterImageForm';
import FilterFileForm from '../forms/filter/FilterFileForm';
import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';

import UpdateSingleFieldForm from '../forms/add/UpdateSingleFieldForm';
import AddAddressForm from '../forms/add/AddAddressForm';
import AddAttendanceForm from '../forms/add/AddAttendanceForm';
import AddLeaveForm from '../forms/add/AddLeaveForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddImageForm from '../forms/add/AddImageForm';
import AddFileForm from '../forms/add/AddFileForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class PatientDetail extends Component {
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
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    // this.props2 = this.props;
  }

componentDidMount () {
  console.log('...patient details component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
  }
  this.setState({
    selectedPatient: this.context.selectedPatient
  })
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
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

submitAddAddressForm = (event) => {
  event.preventDefault();
  console.log('...adding address...');
  this.context.setUserAlert('...adding address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.state.selectedUser._id;
  const number = event.target.number.value;
  const street = event.target.street.value;
  const town = event.target.town.value;
  const city = event.target.city.value;
  const parish = event.target.parish.value;
  const country = event.target.country.value;
  const postalCode = event.target.postalCode.value;

  let requestBody = {
    query: `
      mutation {addUserAddress(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${number},
          addressStreet:"${street}",
          addressTown:"${town}",
          addressCity:"${city}",
          addressParish:"${parish}",
          addressCountry:"${country}",
          addressPostalCode:"${postalCode}"
        })
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
      // console.log('...resData...',resData.data.addUserAddress);
      let responseAlert = '...address add success!...';
      let error = null;
      if (resData.data.addUserAddress.error) {
        error = resData.data.addUserAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.addUserAddress,
        activityA: `addUserAddress?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.addUserAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteAddress = (args) => {
  console.log('...deleting address...');
  this.context.setUserAlert('...deleting address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.state.selectedUser._id;

  let requestBody = {
    query: `
      mutation {deleteUserAddress(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}",
          addressPrimary: ${args.primary}
        })
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
      // console.log('...resData...',resData.data.deleteUserAddress);
      let responseAlert = '...address delete success!...';
      let error = null;
      if (resData.data.deleteUserAddress.error) {
        error = resData.data.deleteUserAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.deleteUserAddress,
        activityA: `deleteUserAddress?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedPatient = resData.data.deleteUserAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
setAddressPrimary = (args) => {
  console.log('...setting primary address...');
  this.context.setUserAlert('...setting primary address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.state.selectedUser._id;

  let requestBody = {
    query: `
      mutation {setUserAddressPrimary(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}"
        })
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
      // console.log('...resData...',resData.data.setUserAddressPrimary);
      let responseAlert = '...address set primary success!...';
      let error = null;
      if (resData.data.setUserAddressPrimary.error) {
        error = resData.data.setUserAddressPrimary.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.setUserAddressPrimary,
        activityA: `setUserAddressPrimary?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedPatient = resData.data.setUserAddressPrimary;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.state.selectedUser._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  let requestBody = {
    query: `
      mutation {updateUserSingleField(
        activityId:"${activityId}",
        userId:"${userId}",
        field:"${field}",
        query:"${query}"
      )
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
      // console.log('...resData...',resData.data.updateUserSingleField);
      let responseAlert = '...field update success!...';
      let error = null;
      if (resData.data.updateUserSingleField.error) {
        error = resData.data.updateUserSingleField.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedPatient: resData.data.updateUserSingleField,
        activityA: `updateUserSingleField?activityId:${activityId},userId:${userId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedPatient = resData.data.updateUserSingleField;
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
          {!this.state.selectedPatient && (
            <h3>...</h3>
          )}
          {this.state.selectedPatient && (
            <h3>{this.state.selectedPatient.username}</h3>
          )}
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="detailPageContainerRow mainRow2">
          <Col md={2} className="detailPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'basic')}>Basic</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'admin')}>Admin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'address')}>Addresses</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'nextOfKin')}>Next Of Kin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'allergy')}>Allergies</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="6" onClick={this.menuSelect.bind(this, 'medication')}>Medication</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="7" onClick={this.menuSelect.bind(this, 'image')}>Images</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="8" onClick={this.menuSelect.bind(this, 'file')}>Files</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="9" onClick={this.menuSelect.bind(this, 'appointment')}>Appointments</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="10" onClick={this.menuSelect.bind(this, 'visit')}>Appointments</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="11" onClick={this.menuSelect.bind(this, 'note')}>Notes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="12" onClick={this.menuSelect.bind(this, 'tag')}>Tag</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                {this.state.menuSelect === 'address' && (
                  <FilterAddressForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'nextOfKin' && (
                  <h3>Next of Kin Filter form</h3>
                )}
                {this.state.menuSelect === 'allergy' && (
                  <h3>Allergy Filter form</h3>
                )}
                {this.state.menuSelect === 'medication' && (
                  <h3>Medication Filter form</h3>
                )}
                {this.state.menuSelect === 'image' && (
                  <FilterImageForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'file' && (
                  <FilterFileForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'appointment' && (
                  <FilterAppointmentForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'visit' && (
                  <h3>Visit Filter Form</h3>
                )}
                {this.state.menuSelect === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'tag' && (
                  <h3>Tag Filter Form</h3>
                )}
              </Col>

            )}
          </Col>

          {this.state.selectedPatient && (
            <Col md={10} className="detailPageContainerCol specialCol2">
              <h3> xxx </h3>
              {this.state.updateSingleField.state === true && (
                <UpdateSingleFieldForm
                  field={this.state.updateSingleField.field}
                  onConfirm={this.submitUpdateSingleFieldForm}
                  onCancel={this.cancelUpdateSingleField}
                />
              )}
              <Tab.Content>
                <Tab.Pane eventKey="1">
                  Patient Basic:
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Title:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.title}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                      <p className="listGroupText">Name:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.name}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                      <p className="listGroupText">Username:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.username}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">DOB:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                      <p className="listGroupText">Age:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.age}</p>
                      <p className="listGroupText">Gender:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.gender}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Email:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.contact.email}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                      <p className="listGroupText">Phone:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.contact.phone}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                      <p className="listGroupText">Phone 2:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.contact.phone2}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Role:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.role}</p>
                      <p className="listGroupText">Registration:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.registration.date.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.registration.number}</p>
                      <p className="listGroupText">Expiry Date:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.expiryDate.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <p className="listGroupText">Referral:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.referral.date.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.referral.reason}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.name}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.email}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.referral.physician.phone}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Attending Physician:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.attendingPhysician}</p>
                      <p className="listGroupText">Occupation:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.occupation.role}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.name}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.phone}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.email}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.occupation.employer.address}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Insurance:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.insurance.company}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.insurance.policyNumber}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.insurance.description}</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedPatient.insurance.expiryDate.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.insurance.subscriber.company}</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.insurance.subscriber.description}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="2">
                  Patient Admin
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Id:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient._id}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">LoggedIn:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.loggedIn.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">ClientConnected:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.clientConnected.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Verified:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.verification.verified.toString()}</p>
                      <p className="listGroupText">Type:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.verification.type}</p>
                      <p className="listGroupText">Code:</p>
                      <p className="listGroupText bold">{this.state.selectedPatient.verification.code}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="3">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Address List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'address' && (
                      <AddAddressForm
                        onConfirm={this.submitAddAddressForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <UserAddressList
                    filter={this.state.filter}
                    addresses={this.state.selectedPatient.addresses}
                    authId={this.context.activityId}
                    onDelete={this.deleteAddress}
                    canDelete={this.state.canDelete}
                    makePrimary={this.setAddressPrimary}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Next of Kin List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'nextOfKin')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'nextOfKin' && (
                      <h3>Add next of kin form</h3>
                  )}
                  <h3>patient nextOfKin list</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="5">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Allergies List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'allergy')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'allergy' && (
                      <h3>Add allergy form</h3>
                  )}
                  <h3>Patient Allergy List</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="6">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Medication List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'medication')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'medication' && (
                      <h3>Add medication form</h3>
                  )}
                  <h3>Patient Medication List</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="7">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Image List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'image' && (
                      <AddImageForm
                        onConfirm={this.submitAddImageForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <h3>Patient Image List</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="8">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient File List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'file' && (
                      <AddFileForm
                        onConfirm={this.submitAddFileForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <h3>Patient File List</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="9">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Appointment List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserAppointmentList
                    filter={this.state.filter}
                    appointments={this.state.selectedPatient.appointments}
                    authId={this.context.activityId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="10">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Visit List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <h3>Patient Visit List</h3>
                </Tab.Pane>
                <Tab.Pane eventKey="11">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Notes:</p>
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
                  <UserNoteList
                    filter={this.state.filter}
                    notes={this.state.selectedPatient.notes}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteNote}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="12">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">Patient Tags:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'tag')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'tag' && (
                      <h3>Add Patient Tags</h3>
                  )}
                  <h3>Patient Tag List</h3>
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

export default PatientDetail;
