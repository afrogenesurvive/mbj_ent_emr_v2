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
    filter: {
      field: null,
      key: null,
      value: null
    },
    menuSelected: null,
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
  }
  this.setState({
    selectedUser: this.context.selectedUser
  })
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
}
componentWillUnmount() {

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
      if (resData.data.addUserActivity.error) {
        console.log('...resDataError...',resData.data.addUserActivity.error);
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
  const userId = this.state.selectedUser._id;
  const number = event.target.number.value;
  const street = event.target.street.value;
  const town = event.target.town.value;
  const city = event.target.city.value;
  const parish = event.target.parish.value;
  const country = event.target.country.value;
  const postalCode = event.target.postalCode.value;

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
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserAddress.error) {
        error = resData.data.addUserAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;

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
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.deleteUserAddress.error) {
        error = resData.data.deleteUserAddress.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;

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
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.setUserAddressPrimary.error) {
        error = resData.data.setUserAddressPrimary.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;
  const attendanceDate = event.target.date.value;
  const attendanceStatus = event.target.status.value;
  const attendanceDescription = event.target.description.value;

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
      {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserAttendance.error) {
        error = resData.data.addUserAttendance.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserAttendance,
        activityA: `addUserAttendance?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
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
  const userId = this.state.selectedUser._id;

  let requestBody = {
    query: `
        mutation {deleteUserAttendance(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            attendanceDate:"${args.date}",
            attendanceStatus:"${args.status}",
            attendanceDescription:"${args.description}"
          }){_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.deleteUserAttendance.error) {
        error = resData.data.deleteUserAttendance.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserAttendance,
        activityA: `deleteUserAttendance?activityId:${activityId},userId:${userId}`
      });
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
  const userId = this.state.selectedUser._id;
  const startDate = event.target.startDate.value;
  const endDate = event.target.endDate.value;
  const type = event.target.type.value;
  const description = event.target.description.value;

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
        }){_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserLeave.error) {
        error = resData.data.addUserLeave.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.addUserLeave,
        activityA: `addUserLeave?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
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
  const userId = this.state.selectedUser._id;

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
          {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.deleteUserLeave.error) {
        error = resData.data.deleteUserLeave.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserLeave,
        activityA: `deleteUserLeave?activityId:${activityId},userId:${userId}`
      });
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
  const userId = this.state.selectedUser._id;
  const imageName = event.target.name.value;
  const imageType = event.target.type.value;
  const imagePath = event.target.path.value;

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
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserImage.error) {
        error = resData.data.addUserImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;

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
      // console.log('...resData...',resData.data.deleteUserImage);
      let responseAlert = '...image delete success!...';
      let error = null;
      if (resData.data.deleteUserImage.error) {
        error = resData.data.deleteUserImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserImage,
        activityA: `deleteUserImage?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserImage;
      this.logUserActivity({activityId: activityId,token: token});
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
  const userId = this.state.selectedUser._id;
  const fileName = event.target.name.value;
  const fileType = event.target.type.value;
  const filePath = event.target.path.value;

  let requestBody = {
    query: `
      mutation {addUserFile(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          fileName:"${fileName}",
          fileType:"${fileType}",
          filePath:"${filePath}"
        })
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserFile.error) {
        error = resData.data.addUserFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;

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
      // console.log('...resData...',resData.data.deleteUserFile);
      let responseAlert = '...file delete success!...';
      let error = null;
      if (resData.data.deleteUserFile.error) {
        error = resData.data.deleteUserFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        selectedUser: resData.data.deleteUserFile,
        activityA: `deleteUserFile?activityId:${activityId},userId:${userId}`
      });
      this.context.selectedUser = resData.data.deleteUserFile;
      this.logUserActivity({activityId: activityId,token: token});
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
  this.context.setUserAlert('...note...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const userId = this.state.selectedUser._id;
  const note = event.target.note.value;

  let requestBody = {
    query: `
      mutation {addUserNotes(
        activityId:"${activityId}",
        userId:"${userId}",
        userInput:{
          notes:"${note}"
        }){_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.addUserNotes.error) {
        error = resData.data.addUserNotes.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;
  let requestBody = {
    query: `
        mutation {deleteUserNote(
          activityId:"${activityId}",
          userId:"${userId}",
          userInput:{
            note: "${args}"
          })
          {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.deleteUserNote.error) {
        error = resData.data.deleteUserNote.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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
  const userId = this.state.selectedUser._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  let requestBody = {
    query: `
      mutation {updateUserSingleField(
        activityId:"${activityId}",
        userId:"${userId}",
        field:"${field}",
        query:"${query}"
      )
        {_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description},leave{type,startDate,endDate,description},images{name,type,path},files{name,type,path},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},reminders{_id},activity{date,request}}}
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
      if (resData.data.updateUserSingleField.error) {
        error = resData.data.updateUserSingleField.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
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

render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}

    <Container className="detailPageContainer">

      <Row className="detailPageContainerRow mainRow">
        <Col md={2} className="detailPageContainerCol">

        </Col>
        <Col md={10} className="detailPageContainerCol">
          {
            !this.state.selectedUser && (
              <h3>...</h3>
            )
          }
          {
            this.state.selectedUser && (
              <h3>{this.state.selectedUser.username}</h3>
            )
          }
        </Col>
      </Row>
      <Tab.Container id="left-tabs-example" defaultActiveKey="1">
        <Row className="detailPageContainerRow mainRow2">
          <Col md={2} className="detailPageContainerCol specialCol1">
            {this.state.sideCol === 'menu' && (
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="1" onClick={this.menuSelect.bind(this, 'basic')}>Basic</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="2" onClick={this.menuSelect.bind(this, 'admin')}>Admin</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'address')}>Addresses</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'attendance')}>Attendance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'leave')}>Leave</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="6" onClick={this.menuSelect.bind(this, 'image')}>Images</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="7" onClick={this.menuSelect.bind(this, 'file')}>Files</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="8" onClick={this.menuSelect.bind(this, 'appointment')}>Appointments</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="9" onClick={this.menuSelect.bind(this, 'note')}>Notes</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                {this.state.menuSelect === 'address' && (
                  <FilterAddressForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'attendance' && (
                  <FilterAttendanceForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'leave' && (
                  <FilterLeaveForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'image' && (
                  <FilterImageForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'file' && (
                  <FilterFileForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'appointment' && (
                  <FilterAppointmentForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'note' && (
                  <FilterNoteForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
              </Col>

            )}
          </Col>

          {this.state.selectedUser && (
            <Col md={10} className="detailPageContainerCol specialCol2">
              <h3> xxx </h3>
              {this.state.updateSingleField.state === true && (
                <UpdateUserSingleFieldForm
                  field={this.state.updateSingleField.field}
                  onConfirm={this.submitUpdateSingleFieldForm}
                  onCancel={this.cancelUpdateSingleField}
                />
              )}
              <Tab.Content>
                <Tab.Pane eventKey="1">
                  User Basic:
                  <ListGroup className="profileBasicListGroup">
                    <ListGroup.Item>
                      <p className="listGroupText">Title:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.title}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                      <p className="listGroupText">Name:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.name}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'name')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Username:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.username}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                      <p className="listGroupText">Role:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.role}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Reg No:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.registrationNumber}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">DOB:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.selectedUser.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                      <p className="listGroupText">Age:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.age}</p>
                      <p className="listGroupText">Gender:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.gender}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Email:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.contact.email}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                      <p className="listGroupText">Phone:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.contact.phone}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                      <p className="listGroupText">Phone 2:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.contact.phone2}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone2')}>Edit</Button>
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
                      <p className="listGroupText">Id:</p>
                      <p className="listGroupText bold">{this.state.selectedUser._id}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">LoggedIn:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.loggedIn.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">ClientConnected:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.clientConnected.toString()}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Verified:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.verification.verified.toString()}</p>
                      <p className="listGroupText">Type:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.verification.type}</p>
                      <p className="listGroupText">Code:</p>
                      <p className="listGroupText bold">{this.state.selectedUser.verification.code}</p>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab.Pane>
                <Tab.Pane eventKey="3">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Address List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'address' && (
                      <AddAddressForm
                        onConfirm={this.submitAddAddressForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <UserAddressList
                    filter={this.state.filter}
                    addresses={this.state.selectedUser.addresses}
                    authId={this.context.activityId}
                    onDelete={this.deleteAddress}
                    canDelete={this.state.canDelete}
                    makePrimary={this.setAddressPrimary}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Attendance List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'attendance')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'attendance' && (
                      <AddAttendanceForm
                        onConfirm={this.submitAddAttendanceForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <UserAttendanceList
                    filter={this.state.filter}
                    attendance={this.state.selectedUser.attendance}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteAttendance}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="5">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Leave List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'leave')}>Add</Button>
                    )}
                  </Row>
                  {this.state.adding.state === true &&
                    this.state.adding.field === 'leave' && (
                      <AddLeaveForm
                        onConfirm={this.submitAddLeaveForm}
                        onCancel={this.cancelAdd}
                      />
                  )}
                  <UserLeaveList
                    filter={this.state.filter}
                    leave={this.state.selectedUser.leave}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteLeave}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="6">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Image List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
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
                    images={this.state.selectedUser.images}
                    authId={this.context.activityId}
                    showListDetails={this.showListDetails}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteImage}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="7">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User File List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
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
                    files={this.state.selectedUser.files}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteFile}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="8">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Appointment List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                  </Row>
                  <UserAppointmentList
                    filter={this.state.filter}
                    appointments={this.state.selectedUser.appointments}
                    authId={this.context.activityId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="9">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Notes:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    {this.context.role === 'Admin' && (
                      <Button variant="outline-success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
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
                    notes={this.state.selectedUser.notes}
                    authId={this.context.activityId}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteNote}
                  />
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

export default UserDetail;
