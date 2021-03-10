import React, { Component } from 'react';
// import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment-timezone';

import './Auth.css';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';
import LoginForm from '../../components/forms/auth/LoginForm';
import VerifyUserForm from '../../components/forms/auth/VerifyUserForm';
import ForgotPasswordForm from '../../components/forms/auth/ForgotPasswordForm';

class LoginPage extends Component {
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
    showForm: 'login',
  };
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...login component mounted...');

  }

  submitLoginForm = (event) => {
    event.preventDefault();
    this.context.setUserAlert("...submitLoginForm...")
    console.log("...submitLoginForm...");

    const username = event.target.username.value;
    const password = event.target.password.value;

    if (
      username.trim().length === 0 ||
      password.trim().length === 0
    ) {
      this.context.setUserAlert("...blank required fields!!!...")
      return;
    }
    let requestBody = {
        query: `
          {login(username:"${username}",password:"${password}")
          {activityId,role,token,tokenExpiration,error}}`
        };

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
      console.log('...login success...');
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      if (resData.data.login.error) {
        error = resData.data.login.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      if (resData.data.login.token !== "") {
        // this.context.login(
        //   resData.data.login.token,
        //   resData.data.login.activityId,
        //   resData.data.login.role,
        //   resData.data.login.tokenExpiration
        // );
        const sessionObject = {
          token: resData.data.login.token,
          activityId: resData.data.login.activityId,
          role: resData.data.login.role,
          tokenExpiration: resData.data.login.tokenExpiration
        }
        this.context.setUserAlert(responseAlert)
       sessionStorage.setItem('logInfo', JSON.stringify(sessionObject));
       console.log('...session storage set...');
       this.setState({ activityA: `login?${sessionObject.activityId}`})
       this.logUserActivity();

       this.context.login(
         resData.data.login.token,
         resData.data.login.activityId,
         resData.data.login.role,
         resData.data.login.tokenExpiration
       );
      }
    })
    .catch(err => {
      this.context.setUserAlert(err);
    });
  };

  logUserActivity() {
    console.log('...logUserActivity...');
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    const activityId = seshStore.activityId;
    const token = seshStore.token;
    const userId = activityId;
    const request = this.state.activityA;
    const activityDate = moment().tz("America/Bogota").format('YYYY-MM-DD');
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
        if (resData.errors) {
          this.context.setUserAlert(resData.errors[0].message);
        }
        if (resData.data.addUserActivity.error) {
          this.context.setUserAlert(resData.data.addUserActivity.error);
          console.log('...resDataError...',resData.data.addUserActivity.error);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  verifyUser = (event) => {
    event.preventDefault();
    console.log('...verify user...');
    const email = event.target.email.value;
    const type = event.target.type.value;
    const code = event.target.code.value;
    const username = event.target.username.value;

    const requestBody = {
      query: `
        mutation {verifyUser(
          userInput:{
            username:"${username}",
            contactEmail:"${email}",
            verificationType:"${type}",
            verificationCode:"${code}"
          }
        )
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id},reminders{_id},activity{date,request}}}
        `};

     fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }})
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // console.log('...resData...',resData.data.verifyUser);
        let responseAlert = 'Verified...Please try loggin in again..';
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
        if (resData.data.verifyUser) {
          this.setState({showForm: 'login'})
        }

      })
      .catch(err => {
        this.context.setUserAlert(err)
      });
  }

  toggleVerification = () => {
    if (this.state.showForm === 'verify') {
      this.setState({
        showForm: 'login'
      })
    } else {
      this.setState({
        showForm: 'verify'
      })
    }

  };
  toggleForgotPassword = () => {
    if (this.state.showForm === 'forgotPassword') {
      this.setState({
        showForm: 'login'
      })
    } else {
      this.setState({
        showForm: 'forgotPassword'
      })
    }

  }

  requestPasswordReset = (event) => {
    event.preventDefault();
    console.log('...requesting password reset...');
    this.setState({isLoading: true})

    const username = event.target.username.value;
    const email = event.target.email.value;
    const requestBody = {
      query: `
         mutation {requestPasswordReset(
           userInput:{
             username:"${username}",
             contactEmail:"${email}"
           })
           {_id,username,contact{email}verification{verified,type,code}}}
        `};

     fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }})
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log('...resData...',resData.data.requestPasswordReset)

        let responseAlert = '...';
        let error = null;

        if (resData.errors) {
          this.context.setUserAlert(resData.errors[0].message);
        }
        else if (resData.data.error) {
          this.context.setUserAlert(resData.data.error);
        }
        else {

          const key = 'Request_MBJ_ENT__emr_v2_Password';
          const encryptor = require('simple-encryptor')(key);
          const encrypted = encryptor.encrypt(resData.data.requestPasswordReset.verification.code);
          const resetUrl = 'http://ec2-3-129-19-78.us-east-2.compute.amazonaws.com/passwordReset/'+resData.data.requestPasswordReset._id+'@'+encrypted+'';
          // const resetUrl = 'localhost:3000/passwordReset/'+userExists._id+'@'+encrypted+'';
          console.log('resetUrl',resetUrl);
          responseAlert = '...password reset request sent...'+'..url: '+resetUrl;

          this.context.setUserAlert(responseAlert);
          this.setState({isLoading: false, requestingPasswordReset: false});
          this.toggleForgotPassword();
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  render() {
    return (
      <Container className="authPageContainer">

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}

      {this.state.showForm === 'login' && (
        <Row className="authPageContainerRow">
          <Col className="authPageContainerCol">
            <LoginForm
              onConfirm={this.submitLoginForm}
              onStartForgotPassword={this.toggleForgotPassword}
              onStartVerification={this.toggleVerification}
            />
          </Col>
        </Row>
      )}

      {this.state.showForm === 'verify' && (
        <Row className="authPageContainerRow">
          <Col className="authPageContainerCol">
            <VerifyUserForm
              canCancel
              canConfirm
              onCancel={this.toggleVerification}
              onConfirm={this.verifyUser}
            />
          </Col>
        </Row>
      )}


      {this.state.showForm === 'forgotPassword' && (
        <Row className="authPageContainerRow">
          <Col className="authPageContainerCol">
            <ForgotPasswordForm
              onCancel={this.toggleForgotPassword}
              onConfirm={this.requestPasswordReset}
            />
          </Col>
        </Row>
      )}

      </Container>

    );
  }
}

export default LoginPage;
