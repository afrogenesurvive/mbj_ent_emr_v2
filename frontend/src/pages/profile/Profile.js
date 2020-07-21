import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
// import Button from 'react-bootstrap/Button';
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
    this.setState({sideCol: 'menu'})
  }
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
          <FontAwesomeIcon icon={faBath} className="menuSwitch" onClick={this.toggleSideCol}/>
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
                <Nav.Link eventKey="1">Basic</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2">Admin</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3">Addresses</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="4">Attendance</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="5">Leave</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="6">Images</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="7">Files</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="8">Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="9">Notes</Nav.Link>
              </Nav.Item>
            </Nav>
          )}
          {this.state.sideCol === 'filter' && (
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="10">Basic</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="11">Admin</Nav.Link>
              </Nav.Item>
            </Nav>
          )}



          </Col>
          {this.state.activityUser && (
            <Col md={10} className="profilePageContainerCol specialCol2">
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
                  <Row>
                    <p>User Address List</p>
                    <p>Filter</p>
                    <p>Add</p>
                  </Row>
                  <UserAddressList
                    filter={this.state.filter}
                    addresses={this.state.activityUser.addresses}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                  User Attendance List
                </Tab.Pane>
                <Tab.Pane eventKey="5">
                  User Leave List
                </Tab.Pane>
                <Tab.Pane eventKey="6">
                  User Image List
                </Tab.Pane>
                <Tab.Pane eventKey="7">
                  User File List
                </Tab.Pane>
                <Tab.Pane eventKey="8">
                  User Appointment List
                </Tab.Pane>
                <Tab.Pane eventKey="9">
                  User Notes:
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor, massa a volutpat pulvinar, mi tortor pulvinar dui, quis varius tellus augue sed purus. Vivamus non efficitur neque, quis elementum elit. Donec fermentum auctor est, at posuere nisl tempus nec. Etiam accumsan, risus in dignissim sagittis, turpis dui convallis metus, ac facilisis sem dui id est. Sed ut orci posuere, blandit purus pulvinar, vulputate nulla. Curabitur volutpat augue nunc, sed condimentum justo vehicula ac. Donec purus augue, viverra sed felis in, aliquet euismod mauris. Fusce vel mi ac massa posuere bibendum. In faucibus lorem nec enim ultrices, non sollicitudin turpis porta. Sed cursus, nulla at porta porttitor, enim velit dignissim nisi, vel congue libero mi non nisl. Nam gravida massa sed pulvinar finibus. Sed aliquam volutpat est, et eleifend libero vulputate quis. Vivamus lobortis tristique lacus, sed accumsan urna pharetra tristique.
                  Nulla gravida sodales diam a imperdiet. Praesent in urna justo. In feugiat cursus dolor placerat malesuada. Sed eget massa mattis, pharetra neque a, maximus est. In vitae mollis est. Maecenas rutrum euismod nunc. Vivamus eleifend mattis metus, sed fermentum diam suscipit vitae. Aliquam suscipit tellus a purus posuere, ut viverra quam convallis. Vestibulum ornare nisl eget quam feugiat, sed imperdiet nibh sodales. Nunc sit amet nisi id tortor tempor venenatis eu vitae nisi. Morbi rhoncus lorem sit amet nulla cursus tristique. Nunc semper blandit justo, id bibendum enim bibendum id. Nullam et velit in ex ullamcorper pharetra. Morbi pretium lorem sit amet tortor facilisis mollis. Fusce sit amet aliquam lacus.
                  Phasellus vestibulum vitae lorem vel finibus. Aenean tincidunt, eros ut ultrices auctor, massa massa semper quam, non gravida turpis erat quis neque. Nulla vel suscipit nisl. Ut et pellentesque mauris. Pellentesque fringilla erat nec volutpat consequat. Donec luctus libero quis elementum dictum. Aliquam ac tincidunt nibh. Nullam cursus sodales neque, vel fringilla dolor placerat at. In eget lectus lobortis, interdum libero at, ornare massa.
                  Duis interdum mauris eu nulla egestas malesuada. Integer rhoncus justo justo, tincidunt laoreet velit finibus nec. Mauris porta tempus tempus. Duis gravida ultricies nisl, vel molestie mi auctor sit amet. Praesent tincidunt orci urna, non porta neque tincidunt in. Nam lacinia, ex vel sagittis sagittis, odio neque sagittis magna, et malesuada velit enim ut lorem. Integer ac ornare leo. Sed pretium ullamcorper mi, at tempus dolor ultricies quis. Mauris lacus enim, congue in est in, consectetur volutpat turpis. Aenean venenatis mollis viverra. Pellentesque tristique sollicitudin pulvinar. Duis nec fringilla libero. Quisque dignissim, urna ut hendrerit ullamcorper, dui ligula egestas nisi, in laoreet lectus purus et arcu.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor, massa a volutpat pulvinar, mi tortor pulvinar dui, quis varius tellus augue sed purus. Vivamus non efficitur neque, quis elementum elit. Donec fermentum auctor est, at posuere nisl tempus nec. Etiam accumsan, risus in dignissim sagittis, turpis dui convallis metus, ac facilisis sem dui id est. Sed ut orci posuere, blandit purus pulvinar, vulputate nulla. Curabitur volutpat augue nunc, sed condimentum justo vehicula ac. Donec purus augue, viverra sed felis in, aliquet euismod mauris. Fusce vel mi ac massa posuere bibendum. In faucibus lorem nec enim ultrices, non sollicitudin turpis porta. Sed cursus, nulla at porta porttitor, enim velit dignissim nisi, vel congue libero mi non nisl. Nam gravida massa sed pulvinar finibus. Sed aliquam volutpat est, et eleifend libero vulputate quis. Vivamus lobortis tristique lacus, sed accumsan urna pharetra tristique.
                  Nulla gravida sodales diam a imperdiet. Praesent in urna justo. In feugiat cursus dolor placerat malesuada. Sed eget massa mattis, pharetra neque a, maximus est. In vitae mollis est. Maecenas rutrum euismod nunc. Vivamus eleifend mattis metus, sed fermentum diam suscipit vitae. Aliquam suscipit tellus a purus posuere, ut viverra quam convallis. Vestibulum ornare nisl eget quam feugiat, sed imperdiet nibh sodales. Nunc sit amet nisi id tortor tempor venenatis eu vitae nisi. Morbi rhoncus lorem sit amet nulla cursus tristique. Nunc semper blandit justo, id bibendum enim bibendum id. Nullam et velit in ex ullamcorper pharetra. Morbi pretium lorem sit amet tortor facilisis mollis. Fusce sit amet aliquam lacus.
                  Phasellus vestibulum vitae lorem vel finibus. Aenean tincidunt, eros ut ultrices auctor, massa massa semper quam, non gravida turpis erat quis neque. Nulla vel suscipit nisl. Ut et pellentesque mauris. Pellentesque fringilla erat nec volutpat consequat. Donec luctus libero quis elementum dictum. Aliquam ac tincidunt nibh. Nullam cursus sodales neque, vel fringilla dolor placerat at. In eget lectus lobortis, interdum libero at, ornare massa.
                  Duis interdum mauris eu nulla egestas malesuada. Integer rhoncus justo justo, tincidunt laoreet velit finibus nec. Mauris porta tempus tempus. Duis gravida ultricies nisl, vel molestie mi auctor sit amet. Praesent tincidunt orci urna, non porta neque tincidunt in. Nam lacinia, ex vel sagittis sagittis, odio neque sagittis magna, et malesuada velit enim ut lorem. Integer ac ornare leo. Sed pretium ullamcorper mi, at tempus dolor ultricies quis. Mauris lacus enim, congue in est in, consectetur volutpat turpis. Aenean venenatis mollis viverra. Pellentesque tristique sollicitudin pulvinar. Duis nec fringilla libero. Quisque dignissim, urna ut hendrerit ullamcorper, dui ligula egestas nisi, in laoreet lectus purus et arcu.
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
