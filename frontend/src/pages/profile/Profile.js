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
import AlertBox from '../../components/alertBox/AlertBox';
import LoadingOverlay from '../../components/overlay/LoadingOverlay';

import UserAddressList from '../../components/lists/user/UserAddressList'
import UserAttendanceList from '../../components/lists/user/UserAttendanceList'
import UserLeaveList from '../../components/lists/user/UserLeaveList'
import UserImageList from '../../components/lists/user/UserImageList'
import UserFileList from '../../components/lists/user/UserFileList'
import UserAppointmentList from '../../components/lists/user/UserAppointmentList'
import UserNoteList from '../../components/lists/user/UserNoteList'

import FilterAddressForm from '../../components/forms/filter/FilterAddressForm';
import FilterAttendanceForm from '../../components/forms/filter/FilterAttendanceForm';
import FilterLeaveForm from '../../components/forms/filter/FilterLeaveForm';
import FilterImageForm from '../../components/forms/filter/FilterImageForm';
import FilterFileForm from '../../components/forms/filter/FilterFileForm';
import FilterAppointmentForm from '../../components/forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../../components/forms/filter/FilterNoteForm';

import UpdateSingleFieldForm from '../../components/forms/add/UpdateSingleFieldForm';
import AddAddressForm from '../../components/forms/add/AddAddressForm';
import AddAttendanceForm from '../../components/forms/add/AddAttendanceForm';
import AddLeaveForm from '../../components/forms/add/AddLeaveForm';
import AddNoteForm from '../../components/forms/add/AddNoteForm';
import AddImageForm from '../../components/forms/add/AddImageForm';
import AddFileForm from '../../components/forms/add/AddFileForm';
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
      if (resData.data.getUserById.role === 'Admin') {
        this.setState({
          canDelete: true
        })
      }
      console.log('foo',moment.unix(this.state.activityUser.dob.substr(0,9)).format('YYYY-MM-DD'));
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

submitAddAddressForm = (event) => {
  event.preventDefault();
  console.log('...adding address...');
  this.context.setUserAlert('...adding address...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserAddress,
        activityA: `addUserAddress?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserAddress;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.deleteUserAddress,
        activityA: `deleteUserAddress?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserAddress;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.setUserAddressPrimary,
        activityA: `setUserAddressPrimary?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.setUserAddressPrimary;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserAttendance,
        activityA: `addUserAttendance?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserAttendance;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.deleteUserAttendance,
        activityA: `deleteUserAttendance?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserAttendance;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserLeave,
        activityA: `addUserLeave?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserLeave;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.deleteUserLeave,
        activityA: `deleteUserLeave?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserLeave;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserImage,
        activityA: `addUserImage?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserImage;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.deleteUserImage,
        activityA: `deleteUserImage?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserImage;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserFile,
        activityA: `addUserFile?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserFile;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;

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
        activityUser: resData.data.deleteUserFile,
        activityA: `deleteUserFile?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserFile;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.addUserNotes,
        activityA: `addUserNotes?activityId:${activityId},userId:${userId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.addUserNotes;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.deleteUserNote,
        activityA: `deleteUserNote?activityId:${activityId},userId:${userId}`
      });
      this.context.activityUser = resData.data.deleteUserNote;
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
  const activityId = this.state.activityUser._id;
  const userId = activityId;
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
        activityUser: resData.data.updateUserSingleField,
        activityA: `updateUserSingleField?activityId:${activityId},userId:${userId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.activityUser = resData.data.updateUserSingleField;
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

          {this.state.activityUser && (
            <Col md={10} className="profilePageContainerCol specialCol2">

              <h3> xxx </h3>
              {this.state.updateSingleField.state === true && (
                <UpdateSingleFieldForm
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
                      <p className="listGroupText bold">{this.state.activityUser.title}</p>
                      <p className="listGroupText">Name:</p>
                      <p className="listGroupText bold">{this.state.activityUser.name}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Username:</p>
                      <p className="listGroupText bold">{this.state.activityUser.username}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'username')}>Edit</Button>
                      <p className="listGroupText">Role:</p>
                      <p className="listGroupText bold">{this.state.activityUser.role}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">Reg No:</p>
                      <p className="listGroupText bold">{this.state.activityUser.registrationNumber}</p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <p className="listGroupText">DOB:</p>
                      <p className="listGroupText bold">{moment.unix(this.state.activityUser.dob.substr(0,9)).add(1,'days').format('YYYY-MM-DD')}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'dob')}>Edit</Button>
                      <p className="listGroupText">Age:</p>
                      <p className="listGroupText bold">{this.state.activityUser.age}</p>
                      <p className="listGroupText">Gender:</p>
                      <p className="listGroupText bold">{this.state.activityUser.gender}</p>
                      <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'gender')}>Edit</Button>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <p className="listGroupText">Email:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.email}</p>
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.email')}>Edit</Button>
                    <p className="listGroupText">Phone:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.phone}</p>
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'contact.phone')}>Edit</Button>
                    <p className="listGroupText">Phone 2:</p>
                    <p className="listGroupText bold">{this.state.activityUser.contact.phone2}</p>
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
                      <p className="listGroupText bold">{this.state.activityUser._id}</p>
                    </ListGroup.Item>
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
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Address List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'address')}>Add</Button>
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
                    addresses={this.state.activityUser.addresses}
                    authId={this.state.activityUser._id}
                    onDelete={this.deleteAddress}
                    canDelete={this.state.canDelete}
                    makePrimary={this.setAddressPrimary}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="4">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Attendance List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'attendance')}>Add</Button>
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
                    attendance={this.state.activityUser.attendance}
                    authId={this.state.activityUser._id}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteAttendance}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="5">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Leave List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'leave')}>Add</Button>
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
                    leave={this.state.activityUser.leave}
                    authId={this.state.activityUser._id}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteLeave}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="6">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Image List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
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
                    images={this.state.activityUser.images}
                    authId={this.state.activityUser._id}showListDetails={this.showListDetails}
                    canDelete={this.state.canDelete}
                    onDelete={this.deleteImage}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="7">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User File List:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
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
                    files={this.state.activityUser.files}
                    authId={this.state.activityUser._id}
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
                    appointments={this.state.activityUser.appointments}
                    authId={this.state.activityUser._id}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="9">
                  <Row className="displayPaneHeadRow">
                    <p className="displayPaneTitle">User Notes:</p>
                    <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                    <Button variant="outline-success" onClick={this.startAdd.bind(this, 'note')}>Add</Button>
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
                    notes={this.state.activityUser.notes}
                    authId={this.state.activityUser._id}
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

export default MyProfilePage;
