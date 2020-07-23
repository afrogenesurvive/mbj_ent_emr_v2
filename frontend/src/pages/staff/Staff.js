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

import UserList from '../../components/lists/user/UserList';

import FilterUserForm from '../../components/forms/filter/FilterUserForm';

import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './staff.css';

class StaffPage extends Component {
  state = {
    activityA: null,
    role: null,
    overlay: false,
    overlayStatus: "test",
    isGuest: true,
    context: null,
    activityUser: null,
    users: null,
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
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...all users component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    this.getAllUsers(seshStore);
  }
}
componentWillUnmount() {

}


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
      console.log('...resData...',resData.data.getAllUsers);
      let responseAlert = '...all users retrieval success!...';
      let error = null;
      if (resData.data.getAllUsers.error) {
        error = resData.data.getAllUsers.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        users: resData.data.getAllUsers,
        activityA: `getAllUsers?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.getAllUsers;
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

    <Container className="profilePageContainer">
      <Row className="profilePageContainerRow headRow">
        <Col md={9} className="profilePageContainerCol">
          <h1>Staff List</h1>
        </Col>
        <Col md={3} className="profilePageContainerCol">
          {this.state.isLoading ? (
            <Image src={loadingGif} className="loadingGif" fluid />
          ):(
            <h4>x</h4>
          )}
        </Col>
      </Row>

      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="profilePageContainerRow mainRow2">

          <Col md={2} className="profilePageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'list')}>List</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'create')}>New</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                <FilterUserForm
                  onCancel={this.toggleSideCol}
                  onConfirm={this.submitFilterForm}
                />
              </Col>
            )}
          </Col>

          {this.state.users && (
            <Col md={10} className="profilePageContainerCol specialCol2">
              <Tab.Content>
                <Tab.Pane eventKey="1">
                  <Row className="displayPaneHeadRow">
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserList
                    filter={this.state.filter}
                    users={this.state.users}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="2">
                  <h3>Create User Form</h3>
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

export default StaffPage;
