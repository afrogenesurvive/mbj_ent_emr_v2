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
import SearchUserList from '../../components/lists/user/SearchUserList';
import UserDetail from '../../components/details/UserDetail';

import FilterUserForm from '../../components/forms/filter/FilterUserForm';
import UserSearchForm from '../../components/forms/search/UserSearchForm';

import FloatMenu from '../../components/floatMenu/FloatMenu';
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
    searchUsers: null,
    isLoading: false,
    seshStore: null,
    profileLoaded: false,
    sideCol: 'menuStaff',
    startFilter: false,
    selectFilter: null,
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    menuSelect: 'list',
    subMenuState: false,
    subMenu: 'all',
    adding: {
      state: null,
      field: null
    },
    showDetails: false,
    selectedUser: null,
    canDelete: false,
    fromGoLink: null,
    goLinkId: null,
    tabKey: 'list',
  };
  static contextType = AuthContext;

componentDidMount () {
  console.log('...all users component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    if (seshStore.role === 'Admin') {
      this.setState({canDelete:true})
    }

    if (this.props.location.state) {
      if (this.props.location.state.user) {
        this.setState({
          fromGoLink: true,
          goLinkId: this.props.location.state.user
        })
      }
    }
    this.getAllUsers(seshStore);
    if (this.props.selectedUser) {
      console.log('...found existing user selection... loading...');
      this.setState({
        showDetails: true,
        selectedUser: this.props.selectedUser
      })
    }
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
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (this.state.fromGoLink === true) {
        let goLinkUser = resData.data.getAllUsers.filter(x => x._id === this.state.goLinkId)[0];
        this.setState({
          showDetails: true,
          selectedUser: goLinkUser,
          tabKey: 'detail'
        })
        this.context.setUserAlert('...Check the details tab...')
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
      if (resData.errors) {
        this.context.setUserAlert(resData.errors[0].message);
      }
      if (resData.data.error) {
        this.context.setUserAlert(resData.data.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

searchUsers = (event) => {
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
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
          searchUsers: resData.data.getUsersByFieldRegex,
          activityA: `getUsersByFieldRegex?activityId:${activityId},userId:${userId}`
        });
        this.context.activityUser = resData.data.getUsersByFieldRegex;
      }
      if (regex === false) {
        this.setState({
          isLoading: false,
          searchUsers: resData.data.getUsersByField,
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
toggleFilter = () => {
  this.setState({
    startFilter: !this.state.startFilter,
  })
}
menuSelect = (args) => {
  this.setState({
    menuSelect: args,
    tabKey: args
  })
  if (args === 'detail' && this.state.selectedUser) {
    this.setState({
      subMenuState: true
    })
  } else {
    this.setState({
      subMenuState: false
    })
  }
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
      field: field,
      key: key,
      value: value
    }
  })

}

showDetails = (args) => {
  this.setState({
    showDetails: true,
    selectedUser: args,
    tabKey: 'detail',
    menuSelect: 'detail',
    subMenuState: true
  })
  this.props.selectUser(args);
  this.props.sendSocketNotification({userId:args._id,data:`${this.context.activityId} is watching you...`});
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

updateUser = (args) => {
  console.log('...updating user...');
  this.setState({
    selectedUser: args
  })
  this.props.selectUser(args);
}
deleteUser = (args) => {
  console.log('...deleteing user...',args);
  this.context.setUserAlert('...deleteing user...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = args._id;

  let requestBody = {
    query: `
      mutation {deleteUserById(
        activityId:"${activityId}",
        userId:"${userId}"
      )
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
      // console.log('...resData...',resData.data.deleteUserById);
      let responseAlert = '...delete user success!...';
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
        activityA: `deleteUserById?activityId:${activityId},userId:${userId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.getAllUsers({activityId: activityId,token: token});
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
      value: null
    }
  })
}
clearSearch = () => {
  this.setState({
    searchUsers: null
  })
}

render() {

  return (
    <React.Fragment>
    <FloatMenu
      state={this.state.sideCol}
      menuSelect={this.menuSelect}
      subMenuState={this.state.subMenuState}
      menu={this.state.menuSelect}
      subMenu={this.state.subMenu}
      subMenuSelect={this.subMenuSelect}
      menu={this.state.menuSelect}
      page='staff'
      role={this.context.role}
    />
    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <div className="topContainer">
      <div className="headTop">
        <Row className="">
          <h1>Staff:
          {this.state.showDetails === true &&
            this.state.selectedUser &&
            this.state.tabKey === 'detail' && (
              this.state.selectedUser.name
            )}</h1>
        </Row>
        <Row className="">
            {this.state.isLoading ? (
              <Image src={loadingGif} className="loadingGif" fluid />
            ):(
              <p>.</p>
            )}
        </Row>
      </div>

      <Row className="">
        {this.state.users && (
          <Col md={12} className="">

          {this.state.startFilter === true && (
            <Col>
              <FilterUserForm
                onCancel={this.toggleFilter}
                onConfirm={this.submitFilterForm}
              />
            </Col>
          )}
          {this.state.menuSelect === 'list' && (
            <Col className="tabCol">
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter}>Filter</Button>
                <Button variant="warning" className="searchBtn" onClick={this.resetFilter}>Reset Filter</Button>
              </Col>
              <UserList
                filter={this.state.filter}
                users={this.state.users}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                showDetails={this.showDetails}
                onDelete={this.deleteUser}
              />
            </Col>
          )}
          {this.state.menuSelect === 'search' && (
            <Col className="tabCol">

              <Col className="subTabCol">
              <h3>Search</h3>
                <Row className="">
                  <UserSearchForm
                    onConfirm={this.searchUsers}
                    onCancel={this.clearSearch}
                  />
                </Row>
                <Row>
                  {this.state.searchUsers && (
                    <Button variant="primary" className="centered_btn" onClick={this.toggleFilter}>Filter</Button>
                  )}
                </Row>
                <Row className="">
                  {this.state.searchUsers && (
                    <SearchUserList
                      filter={this.state.filter}
                      users={this.state.searchUsers}
                      authId={this.context.activityId}
                      showDetails={this.showDetails}
                    />
                  )}
                </Row>
              </Col>
            </Col>
          )}
          {this.state.menuSelect === 'detail' && (
            <Col className="tabCol tabColDetail">
              {this.state.showDetails === false &&
                !this.state.selectedUser &&(
                <h3>Select a Staff Member to see details</h3>
              )}
              {this.state.showDetails === true &&
                this.state.selectedUser && (
                  <UserDetail
                    user={this.state.selectedUser}
                    updateUser={this.updateUser}
                    subMenu={this.state.subMenu}
                  />
              )}
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

export default StaffPage;
