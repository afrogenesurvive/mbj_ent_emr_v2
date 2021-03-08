import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
// import logo from './logo.svg';
import './App.css';

import AlertBox from './components/alertBox/AlertBox';
import MainNavigation from './components/Navigation/MainNavigation';
import LandingPage from './pages/landing/Landing';
import HomePage from './pages/landing/Home';
import MyProfilePage from './pages/profile/Profile';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/signup';
import PasswordResetPage from './pages/auth/PasswordReset';
import StaffPage from './pages/staff/Staff';
import PatientPage from './pages/patient/Patients';
import AppointmentPage from './pages/appointment/Appointment';
import VisitPage from './pages/visit/Visit';

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
    userAlertArray: [],
    selectedUser: null,
    selectedPatient: null,
    selectedAppointment: null,
    selectedVisit: null,
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
      },
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
    this.userOnline();
  };

  logout = () => {
      this.logout2();
  };

  componentDidMount() {
    console.log('1:',this.socket);
    // console.log('2:',this.socket2);
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

    this.socket.on('admin_msg', function(data) {
      console.log('...receiving admin msg client...',data);
      adminMessage(data);
    });
    this.socket.on('receive_notification', function(data) {
      console.log('...receiving notification client...',data);
      sendNotification(data);
    });

    // this.socket.on('conversation private post', function(data) {
    //   console.log("you got a new message..",data);
      // addMessage(data);
    // });
    const sendNotification = data => {
      // console.log('notification user alert',data);
      this.setState({
        userAlert: data.msg })
    };
    const adminMessage = data => {
      // console.log('admin message user alert',data);
      this.setState({
        userAlert: data.msg.msg })
    };

  }


  sendSocketMessage (msgObject) {
    const message = msgObject;
    console.log("sending socket message  ",'message',message,'this.socket',this.socket);
    this.setState({userAlert: 'sending socket message  '+'message'+message+'this.socket'+this.socket})
    let conversationId = null;
    if (this.context.receiver === null || this.context.receiver === undefined) {
      console.log("select someone to msg 1st...");
      this.setState({userAlert: "select someone to msg 1st..."});
      return
    }
    else {
      conversationId = this.context.receiver._id;
    }

    this.socket.emit('send message', {
      room: 'msg'+conversationId,
      message: message
    });
    this.socket.on("MESSAGE_SENT", function(data) {

      addMessage(data)
    })

    const addMessage = data => {
      this.setState({ userAlert: data.msg})
    };
  };
  sendSocketAdminMessage = (args) => {
    // console.log('...sending admin msg client...');
    this.socket.emit('admin_msg', {msg: args})
  }
  sendSocketNotification = (args) => {
    let notificationId = args.userId;
    // console.log('...sending socket notification client...');
    this.socket.emit('send_notification', {
      room:'msg_'+notificationId,
      data: args.data
    })
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

     fetch('https://ec2-3-129-19-78.us-east-2.compute.amazonaws.com/graphql', {
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
          activityUser: null,
          role: null,
          userId: null,
          user: {},
          users:[],
          selectedUser: null,
          selectedPatient: null,
          selectedAppointment: null,
          selectedVisit: null,
          sender: null,
          receiver: null,
          userAlert: "...",
          userAlertArray: [],
          file: null,
          fancyDate: null,
          login: this.login,
          logout: this.logout,
          setUserAlert: this.setUserAlert,
          userOnline: this.userOnline,
        };
        this.setState({userAlert: '...logout success...'});
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  userOnline = () => {
    console.log('...domesticating socket client...');
    this.socket.emit('notification_subscribe', {
      user: this.context.activityId,
      room:'msg_'+this.context.activityId
    });

    if (this.context.role === 'Admin') {
      this.socket.emit('admin_subscribe')
    }
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

       fetch('https://ec2-3-129-19-78.us-east-2.compute.amazonaws.com/graphql', {
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
    // console.log('...setUserAlert...',args);
    let args2 = args;
    if (args === 'Unauthenticated!') {
      this.setState({userAlert: '...token expired! Logging you out...'})

      this.logout2()
    }
    let alertArray = [...this.state.userAlertArray]
    // console.log('alert type', typeof args);
    if (typeof args === 'object') {
      args2 = args.toString()

      console.log('non string alert',args,args2);
      // if (args.TypeError) {
      //   console.log('type error alert found');
      //   // args = args.TypeError
      // } else if (args.Error) {
      //   console.log('error alert found');
      //   // args = args.Error
      // } else {
      //   args = JSON.stringify(args);
      // }

    }
    alertArray.push(args2);
    this.setState({userAlert: args})
    this.setState({userAlertArray: alertArray})
  }

  selectUser = (args) => {
    console.log('...updating top-level selected user...');
    this.setState({
      selectedUser: args
    })
  }
  selectPatient = (args) => {
    console.log('...updating top-level selected patient...');
    this.setState({
      selectedPatient: args
    })
  }
  selectAppointment = (args) => {
    console.log('...updating top-level selected appointment...');
    this.setState({
      selectedAppointment: args
    })
  }
  selectVisit = (args) => {
    console.log('...updating top-level selected visit...');
    this.setState({
      selectedVisit: args
    })
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
              activityUser: null,
              role: this.state.role,
              userId: null,
              user: {},
              users:[],
              selectedUser: null,
              selectedPatient: null,
              selectedAppointment: null,
              selectedVisit: null,
              sender: null,
              receiver: null,
              userAlert: "...",
              userAlertArray: [],
              file: null,
              fancyDate: null,
              login: this.login,
              logout: this.logout,
              setUserAlert: this.setUserAlert,
              userOnline: this.userOnline,
            }}
          >
            <MainNavigation
              role={this.state.role}
            />
            <AlertBox
              authId={this.context.activityId}
              alert={this.state.userAlert}
              alertArray={this.state.userAlertArray}
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
                <Route path="/profile" render={(props) => <MyProfilePage {...props}
                  title="profile"
                  sendSocketAdminMessage={this.sendSocketAdminMessage}
                  sendSocketNotification={this.sendSocketNotification}
                />}/>
              )}
              {this.state.sessionStorageAuth && (
                <Route path="/staff" render={(props) => <StaffPage {...props}
                  title="staff"
                  selectedUser={this.state.selectedUser}
                  selectUser={this.selectUser}
                  sendSocketAdminMessage={this.sendSocketAdminMessage}
                  sendSocketNotification={this.sendSocketNotification}
                />}/>
              )}
              {this.state.sessionStorageAuth && (
                <Route path="/patients" render={(props) => <PatientPage {...props}
                  title="patients"
                  selectedPatient={this.state.selectedPatient}
                  selectPatient={this.selectPatient}
                />}/>
              )}
              {this.state.sessionStorageAuth && (
                <Route path="/appointments" render={(props) => <AppointmentPage {...props}
                  title="appointments"
                  selectedAppointment={this.state.selectedAppointment}
                  selectAppointment={this.selectAppointment}
                />}/>
              )}
              {this.state.sessionStorageAuth && (
                <Route path="/visits" render={(props) => <VisitPage {...props}
                  title="visits"
                  selectedVisit={this.state.selectedVisit}
                  selectVisit={this.selectVisit}
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
                  setUserAlert={this.setUserAlert}
                />}/>
              )}

              <Route path="/passwordReset/:params" render={(props) => <PasswordResetPage {...props}
                passwordReset={this.passwordReset}
                cancelPasswordReset={this.cancelPasswordReset}
                resetState={this.state.passwordResetState}
                message={this.state.passwordResetMessage}
                />}
              />

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
