import React, { Component } from 'react';
// import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useParams, NavLink, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';

import './Auth.css';
import AuthContext from '../../context/auth-context';
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';
import ResetPasswordForm from '../../components/forms/auth/ResetPasswordForm';

class PasswordResetPage extends Component {
  state = {
    role: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    activeTab: "choose",
    passwordResetStatus: null,
    user: {},
    activityA: null,
    activityId: null,
    verfCode: null,
  };
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...password component mounted...');
    console.log();
    this.setState({
      activityId: this.props.location.pathname.split('@')[0].split('/')[2],
      verfCode: this.props.location.pathname.split('@')[1]
    })
  }


  submitResetPasswordForm = (event) => {
    event.preventDefault();
    this.context.setUserAlert("...submitSignupForm...")
    console.log("...submitSignupForm...");

    const password = event.target.password.value;
    const verificationCode = this.state.verfCode;
    const userId = this.state.activityId;
    if (password.trim().length === 0 ||
        verificationCode.trim().length === 0
        ) {
      this.context.setUserAlert("...blank required fields!!!...");
      return;
    }
    let requestBody = {
        query: `
            mutation {resetUserPassword(
              userId:"${userId}",
              userInput:{
                verificationCode:"${verificationCode}",
                password:"${password}"
              })
            {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id},reminders{_id},activity{date,request}}}
          `};
     fetch('http://ec2-3-129-19-78.us-east-2.compute.amazonaws.com/graphql', {
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
      console.log('...resData...',resData.data.resetUserPassword);
      let responseAlert = '...Password Reset Success!...';
      let error = null;

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert);
      this.setState({passwordResetStatus: 'success'})
      return <Redirect to="/login"/>
    })
    .catch(err => {
      this.context.setUserAlert(err);
    });
  };


  render() {
    return (
      <Container className="authPageContainer">
        {this.state.overlay === true && (
          <LoadingOverlay
            status={this.state.overlayStatus}
          />
        )}
        <Row className="authPageContainerRow">
          <Col className="authPageContainerCol">
          {this.state.passwordResetStatus !== 'success' && (
            <ResetPasswordForm
              onConfirm={this.submitResetPasswordForm}
              verf={this.state.verfCode}
            />
          )}
          {this.state.passwordResetStatus === 'success' && (
            <React.Fragment>
              <h1>Reset Success...Proceed to Login</h1>
            </React.Fragment>
          )}


          </Col>
        </Row>
      </Container>

    );
  }
}

export default PasswordResetPage;
