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

import UserAddressList from '../../components/lists/user/UserAddressList'
import UserAttendanceList from '../../components/lists/user/UserAttendanceList'
import UserLeaveList from '../../components/lists/user/UserLeaveList'
import UserImageList from '../../components/lists/user/UserImageList'
import UserFileList from '../../components/lists/user/UserFileList'
import UserAppointmentList from '../../components/lists/user/UserAppointmentList'
import UserNoteList from '../../components/lists/user/UserNoteList'

import FilterAddressForm from '../../components/forms/filter/FilterAddressForm';
import FilterAttendanceForm from '../../components/forms/filter/FilterAttendanceForm';
import FilterLeaveForm from '../../components/forms/filter/FilterLeaveForm';
import FilterImageForm from '../../components/forms/filter/FilterImageForm';
import FilterFileForm from '../../components/forms/filter/FilterFileForm';
import FilterNoteForm from '../../components/forms/filter/FilterNoteForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './profile.css';

class MyProfilePage extends Component {
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
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...MyProfile component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    this.getThisUser(seshStore);
  }
}
componentWillUnmount() {

}


getThisUser (args) {
  console.log('...retrieving your profile info...');
  this.context.setUserAlert('...retrieving your profile info...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;
  const userId = activityId;

  let requestBody = {
    query: `
      query {getUserById(
        activityId:"${activityId}",
        userId:"${userId}"
      )
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
      // console.log('...resData...',resData.data.getUserById);
      let responseAlert = '...profile retrieval success!...';
      let error = null;
      if (resData.data.getUserById.error) {
        error = resData.data.getUserById.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        activityUser: resData.data.getUserById,
        activityA: `getUserById?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.getUserById;
      this.logUserActivity(args);
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
  console.log('foo',value === 'false');
  if (value === 'true') {
    value = true
  }
  if (value === 'false') {
    value = false
  }
  console.log('bar',value === false);
  this.setState({
    filter: {
      field: field,
      key: key,
      value: value
    }
  })

}

addAddress = () => {

}

render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <Container className="profilePageContainer">
      <Row className="profilePageContainerRow headRow">
        <Col md={9} className="profilePageContainerCol">
          <h1> My Profile</h1>
        </Col>
        <Col md={3} className="profilePageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <h4>x</h4>
          )}
        </Col>
      </Row>

      <Row className="profilePageContainerRow mainRow">
        <Col md={2} className="profilePageContainerCol">

        </Col>
        <Col md={10} className="profilePageContainerCol">
          {!this.state.activityUser && (
            <h3>...</h3>
          )}
          {this.state.activityUser && (
            <h3>{this.state.activityUser.username}</h3>
          )}
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="profilePageContainerRow mainRow2">
          <Col md={2} className="profilePageContainerCol specialCol1">

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
                <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'attendance')}>Attendance</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'leave')}>Leave</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="6" onClick={this.menuSelect.bind(this, 'image')}>Images</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="7" onClick={this.menuSelect.bind(this, 'file')}>Files</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="8" onClick={this.menuSelect.bind(this, 'appointment')}>Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="9" onClick={this.menuSelect.bind(this, 'note')}>Notes</Nav.Link>
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
              {this.state.menuSelect === 'attendance' && (
                <FilterAttendanceForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.menuSelect === 'leave' && (
                <FilterLeaveForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
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
                <p>Appointments Filter Form</p>
              )}
              {this.state.menuSelect === 'note' && (
                <FilterNoteForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              )}
            </Col>

          )}
          </Col>

          {this.state.activityUser && (
            <Col md={10} className="profilePageContainerCol specialCol2">

              <h3> xxx </h3>

              <Tab.Content>
                <Tab.Pane eventKey="1">
                  User Basic:
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Title:</p>
                      <p className="listGroupText bold">{this.state.activityUser.title}</p>
                      <p className="listGroupText">Name:</p>
                      <p className="listGroupText bold">{this.state.activityUser.name}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Username:</p>
                      <p className="listGroupText bold">{this.state.activityUser.username}</p>
                      <p className="listGroupText">Role:</p>
                      <p className="listGroupText bold">{this.state.activityUser.role}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Reg No:</p>
                      <p className="listGroupText bold">{this.state.activityUser.registrationNumber}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">DOB:</p>
                      <p className="listGroupText bold">{this.state.activityUser.dob}</p>
                      <p className="listGroupText">Age:</p>
                      <p className="listGroupText bold">{this.state.activityUser.age}</p>
                      <p className="listGroupText">Gender:</p>
                      <p className="listGroupText bold">{this.state.activityUser.gender}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <p className="listGroupText">Email:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.email}</p>
                    <p className="listGroupText">Phone:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.phone}</p>
                    <p className="listGroupText">Phone 2:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.phone2}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p></p>
                      <p></p>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="2">
                  User Admin
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Id:</p>
                      <p className="listGroupText bold">{this.state.activityUser._id}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">LoggedIn:</p>
                      <p className="listGroupText bold">{this.state.activityUser.loggedIn.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">ClientConnected:</p>
                      <p className="listGroupText bold">{this.state.activityUser.clientConnected.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Verified:</p>
                      <p className="listGroupText bold">{this.state.activityUser.verification.verified.toString()}</p>
                      <p className="listGroupText">Type:</p>
                      <p className="listGroupText bold">{this.state.activityUser.verification.type}</p>
                      <p className="listGroupText">Code:</p>
                      <p className="listGroupText bold">{this.state.activityUser.verification.code}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="3">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Address List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.addAddress}>Add</Button>
                  </Row>
                  <UserAddressList
                    filter={this.state.filter}
                    addresses={this.state.activityUser.addresses}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Attendance List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserAttendanceList
                    filter={this.state.filter}
                    attendance={this.state.activityUser.attendance}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="5">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Leave List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserLeaveList
                    filter={this.state.filter}
                    leave={this.state.activityUser.leave}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="6">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Image List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserImageList
                    filter={this.state.filter}
                    images={this.state.activityUser.images}
                    authId={this.state.activityUser._id}showListDetails={this.showListDetails}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="7">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User File List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserFileList
                    filter={this.state.filter}
                    files={this.state.activityUser.files}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="8">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Appointment List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserAppointmentList
                    filter={this.state.filter}
                    appointments={this.state.activityUser.appointments}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="9">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Notes:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserNoteList
                    filter={this.state.filter}
                    notes={this.state.activityUser.notes}
                    authId={this.state.activityUser._id}
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

export default MyProfilePage;
