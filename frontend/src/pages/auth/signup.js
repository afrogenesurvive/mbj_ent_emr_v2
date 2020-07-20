import React, { Component } from 'react';
// import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';

import './Auth.css';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';
// import SignupForm from '../../components/forms/auth/SignupForm';

class SignUpPage extends Component {
  state = {
    verifying: false,
    role: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    activeTab: "choose",
    userSeshStore: false,
    user: {},
    activityA: null,
    requestingPasswordReset: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...signup component mounted...');
  }


  submitLoginForm = (event) => {
    event.preventDefault();
    this.setState({ userAlert: "...submitLoginForm..."})
    console.log("...submitLoginForm...");

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      this.setState({ userAlert: "...blank fields!!!..."})
      return;
    }
    let requestBody = {
        query: `
          {login(email:"${email}",password:"${password}"){activityId,role,token,tokenExpiration,error}}`};
    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // console.log('...resData...',resData.data.login);
      let responseAlert = '...login success!...';
      let error = null;
      if (resData.data.login.error) {
        error = resData.data.login.error;
        responseAlert = error;
      }
      this.setState({userAlert: responseAlert})
      if (resData.data.login.token !== "") {
        this.context.login(
          resData.data.login.token,
          resData.data.login.activityId,
          resData.data.login.role,
          resData.data.login.tokenExpiration
        );
        const sessionObject = {
          token: resData.data.login.token,
          activityId: resData.data.login.activityId,
          role: resData.data.login.role,
          tokenExpiration: resData.data.login.tokenExpiration
        }
       sessionStorage.setItem('logInfo', JSON.stringify(sessionObject));
       this.setState({ activityA: `login?${sessionObject.activityId}`})
       this.logUserActivity();
      }
    })
    .catch(err => {
      this.setState({userAlert: err});
    });
  };

  logUserActivity() {
    console.log('...logUserActivity...');
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    const activityId = seshStore.activityId;
    const token = seshStore.token;
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


  render() {
    return (
      <Container className="authPageContainer">
        <AlertBox
          authId={this.context.activityId}
          alert={this.state.userAlert}
        />
        {this.state.overlay === true && (
          <LoadingOverlay
            status={this.state.overlayStatus}
          />
        )}
        <Row className="authPageContainerRow2">
          <Col className="authPageContainerCol2">

          </Col>
        </Row>
      </Container>

    );
  }
}

export default SignUpPage;
