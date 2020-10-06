import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import bootstrapPlugin from '@fullcalendar/bootstrap';
import '../../calendar.scss'
import S3 from 'react-aws-s3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';

import UserAddressList from '../lists/user/UserAddressList'
import UserAttendanceList from '../lists/user/UserAttendanceList'
import UserLeaveList from '../lists/user/UserLeaveList'
import UserImageList from '../lists/user/UserImageList'
import UserFileList from '../lists/user/UserFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import UserNoteList from '../lists/user/UserNoteList'

import FilterAddressForm from '../forms/filter/FilterAddressForm';
import FilterAttendanceForm from '../forms/filter/FilterAttendanceForm';
import FilterLeaveForm from '../forms/filter/FilterLeaveForm';
import FilterImageForm from '../forms/filter/FilterImageForm';
import FilterFileForm from '../forms/filter/FilterFileForm';
import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';

import UpdateUserSingleFieldForm from '../forms/add/UpdateUserSingleFieldForm';
import AddAddressForm from '../forms/add/AddAddressForm';
import AddAttendanceForm from '../forms/add/AddAttendanceForm';
import AddLeaveForm from '../forms/add/AddLeaveForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddImageForm from '../forms/add/AddImageForm';
import AddFileForm from '../forms/add/AddFileForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class UserDetail extends Component {
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
    startFilter: false,
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
    menuSelect: 'basic',
    adding: {
      state: null,
      field: null
    },
    canDelete: false,
    updateSingleField: {
      state: null,
      field: null
    },
    selectedUser: null,
    calendarAttendance: null,
    calendarLeave: null,
    calendarAppointments: null,
    pocketVars: null,
    s3State: {
      action: null,
      target: null,
      status: null
    },
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    // this.props2 = this.props;
  }

componentDidMount () {
  console.log('...staff details component mounted...');
  if (sessionStorage.getItem('logInfo')) {
    const seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    this.getPocketVars(seshStore);
  }
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
  this.setState({
    selectedUser: this.context.selectedUser,
    menuSelect: this.props.subMenu
  })

  this.parseForCalendar({
    attendance: this.props.user.attendance,
    leave: this.props.user.leave,
    appointments: this.props.user.appointments,
  })
}
// componentDidUpdate () {
//   console.log('foo',this.props.user.appointments);
// }
componentWillUnmount() {

}

getPocketVars (args) {
    console.log('...retriving pocketVars..');
    this.context.setUserAlert('...retriving pocketVars..')
    const token = args.token;
    const activityId = args.activityId;
    const requestBody = {
          query:`
            query {getPocketVars(
              activityId:"${activityId}")}
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
          this.setState({userAlert: resData.errors[0].message})
        } else {
          let pocketVarsParsed = JSON.parse(resData.data.getPocketVars)
          console.log('...retriving pocketVars success...');
          this.context.setUserAlert('...retriving pocketVars success...')
          this.setState({
            pocketVars: pocketVarsParsed
          });
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
    }

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
      if (resData.errors) {
        this.context.setUserAlert(resData.errors[0].message)
      }
      if (resData.data.addUserActivity.error) {
        this.context.setUserAlert(resData.data.addUserActivity.error);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

submitAddAddressForm = (event) => {
  event.preventDefault();
  console.log('...adding address...');
  this.context.setUserAlert('...adding address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const number = event.target.number.value;
  const street = event.target.street.value;
  const town = event.target.town.value;
  const city = event.target.city.value;
  const parish = event.target.parish.value;
  const country = event.target.country.value;
  const postalCode = event.target.postalCode.value;

  if (
      number.trim().length === 0 ||
      street.trim().length === 0 ||
      city.trim().length === 0 ||
      country.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addUserAddress(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${number},
          addressStreet:"${street}",
          addressTown:"${town}",
          addressCity:"${city}",
          addressParish:"${parish}",
          addressCountry:"${country}",
          addressPostalCode:"${postalCode}"
        })
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
      // console.log('...resData...',resData.data.addUserAddress);
      let responseAlert = '...address add success!...';
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
      this.props.updateUser(resData.data.addUserAddress)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserAddress,
        activityA: `addUserAddress?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedUser = resData.data.addUserAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteAddress = (args) => {
  console.log('...deleting address...');
  this.context.setUserAlert('...deleting address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  let requestBody = {
    query: `
      mutation {deleteUserAddress(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}",
          addressPrimary: ${args.primary}
        })
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
      // console.log('...resData...',resData.data.deleteUserAddress);
      let responseAlert = '...address delete success!...';
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
      this.props.updateUser(resData.data.deleteUserAddress)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserAddress,
        activityA: `deleteUserAddress?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserAddress;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
setAddressPrimary = (args) => {
  console.log('...setting primary address...');
  this.context.setUserAlert('...setting primary address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  let requestBody = {
    query: `
      mutation {setUserAddressPrimary(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          addressNumber:${args.number},
          addressStreet:"${args.street}",
          addressTown:"${args.town}",
          addressCity:"${args.city}",
          addressParish:"${args.parish}",
          addressCountry:"${args.country}",
          addressPostalCode:"${args.postalCode}"
        })
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
      // console.log('...resData...',resData.data.setUserAddressPrimary);
      let responseAlert = '...address set primary success!...';
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
      this.props.updateUser(resData.data.setUserAddressPrimary)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.setUserAddressPrimary,
        activityA: `setUserAddressPrimary?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.setUserAddressPrimary;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddAttendanceForm = (event) => {
  event.preventDefault();
  console.log('...adding attendance...');
  this.context.setUserAlert('...attendance...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const attendanceDate = event.target.date.value;
  const attendanceStatus = event.target.status.value;
  const attendanceDescription = event.target.description.value.replace(/\n/g, ' ');

  if (
      attendanceDate.trim().length === 0 ||
      attendanceStatus.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addUserAttendance(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          attendanceDate:"${attendanceDate}",
          attendanceStatus:"${attendanceStatus}",
          attendanceDescription:"${attendanceDescription}"
        })
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
      // console.log('...resData...',resData.data.addUserAttendance);
      let responseAlert = '...attendance add success!...';
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
      this.props.updateUser(resData.data.addUserAttendance)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserAttendance,
        activityA: `addUserAttendance?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.parseForCalendar({
        attendance: this.props.user.attendance,
        leave: this.props.user.leave,
        appointments: this.props.user.appointments,
      })
      this.context.selectedUser = resData.data.addUserAttendance;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteAttendance = (args) => {
  console.log('...deleting attendance...');
  this.context.setUserAlert('...deleting attendance...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  let requestBody = {
    query: `
        mutation {deleteUserAttendance(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            attendanceDate:"${args.date}",
            attendanceStatus:"${args.status}",
            attendanceDescription:"${args.description}"
          }){_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.deleteUserAttendance);
      let responseAlert = '...attendance delete success!...';
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
      this.props.updateUser(resData.data.deleteUserAttendance)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserAttendance,
        activityA: `deleteUserAttendance?activityId:${activityId},userId:${userId}`
      });
      this.parseForCalendar({
        attendance: this.props.user.attendance,
        leave: this.props.user.leave,
        appointments: this.props.user.appointments,
      })
      this.context.selectedUser = resData.data.deleteUserAttendance;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddLeaveForm = (event) => {
  event.preventDefault();
  console.log('...adding leave...');
  this.context.setUserAlert('...leave...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const startDate = event.target.startDate.value;
  const endDate = event.target.endDate.value;
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');

  if (
      startDate.trim().length === 0 ||
      endDate.trim().length === 0 ||
      type.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {addUserLeave(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          leaveType:"${type}",
          leaveStartDate:"${startDate}",
          leaveEndDate:"${endDate}",
          leaveDescription:"${description}"
        }){_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.addUserLeave);
      let responseAlert = '...leave add success!...';
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
      this.props.updateUser(resData.data.addUserLeave)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserLeave,
        activityA: `addUserLeave?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.parseForCalendar({
        attendance: this.props.user.attendance,
        leave: this.props.user.leave,
        appointments: this.props.user.appointments,
      })
      this.context.selectedUser = resData.data.addUserLeave;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteLeave = (args) => {
  console.log('...deleting leave...');
  this.context.setUserAlert('...deleting leave...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  let requestBody = {
    query: `
        mutation {deleteUserLeave(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            leaveType:"${args.type}",
            leaveStartDate:"${args.startDate}",
            leaveEndDate:"${args.endDate}",
            leaveDescription:"${args.description}"
          })
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
      // console.log('...resData...',resData.data.deleteUserLeave);
      let responseAlert = '...leave delete success!...';
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
      this.props.updateUser(resData.data.deleteUserLeave)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserLeave,
        activityA: `deleteUserLeave?activityId:${activityId},userId:${userId}`
      });
      this.parseForCalendar({
        attendance: this.props.user.attendance,
        leave: this.props.user.leave,
        appointments: this.props.user.appointments,
      })
      this.context.selectedUser = resData.data.deleteUserLeave;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddImageForm = (event) => {
  event.preventDefault();
  console.log('...adding image...');
  this.context.setUserAlert('...image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const username = this.props.user.username;
  let imageName;
  let imageType;
  let imagePath;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'staff/'+userId+'/images';
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    imagePath = filePath2;
    imageName = fileName2;
    imageType = fileType;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading image ...")
    console.log('...s3 uploading image..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'image'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'image',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'image',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'image',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addUserImage(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          imageName:"${imageName}",
          imageType:"${imageType}",
          imagePath:"${imagePath}"
        })
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
      // console.log('...resData...',resData.data.addUserImage);
      let responseAlert = '...image add success!...';
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
      this.props.updateUser(resData.data.addUserImage)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserImage,
        activityA: `addUserImage?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedUser = resData.data.addUserImage;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteImage = (args) => {
  console.log('...deleting image...');
  this.context.setUserAlert('...deleting image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const username = this.props.user.username;

  const filePath = 'staff/'+username+'/images';
  const filename = args.name;

  let requestBody = {
    query: `
        mutation {deleteUserImage(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            imageName:"${args.name}",
            imageType:"${args.type}",
            imagePath:"${args.path}"
          })
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
      // console.log('...resData...',resData.data.deleteUserImage);
      let responseAlert = '...image delete success!...';
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
      this.props.updateUser(resData.data.deleteUserImage)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserImage,
        activityA: `deleteUserImage?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserImage;
      this.logUserActivity({activityId: activityId,token: token});


      const filePath = 'staff/'+userId+'/images';
      const filename = args.name;
      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting image..')
      console.log('...s3 deleting image..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: 'image'
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'image',
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename, config)
      .then(response => {
        console.log(response)
        this.context.setUserAlert(response.message)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddFileForm = (event) => {
  event.preventDefault();
  console.log('...adding file...');
  this.context.setUserAlert('...file...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  const username = this.props.user.username;
  let file2Name;
  let file2Type;
  let file2Path;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'staff/'+userId+'/files';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;
    let fileName2 = fileName+'.'+fileType;

    file2Path = filePath2;
    file2Name = fileName2;
    file2Type = fileType;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading file ...")
    console.log('...s3 uploading file..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'file'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'file',
      status: 'inProgress'
    }
  });

    ReactS3Client
        .uploadFile(file, fileName)
        .then(data => {
          console.log("attachment upload success!",data);
          this.context.setUserAlert("...upload success!")
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'file',
              status: 'complete'
            }
          });
        })
        .catch(err => {
          console.error("upload error:",err);
          this.context.setUserAlert("...upload error:  "+err.statusText)
          this.setState({
            overlayStatus: null,
            overlay: false,
            s3State:  {
              action: 'upload',
              target: 'file',
              status: 'failed'
            }
          });
        })
      }


  let requestBody = {
    query: `
      mutation {addUserFile(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          fileName:"${file2Name}",
          fileType:"${file2Type}",
          filePath:"${file2Path}"
        })
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
      // console.log('...resData...',resData.data.addUserFile);
      let responseAlert = '...file add success!...';
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
      this.props.updateUser(resData.data.addUserFile)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserFile,
        activityA: `addUserFile?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedUser = resData.data.addUserFile;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteFile = (args) => {
  console.log('...deleting file...');
  this.context.setUserAlert('...deleting file...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const username = this.props.user.username;
  const filename = args.name;

  let requestBody = {
    query: `
        mutation {deleteUserFile(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            fileName:"${args.name}",
            fileType:"${args.type}",
            filePath:"${args.path}"
          })
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
      // console.log('...resData...',resData.data.deleteUserFile);
      let responseAlert = '...file delete success!...';
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
      this.props.updateUser(resData.data.deleteUserFile)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserFile,
        activityA: `deleteUserFile?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserFile;
      this.logUserActivity({activityId: activityId,token: token});


      const filePath = 'staff/'+userId+'/files';
      const filename = args.name;
      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting file..')
      console.log('...s3 deleting file..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: 'file'
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename, config)
      .then(response => {
        console.log(response)
        this.context.setUserAlert(response.message)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          overlayStatus: null,
          overlay: false,
        })
      })


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddNoteForm = (event) => {
  event.preventDefault();
  console.log('...adding note...');
  this.context.setUserAlert('...adding note...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;

  let note = event.target.notes.value;

  if (
      note.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  note = note.replace(/\n/g, '');

  let requestBody = {
    query: `
      mutation {addUserNotes(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          notes:"${note}"
        }){_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      // console.log('...resData...',resData.data.addUserNotes);
      let responseAlert = '...notes add success!...';
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
      this.props.updateUser(resData.data.addUserNotes)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserNotes,
        activityA: `addUserNotes?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedUser = resData.data.addUserNotes;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteNote = (args) => {
  console.log('...deleting note...');
  this.context.setUserAlert('...deleting note...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  let requestBody = {
    query: `
        mutation {deleteUserNote(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            note: "${args}"
          })
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
      // console.log('...resData...',resData.data.deleteUserNote);
      let responseAlert = '...note delete success!...';
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
      this.props.updateUser(resData.data.deleteUserNote)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserNote,
        activityA: `deleteUserNote?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserNote;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.props.user._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  if (
      query.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {updateUserSingleField(
        activityId:"${activityId}",
        userId:"${userId}",
        field:"${field}",
        query:"${query}"
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
      // console.log('...resData...',resData.data.updateUserSingleField);
      let responseAlert = '...field update success!...';
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
      this.props.updateUser(resData.data.updateUserSingleField)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.updateUserSingleField,
        activityA: `updateUserSingleField?activityId:${activityId},userId:${userId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedUser = resData.data.updateUserSingleField;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
startUpdateSingleField = (args) => {
  this.setState({
    updateSingleField: {
      state: true,
      field: args
    }
  })
}
cancelUpdateSingleField = () => {
  this.setState({
    updateSingleField: {
      state: null,
      field: null
    }
  })
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
    startFilter: !this.state.startFilter
  })
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

parseForCalendar = (args) => {
  console.log('...parsing staff dates for calendar...');
  let calendarAttendance = args.attendance.map(x => ({
      title: x.status,
      date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        date: x.date,
        status: x.status,
        description: x.description,
        field: 'attendance'
      }
    }))
  let calendarLeave = args.leave.map(x => ({
      title: x.type,
      date: moment.unix(x.startDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      end: moment.unix(x.endDate.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        date: x.date,
        type: x.type,
        startDate: x.startDate,
        endDate: x.endDate,
        description: x.description,
        field: 'leave'
      }
    }))
    this.setState({
      calendarAttendance: calendarAttendance,
      calendarLeave: calendarLeave
    })
  let calendarAppointments = args.appointments.map(x => ({
      title: x.title,
      date: moment.unix(x.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD'),
      props: {
        _id: x._id,
        date: x.date,
        title: x.title,
        type: x.type,
        subType: x.subType,
        time: x.time,
        location: x.location,
        description: x.description,
        important: x.important,
        field: 'appointments'
      }
    }))
    this.setState({
      calendarAttendance: calendarAttendance,
      calendarLeave: calendarLeave,
      calendarAppointments: calendarAppointments,
    })
}
viewCalendarEvent = (args) => {

  let input = args.event.extendedProps.props;
  let data;
  if (input.field === 'attendance') {
    data = {
      date: input.date,
      status: input.status,
      description: input.description,
    }
    this.setState({
      overlay: true,
      overlayStatus: {type: 'calendarAttendance', data: data}
    })
  }
  if (input.field === 'leave') {
    data = {
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
    }
    this.setState({
      overlay: true,
      overlayStatus: {type: 'calendarLeave', data: data}
    })
  }
  if (input.field === 'appointments') {
    data = {
      _id: input._id,
      date: input.date,
      title: input.title,
      type: input.type,
      subType: input.subType,
      time: input.time,
      location: input.location,
      description: input.description,
      important: input.important,
    }
    this.setState({
      overlay: true,
      overlayStatus: {type: 'calendarAppointment', data: data, goLink: true}
    })
  }

}

toggleOverlay = () => {
  this.setState({
    overlay: false
  })
}


render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
        toggleOverlay={this.toggleOverlay}
      />
    )}

    <Container className="detailContainer">

      <Row className="">
          {
            !this.props.user && (
              <h3>...</h3>
            )
          }
      </Row>
      <Row className="">
        {this.props.user && (
          <Col md={12} className="">

            {this.state.startFilter === true && (
            <Col>
              {this.props.subMenu === 'address' && (
                <FilterAddressForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'attendance' && (
                <FilterAttendanceForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'leave' && (
                <FilterLeaveForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'image' && (
                <FilterImageForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'file' && (
                <FilterFileForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'appointment' && (
                <FilterAppointmentForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.props.subMenu === 'note' && (
                <FilterNoteForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
            </Col>

          )}

            {this.state.updateSingleField.state === true && (
              <UpdateUserSingleFieldForm
                field={this.state.updateSingleField.field}
                onConfirm={this.submitUpdateSingleFieldForm}
                onCancel={this.cancelUpdateSingleField}
              />
            )}

            {this.props.subMenu === 'all' && (
              <Row className="tabRowAll">
              <ul className="summaryList">
              <li className="summaryListItem">
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
                <ListGroup className="profileBasicListGroup">

                  <ListGroup.Item>
                    <p className="listGroupText">Title:</p>
                    <p className="listGroupText bold">{this.props.user.title}</p>
                    {this.state.canDelete === true && (
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                    )}
                    <p className="listGroupText">Name:</p>
                    <p className="listGroupText bold">{this.props.user.name}</p>
                    {this.state.canDelete === true && (
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Username:</p>
                    <p className="listGroupText bold">{this.props.user.username}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                    )}
                    <p className="listGroupText">Role:</p>
                    <p className="listGroupText bold">{this.props.user.role}</p>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'role')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">DOB:</p>
                    <p className="listGroupText bold">{moment.unix(this.props.user.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                    )}
                    <p className="listGroupText">Age:</p>
                    <p className="listGroupText bold">{this.props.user.age}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Gender:</p>
                    <p className="listGroupText bold">{this.props.user.gender}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Email:</p>
                    <p className="listGroupText bold">{this.props.user.contact.email}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Phone:</p>
                    <p className="listGroupText bold">{this.props.user.contact.phone}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                    )}
                    <p className="listGroupText">Phone 2:</p>
                    <p className="listGroupText bold">{this.props.user.contact.phone2}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p></p>
                    <p></p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <UserAddressList
                  filter={this.state.filter}
                  addresses={this.props.user.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <UserAddressList
                  filter={this.state.filter}
                  addresses={this.props.user.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <UserAddressList
                  filter={this.state.filter}
                  addresses={this.props.user.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <UserAddressList
                  filter={this.state.filter}
                  addresses={this.props.user.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol">
              c
              </Col>
              </li>
              </ul>
              </Row>
            )}

            {this.props.subMenu === 'basic' && (
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
                <ListGroup className="profileBasicListGroup">

                  <ListGroup.Item>
                    <p className="listGroupText">Title:</p>
                    <p className="listGroupText bold">{this.props.user.title}</p>
                    {this.state.canDelete === true && (
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                    )}
                    <p className="listGroupText">Name:</p>
                    <p className="listGroupText bold">{this.props.user.name}</p>
                    {this.state.canDelete === true && (
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Username:</p>
                    <p className="listGroupText bold">{this.props.user.username}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                    )}
                    <p className="listGroupText">Role:</p>
                    <p className="listGroupText bold">{this.props.user.role}</p>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'role')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">DOB:</p>
                    <p className="listGroupText bold">{moment.unix(this.props.user.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                    )}
                    <p className="listGroupText">Age:</p>
                    <p className="listGroupText bold">{this.props.user.age}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Gender:</p>
                    <p className="listGroupText bold">{this.props.user.gender}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Email:</p>
                    <p className="listGroupText bold">{this.props.user.contact.email}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Phone:</p>
                    <p className="listGroupText bold">{this.props.user.contact.phone}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                    )}
                    <p className="listGroupText">Phone 2:</p>
                    <p className="listGroupText bold">{this.props.user.contact.phone2}</p>
                    {this.state.canDelete === true && (
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p></p>
                    <p></p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'admin' && (
              <Col className="tabCol">
                <Col className="subTabCol">
                  <h3 className="">Admin Info:</h3>
                </Col>
                <ListGroup className="profileBasicListGroup">
                  <ListGroup.Item>
                    <p className="listGroupText">Reg No:</p>
                    <p className="listGroupText bold">{this.props.user.registrationNumber}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Employment Date:</p>
                    {this.props.user.employmentDate && (
                      <p className="listGroupText bold">{moment.unix(this.props.user.employmentDate.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                    )}
                    {this.context.role === 'Admin' && (
                      <Button variant="primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'employmentDate')}>Edit</Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Id:</p>
                    <p className="listGroupText bold">{this.props.user._id}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">LoggedIn:</p>
                    <p className="listGroupText bold">{this.props.user.loggedIn.toString()}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">ClientConnected:</p>
                    <p className="listGroupText bold">{this.props.user.clientConnected.toString()}</p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="listGroupText">Verified:</p>
                    <p className="listGroupText bold">{this.props.user.verification.verified.toString()}</p>
                    <p className="listGroupText">Type:</p>
                    <p className="listGroupText bold">{this.props.user.verification.type}</p>
                    <p className="listGroupText">Code:</p>
                    <p className="listGroupText bold">{this.props.user.verification.code}</p>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'address' && (
              <Col className="tabCol">
              <Col className="subTabCol">
                <h3 className="">Addresses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                )}
              </Col>
                {this.state.adding.state === true &&
                  this.state.adding.field === 'address' && (
                    <AddAddressForm
                      onConfirm={this.submitAddAddressForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                <UserAddressList
                  filter={this.state.filter}
                  addresses={this.props.user.addresses}
                  authId={this.context.activityId}
                  onDelete={this.deleteAddress}
                  canDelete={this.state.canDelete}
                  makePrimary={this.setAddressPrimary}
                />
              </Col>
            )}
            {this.props.subMenu === 'attendance' && (
              <Row className="tabRowDetails">
              <h3>Attendance:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'attendance')}>Add</Button>
                )}
              </Row>
              {this.state.adding.state === true &&
                this.state.adding.field === 'attendance' && (
                  <AddAttendanceForm
                    onConfirm={this.submitAddAttendanceForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                <Tab eventKey="1" title="list">
                <UserAttendanceList
                  filter={this.state.filter}
                  attendance={this.props.user.attendance}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteAttendance}
                />
                </Tab>
                <Tab eventKey="2" title="calendar" className="calendarTab">
                  <FullCalendar
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={this.state.calendarAttendance}
                    eventClick={this.viewCalendarEvent}
                  />
                </Tab>
              </Tabs>
              </Row>
            )}
            {this.props.subMenu === 'leave' && (
              <Row className="tabRowDetails">
              <h3>Leave:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'leave')}>Add</Button>
                )}
              </Row>
              {this.state.adding.state === true &&
                this.state.adding.field === 'leave' && (
                  <AddLeaveForm
                    onConfirm={this.submitAddLeaveForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                <Tab eventKey="1" title="list">
                <UserLeaveList
                  filter={this.state.filter}
                  leave={this.props.user.leave}
                  authId={this.context.activityId}
                  canDelete={this.state.canDelete}
                  onDelete={this.deleteLeave}
                />
                </Tab>
                <Tab eventKey="2" title="calendar" className="calendarTab">
                  <h3>Calendar</h3>
                  <FullCalendar
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={this.state.calendarLeave}
                    eventClick={this.viewCalendarEvent}
                  />
                </Tab>
              </Tabs>
              </Row>
            )}
            {this.props.subMenu === 'image' && (
              <Row className="tabRowDetails">
              <h3>Images:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                )}
              </Row>
              {this.state.adding.state === true &&
                this.state.adding.field === 'image' && (
                  <AddImageForm
                    onConfirm={this.submitAddImageForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              <UserImageList
                filter={this.state.filter}
                images={this.props.user.images}
                authId={this.context.activityId}
                showListDetails={this.showListDetails}
                canDelete={this.state.canDelete}
                onDelete={this.deleteImage}
              />
              </Row>
            )}
            {this.props.subMenu === 'file' && (
              <Row className="tabRowDetails">
              <h3>Files:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                )}
              </Row>
              {this.state.adding.state === true &&
                this.state.adding.field === 'file' && (
                  <AddFileForm
                    onConfirm={this.submitAddFileForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              <UserFileList
                filter={this.state.filter}
                files={this.props.user.files}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteFile}
              />
              </Row>
            )}
            {this.props.subMenu === 'appointment' && (
              <Row className="tabRowDetails">
              <h3>Appointments:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
              </Row>
              <Tabs defaultActiveKey="1" id="uncontrolled-tab-example">
                <Tab eventKey="1" title="list">
                <UserAppointmentList
                  filter={this.state.filter}
                  appointments={this.props.user.appointments}
                  authId={this.context.activityId}
                />
                </Tab>
                <Tab eventKey="2" title="calendar" className="calendarTab">
                  <h3>Calendar</h3>
                  <FullCalendar
                    defaultView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={this.state.calendarAppointments}
                    eventClick={this.viewCalendarEvent}
                  />
                </Tab>
              </Tabs>
              </Row>
            )}
            {this.props.subMenu === 'note' && (
              <Row className="tabRowDetails">
              <h3>Notes:</h3>
              <Row className="">
                <Button variant="primary" onClick={this.toggleFilter}>Filter</Button>
                {this.state.canDelete === true && (
                  <Button variant="success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
                )}
              </Row>
              {this.state.adding.state === true &&
                this.state.adding.field === 'note' && (
                  <AddNoteForm
                    onConfirm={this.submitAddNoteForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              <UserNoteList
                filter={this.state.filter}
                notes={this.props.user.notes}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteNote}
              />
              </Row>
            )}
          </Col>
        )}
      </Row>
    </Container>
    </React.Fragment>
  );

}


}

export default UserDetail;
