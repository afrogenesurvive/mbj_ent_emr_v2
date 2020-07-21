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
import SignupForm from '../../components/forms/auth/SignupForm';

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
    signupStatus: null,
  };
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...signup component mounted...');
    // this.context.setUserAlert('...signup component mounted...')
  }


  submitSignupForm = (event) => {
    event.preventDefault();
    this.context.setUserAlert("...submitSignupForm...")
    console.log("...submitSignupForm...");

    const email = event.target.email.value;
    const password = event.target.password.value;
    const role = event.target.role.value;
    const name = event.target.name.value;
    const title = event.target.title.value;
    const username = event.target.username.value;
    const dob = event.target.dob.value;
    const gender = event.target.gender.value;
    const phone = event.target.phone.value;
    const phone2 = event.target.phone2.value;
    const addressNumber = event.target.addressNumber.value;
    const addressStreet = event.target.addressStreet.value;
    const addressTown = event.target.addressTown.value;
    const addressCity = event.target.addressCity.value;
    const addressParish = event.target.addressParish.value;
    const addressCountry = event.target.addressCountry.value;
    const addressPostalCode = event.target.addressPostalCode.value;

    if (email.trim().length === 0 ||
        password.trim().length === 0 ||
        role.trim().length === 0 ||
        name.trim().length === 0 ||
        username.trim().length === 0 ||
        dob.trim().length === 0 ||
        gender.trim().length === 0 ||
        phone.trim().length === 0 ||
        phone2.trim().length === 0 ||
        addressNumber.trim().length === 0 ||
        addressStreet.trim().length === 0 ||
        addressTown.trim().length === 0 ||
        addressCity.trim().length === 0 ||
        addressParish.trim().length === 0 ||
        addressCountry.trim().length === 0 ||
        addressPostalCode.trim().length === 0
        ) {
      this.context.setUserAlert("...blank fields!!!...");
      return;
    }
    let requestBody = {
        query: `
            mutation {createUser(
              userInput:{
                password:"${password}",
                title:"${title}",
                name:"${name}",
                role:"${role}",
                username:"${username}",
                dob:"${dob}",
                gender:"${gender}",
                contactPhone:"${phone}",
                contactPhone2:"${phone2}",
                contactEmail:"${email}",
                addressNumber:${addressNumber},
                addressStreet:"${addressStreet}",
                addressTown:"${addressTown}",
                addressCity:"${addressCity}",
                addressParish:"${addressParish}",
                addressCountry:"${addressCountry}",
                addressPostalCode:"${addressPostalCode}"
              }
            )
            {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id},reminders{_id},activity{date,request}}}
          `};
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
      console.log('...resData...',resData.data.createUser);
      let responseAlert = '...Signup success!...';
      let error = null;
      if (resData.data.createUser.error) {
        error = resData.data.createUser.error;
        responseAlert = error;
      }
      responseAlert = '...verificationCode: '+resData.data.createUser.verification.code+'';
      this.context.setUserAlert(responseAlert);
      this.setState({signupStatus: 'success'})
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
          {this.state.signupStatus !== 'success' && (
            <SignupForm
              onConfirm={this.submitSignupForm}
            />
          )}
          {this.state.signupStatus === 'success' && (
            <React.Fragment>
              <h1>SignUp Success...Proceed to Login</h1>
              <Button variant="outline-warning" className="loginFormBtn">
                <NavLink to="/login">Login</NavLink>
              </Button>
            </React.Fragment>
          )}
          </Col>
        </Row>
      </Container>

    );
  }
}

export default SignUpPage;
