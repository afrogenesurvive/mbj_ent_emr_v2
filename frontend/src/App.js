import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import logo from './logo.svg';
import './App.css';

import AlertBox from './components/alertBox/AlertBox';
import MainNavigation from './components/Navigation/MainNavigation';
import LandingPage from './pages/landing/Landing';
import HomePage from './pages/landing/Home';
import HomePage2 from './pages/landing/Home2';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';

import AuthContext from './context/auth-context';
import io from 'socket.io-client';

import './App.css';

class App extends Component {
  state = {
    token: null,
    activityId: null,
    role: null,
    context: this.context,
    sessionStorageAuth: JSON.parse(sessionStorage.getItem('logInfo')),
    sessionCookiePresent: false,
    passwordResetState: 'incomplete',
    passwordResetMessage: '...',
    userAlert: null,
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.sessionStorageAuth = JSON.parse(sessionStorage.getItem('logInfo'));
    this.socket = io('http://localhost:9099');
  }

  login = (token, activityId, role, tokenExpiration) => {
    console.log('...context login...');
    this.setState({
      token: token,
      activityId: activityId,
      role: role,
      sessionStorageAuth: {
        token: token,
        activityId: activityId,
        role: role,
        tokenExpiration: tokenExpiration
      }
    });
    this.sessionStorageAuth = {
      token: token,
      activityId: activityId,
      role: role,
      tokenExpiration: tokenExpiration
    }
    this.context.token = token;
    this.context.activityId = activityId;
    this.context.role = role;
  };

  logout = () => {
      this.logout2();
  };

  componentDidMount() {
    console.log('...app component mounted...');
    if (sessionStorage.getItem('logInfo') && this.state.token === null) {
      console.log('...sessionStorageFound...');
      const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
      this.login(
        seshStore.token,
        seshStore.activityId,
        seshStore.role,
        seshStore.tokenExpiration,
      )
    }
    if (!this.sessionStorageAuth) {
      console.log('...noSessionStorageFound...');
    }
    this.socket.emit('unauthorizedClientConnect');
    console.log("socket listening....");
  }

  componentWillUnmount() {
    console.log('...app component un-mounting...');
  }

  logout2 () {
    console.log('...logging you out...');
    const token = this.context.token;
    const activityId = this.context.activityId;
    const requestBody = {
      query:`
        query{logout(
          activityId:"${activityId}")
        {_id,loggedIn}}
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

        this.setState({
           token: null,
           activityId: null,
           role: null,
           sessionCookiePresent: null,
           sessionStorageAuth: null,
        });
        this.sessionStorageAuth = null;
        sessionStorage.clear();
        this.context = {
          token: null,
          activityId: null,
          activityA: null,
          role: null,
          userId: null,
          user: {},
          users:[],
          selectedUser: null,
          sender: null,
          receiver: null,
          userAlert: "...",
          file: null,
          fancyDate: null,
          login: this.login,
          logout: this.logout,
        };

      })
      .catch(err => {
        console.log(err);
        // this.setState({userAlert: err});
      });
  }

  passwordReset = (event) => {
    event.preventDefault();
    console.log('...reset password submission...');
      const params = event.target.formGridParams.value.split('@');
      const verificationCode = params[1];
      const userId = params[0];
      const password = event.target.formGridPassword.value;
      // console.log('params',params);

      const requestBody = {
        query:`
          mutation {resetUserPassword(
            userId:"${userId}",
            verification:"${verificationCode}",
            userInput:{
              password:"${password}"
            })
            {_id,password,verification{verified}}}
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
          console.log('passwordReset',resData);
          if (resData.errors) {
            this.setState({passwordResetState: 'error', passwordResetMessage: resData.errors[0].message+'..if not, try making a new reset request..' })
          } else {
            this.setState({passwordResetState: 'complete' })
          }

        })
        .catch(err => {
          console.log(err);
          this.setState({passwordResetState: 'error', passwordResetMessage: err })
        });
  }
  cancelPasswordReset = () => {
    this.setState({passwordResetState: 'cancelled'})
  }

  setUserAlert = (args) => {
    console.log('...setUserAlert...',args);
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              activityId: this.state.activityId,
              activityA: null,
              role: this.state.role,
              userId: null,
              user: {},
              users:[],
              selectedUser: {},
              sender: null,
              receiver: null,
              userAlert: "...",
              file: null,
              fancyDate: null,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation
              role={this.state.role}
            />
            <AlertBox
              authId={this.context.activityId}
              alert={this.state.userAlert}
            />
            <main className="main-content">
              <Switch>

              {this.state.sessionStorageAuth && (
                <Redirect from="/login" to="/home" exact />
              )}

              {this.state.sessionStorageAuth && (
                <Route path="/home" render={(props) => <HomePage {...props}
                  title="home"
                />}/>
              )}
              {this.state.sessionStorageAuth && (
                <Route path="/home2" render={(props) => <HomePage2 {...props}
                  title="home2"
                />}/>
              )}

              {this.state.sessionStorageAuth && (
                <Redirect from="/" to="/home" exact />
              )}
              {this.state.sessionStorageAuth && (
                <Redirect from="*" to="/home" exact />
              )}



              {!this.state.sessionStorageAuth && (
                <Route path="/landing" render={(props) => <LandingPage {...props}
                  title="landing"
                />}/>
              )}
              {!this.state.sessionStorageAuth && (
                <Route path="/login" render={(props) => <LoginPage {...props}
                  title="login"
                />}/>
              )}
              {!this.state.sessionStorageAuth && (
                <Route path="/signup" render={(props) => <SignupPage {...props}
                  title="signup"
                />}/>
              )}

              {!this.state.sessionStorageAuth && (
                <Redirect from="/home" to="/landing" exact />
              )}
              {!this.state.sessionStorageAuth && (
                <Redirect from="/" to="/landing" exact />
              )}
              {!this.state.sessionStorageAuth && (
                <Redirect from="*" to="/landing" exact />
              )}

              </Switch>
            </main>

          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
