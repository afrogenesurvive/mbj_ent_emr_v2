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
  };
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...login component mounted...');
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

  getThisUser() {
    console.log("get this user...");
    const activityId = sessionStorage.getItem('activityId');
    const token = sessionStorage.getItem('token');
    const requestBody = {
      query: `
        query {getThisUser(activityId:"${activityId}")
        {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,name,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path},socialMedia{platform,handle,link}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title,time},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},toTeachLessons{_id,title,category,price},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,sessionTitle,lesson{_id,title,sku,price}},reviews{_id,date,type,title,author{_id,username},lesson{_id,title},body,rating},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username},subject,message,read},orders{_id,date,time,type,totals{a,b,c},buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
      `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }})
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const thisUser = resData.data.getThisUser;
        this.context.user = thisUser;
        this.setState({ activityA: '...autoLogin by '+thisUser._id+''})
        // this.logUserActivity();
        this.retrieveLogin();
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
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

  verifyUser = (event) => {
    event.preventDefault();
    console.log('...verify user...');
    const contactEmail = event.target.formGridEmail.value;
    const verificationType = event.target.formGridType.value;
    const verificationCode = event.target.formGridCode.value;

    const requestBody = {
      query: `
      mutation {verifyUser(
        userInput:{
          contactEmail:"${contactEmail}",
          verificationType:"${verificationType}",
          verificationCode:"${verificationCode}"
        })
      {_id,name,role,username,dob,public,age,addresses{type,number,street,town,city,country,postalCode,primary},contact{phone,phone2,email},bio,profileImages{name,type,path},socialMedia{platform,handle,link},interests,perks{_id},promos{_id},friends{_id,username,loggedIn,clientConnected,contact{phone,phone2,email},profileImages{name,type,path}},points,tags,loggedIn,clientConnected,verification{verified,type,code},activity{date,request},likedLessons{_id,title,category,price},bookedLessons{date,session{date,title},ref{_id,title,category,price}},attendedLessons{date,ref{_id,title,category,price}},taughtLessons{date,ref{_id,title,category,price}},wishlist{date,ref{_id,title,category,price},booked},cart{dateAdded,sessionDate,lesson{_id,title,sku,price}},reviews{_id,date,type,title},comments{_id},messages{_id,date,time,type,sender{_id,username},receiver{_id,username}},orders{_id,date,time,type,buyer{_id},receiver{_id},lessons{price,ref{_id}}},paymentInfo{date,type,description,body,valid,primary},friendRequests{date,sender{_id,username},receiver{_id,username}}}}
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
        // console.log(resData.data.verifyUser);
        this.setState({userAlert: 'Verified...Please try loggin in again..'});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  startVerification = () => {
    this.setState({verifying: true})
  };
  closeVerification = () => {
    this.setState({verifying: false})
  };

  startForgotPassword = () => {
    this.setState({requestingPasswordReset: true})
  }
  cancelPasswordReset = () => {
    this.setState({requestingPasswordReset: false})
  }

  requestPasswordReset = (event) => {
    event.preventDefault();
    console.log('...requesting password reset...');
    this.setState({isLoading: true})

    const username = event.target.formGridUsername.value;
    const email = event.target.formGridEmail.value;

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
        // console.log(resData)
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message});
        } else {
          this.setState({userAlert: '...password reset email sent...',isLoading: false, requestingPasswordReset: false});
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }


  render() {
    return (
      <Container className="loginPageContainer">
      <AlertBox
        authId={this.context.activityId}
        alert={this.state.userAlert}
      />
      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}
      <Row className="loginPageContainerRow2">
        <Col className="loginPageContainerCol2">
          <LoginForm
            onConfirm={this.submitLoginForm}
          />
        </Col>
      </Row>

        {this.state.requestingPasswordReset === true && (
          <Row>
            <Col>
              <ForgotPasswordForm
                onCancel={this.cancelPasswordReset}
                onConfirm={this.requestPasswordReset}
              />
            </Col>
          </Row>
        )}
        <Row className="loginPageContainerRow2">
          <Col className="loginPageContainerCol2">
            <Button variant="outline-primary" onClick={this.startVerification}>Verify</Button>
            {this.state.verifying === true && (
              <VerifyUserForm
                canCancel
                canConfirm
                onCancel={this.closeVerification}
                onConfirm={this.verifyUser}
              />
            )}
          </Col>
        </Row>
      </Container>

    );
  }
}

export default LoginPage;
