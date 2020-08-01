import React, { Component } from 'react';
import {Link} from 'react-router-dom';
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

import PatientAddressList from '../lists/patient/PatientAddressList';
import PatientNextOfKinList from '../lists/patient/PatientNextOfKinList'
import PatientAllergyList from '../lists/patient/PatientAllergyList'
import PatientMedicationList from '../lists/patient/PatientMedicationList'
import PatientImageList from '../lists/patient/PatientImageList'
import PatientFileList from '../lists/patient/PatientFileList'
import UserAppointmentList from '../lists/user/UserAppointmentList'
import AppointmentNoteList from '../lists/appointment/AppointmentNoteList'
import AppointmentTagList from '../lists/appointment/AppointmentTagList'
import UserList from '../lists/user/UserList'


import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterNoteForm from '../forms/filter/FilterNoteForm';
import FilterTagForm from '../forms/filter/FilterTagForm';
import FilterUserForm from '../forms/filter/FilterUserForm';

import UpdatePatientSingleFieldForm from '../forms/add/UpdatePatientSingleFieldForm';

import AddUserForm from '../forms/add/AddUserForm';
import AddNoteForm from '../forms/add/AddNoteForm';
import AddTagForm from '../forms/add/AddTagForm';
import loadingGif from '../../assets/loading.gif';
import { faBath } from '@fortawesome/free-solid-svg-icons';
import './details.css';

class VisitDetail extends Component {
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
    selectedPatient: null,
    selectedVisit: null,
    selectedAppointment: null,
    addAttachmentForm: false,
    addAttachmentArgs: null,
    showAddConsultantForm: false,
    users: null,
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.propsVisit = this.props.visit;
  }

componentDidMount () {
  console.log('...visit details component mounted...');
  let seshStore;
  if (sessionStorage.getItem('logInfo')) {
    seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
  }
  if (this.context.role === 'Admin') {
    this.setState({
      canDelete: true
    })
  }
  // this.getAllUsers(seshStore);
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
getAllUsers (args) {
  console.log('...retrieving all users...');
  this.context.setUserAlert('...retrieving all users...')
  this.setState({isLoading: true});

  const token = args.token;
  const activityId = args.activityId;
  const userId = activityId;

  let requestBody = {
    query: `
      query {getAllUsers(
        activityId:"${activityId}" )
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
      // console.log('...resData...',resData.data.getAllUsers);
      let responseAlert = '...all users retrieval success!...';
      let error = null;
      if (resData.data.getAllUsers.error) {
        error = resData.data.getAllUsers.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        users: resData.data.getAllUsers,
        activityA: `getAllUsers?activityId:${activityId},userId:${userId}`
      });
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
};

submitAddNoteForm = (event) => {
  event.preventDefault();
  console.log('...adding notes...');
  this.context.setUserAlert('...adding notes...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const notes = event.target.notes.value;

  let requestBody = {
    query: `
      mutation {addAppointmentNotes(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          notes:"${notes}"
        })
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.addAppointmentNotes);
      let responseAlert = '...notes add success!...';
      let error = null;
      if (resData.data.addAppointmentNotes.error) {
        error = resData.data.addAppointmentNotes.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentNotes)
      this.setState({
        isLoading: false,
        selectedAppointment: resData.data.addAppointmentNotes,
        activityA: `addAppointmentNotes?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.addAppointmentNotes;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteNote = (args) => {

  console.log('...deleting notes...');
  this.context.setUserAlert('...deleting notes...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const note = args;

  let requestBody = {
    query: `
      mutation {deleteAppointmentNote(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          note:"${note}"
        })
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.deleteAppointmentNote);
      let responseAlert = '...note delete success!...';
      let error = null;
      if (resData.data.deleteAppointmentNote.error) {
        error = resData.data.deleteAppointmentNote.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.deleteAppointmentNote)
      this.setState({
        isLoading: false,
        selectedAppointment: resData.data.deleteAppointmentNote,
        activityA: `deleteAppointmentNote?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.deleteAppointmentNote;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
submitAddTagForm = (event) => {
  event.preventDefault();
  console.log('...adding tags...');
  this.context.setUserAlert('...adding tags...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const tags = event.target.tags.value;

  let requestBody = {
    query: `
      mutation {addAppointmentTags(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          tags:"${tags}"
        })
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.addAppointmentTags);
      let responseAlert = '...tags add success!...';
      let error = null;
      if (resData.data.addAppointmentTags.error) {
        error = resData.data.addAppointmentTags.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentTags)
      this.setState({
        isLoading: false,
        selectedAppointment: resData.data.addAppointmentTags,
        activityA: `addAppointmentTags?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.addAppointmentTags;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteTag = (args) => {

  console.log('...deleting tags...');
  this.context.setUserAlert('...deleting tags...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const appointmentId = this.props.appointment._id;
  const tag = args;

  let requestBody = {
    query: `
      mutation {deleteAppointmentTag(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        appointmentInput:{
          tag:"${tag}"
        })
        {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.deleteAppointmentTag);
      let responseAlert = '...tag delete success!...';
      let error = null;
      if (resData.data.deleteAppointmentTag.error) {
        error = resData.data.deleteAppointmentTag.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.deleteAppointmentTag)
      this.setState({
        isLoading: false,
        selectedAppointment: resData.data.deleteAppointmentTag,
        activityA: `deleteAppointmentTag?activityId:${activityId},appointmentId:${appointmentId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedAppointment = resData.data.deleteAppointmentTag;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddUserForm = (event) => {
  event.preventDefault();
  console.log('...adding consultant...');
  this.context.setUserAlert('...adding consultant...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = event.target.user.value;
  const appointmentId = this.props.appointment._id;

  let requestBody = {
    query: `
      mutation {addAppointmentConsultant(
        activityId:"${activityId}",
        appointmentId:"${appointmentId}",
        consultantId:"${consultantId}"
      )
      {_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id,date,time,title,type,subType},patient{_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,registrationNumber,dob,age,gender,loggedIn,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}},inProgress,attended,important,notes,tags,reminders{_id},creator{_id,title,name,role,username,registrationNumber,dob,age,gender,contact{phone,phone,email},addresses{number,street,town,city,parish,country,postalCode,primary}}}}
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
      // console.log('...resData...',resData.data.addAppointmentConsultant);
      let responseAlert = '...add consultant success!...';
      let error = null;
      if (resData.data.addAppointmentConsultant.error) {
        error = resData.data.addAppointmentConsultant.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateAppointment(resData.data.addAppointmentConsultant)
      this.setState({
        isLoading: false,
        activityA: `addAppointmentConsultant?activityId:${activityId},appointmentId:${appointmentId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
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
  const visitId = this.props.visit._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  let requestBody = {
    query: `
      mutation {updateVisitSingleField(
        activityId:"${activityId}",
        visitId:"${visitId}",
        field:"${field}",
        query:"${query}"
      )
      {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.updateVisitSingleField);
      let responseAlert = '...field update success!...';
      let error = null;
      if (resData.data.updateVisitSingleField.error) {
        error = resData.data.updateVisitSingleField.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.updateVisitSingleField)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.updateVisitSingleField,
        activityA: `updateVisitSingleField?activityId:${activityId},visitId:${visitId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.updateVisitSingleField;
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
          {!this.props.visit && (
            <h3>...</h3>
          )}
          {this.props.visit && (
            <h3>{this.props.visit.title}</h3>
          )}
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
                  <Nav.Link eventKey="3" onClick={this.menuSelect.bind(this, 'consultant')}>Consultants</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="4" onClick={this.menuSelect.bind(this, 'complaint')}>Complaints</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'survey')}>survey</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="6" onClick={this.menuSelect.bind(this, 'systematicInquiry')}>Systematic Inquiry</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="7" onClick={this.menuSelect.bind(this, 'vitals')}>Vitals</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="8" onClick={this.menuSelect.bind(this, 'examination')}>Examination</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="9" onClick={this.menuSelect.bind(this, 'investigation')}>investigation</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="10" onClick={this.menuSelect.bind(this, 'diagnosis')}>diagnosis</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="11" onClick={this.menuSelect.bind(this, 'treatment')}>treatment</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="12" onClick={this.menuSelect.bind(this, 'billing')}>billing</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="13" onClick={this.menuSelect.bind(this, 'vigilance')}>vigilance</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="14" onClick={this.menuSelect.bind(this, 'image')}>images</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="15" onClick={this.menuSelect.bind(this, 'file')}>files</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
            {this.state.sideCol === 'filter' && (
              <Col>
                {this.state.menuSelect === 'consultant' && (
                  <FilterUserForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'complaint' && (
                  <h3>Filter complaint form</h3>
                )}
                {this.state.menuSelect === 'survey' && (
                  <h3>Filter survey form</h3>
                )}
                {this.state.menuSelect === 'systematicInquiry' && (
                  <h3>Filter systematicInquiry form</h3>
                )}
                {this.state.menuSelect === 'vitals' && (
                  <h3>Filter vitals form</h3>
                )}
                {this.state.menuSelect === 'examination' && (
                  <h3>Filter examination form</h3>
                )}
                {this.state.menuSelect === 'investigation' && (
                  <h3>Filter investigation form</h3>
                )}
                {this.state.menuSelect === 'diagnosis' && (
                  <h3>Filter diagnosis form</h3>
                )}
                {this.state.menuSelect === 'treatment' && (
                  <h3>Filter treatment form</h3>
                )}
                {this.state.menuSelect === 'billing' && (
                  <h3>Filter billing form</h3>
                )}
                {this.state.menuSelect === 'vigilance' && (
                  <h3>Filter vigilance form</h3>
                )}
                {this.state.menuSelect === 'image' && (
                  <h3>Filter image form</h3>
                )}
                {this.state.menuSelect === 'file' && (
                  <h3>Filter file form</h3>
                )}
              </Col>
            )}
          </Col>

          {this.props.visit && (
            <Col md={10} className="detailPageContainerCol specialCol2">
              {this.state.updateSingleField.state === true && (
                <UpdatePatientSingleFieldForm
                  field={this.state.updateSingleField.field}
                  onConfirm={this.submitUpdateSingleFieldForm}
                  onCancel={this.cancelUpdateSingleField}
                />
              )}
                <Tab.Content>
                  <Tab.Pane eventKey="1">
                    Appointment Basic:
                    <ListGroup className="profileBasicListGroup">
                      <ListGroup.Item>
                        <p className="listGroupText">Title:</p>
                        <p className="listGroupText bold">{this.props.visit.title}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Type:</p>
                        <p className="listGroupText bold">{this.props.visit.type}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'type')}>Edit</Button>
                        <p className="listGroupText">subType:</p>
                        <p className="listGroupText bold">{this.props.visit.subType}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Date:</p>
                        <p className="listGroupText bold">{moment.unix(this.props.visit.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')}</p>
                        <p className="listGroupText">Time:</p>
                        <p className="listGroupText bold">{this.props.visit.time}</p>
                        <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'time')}>Edit</Button>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Patient:</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Name:</p>
                        <p className="listGroupText bold">{this.props.visit.patient.title}</p>
                        <p className="listGroupText bold">{this.props.visit.patient.name}</p>
                        <Link
                          to={{
                            pathname: "/patients",
                            state: {patient: this.props.visit.patient._id}
                          }}
                        >Go!</Link>
                      </ListGroup.Item>
                      <ListGroup.Item>
                      <p className="listGroupText">Id:</p>
                      <p className="listGroupText bold">{this.props.visit.patient._id}</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Appointment:</p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <p className="listGroupText">Title:</p>
                        <p className="listGroupText bold">{this.props.visit.appointment.title}</p>
                        <Link
                          to={{
                            pathname: "/appointments",
                            state: {appointment: this.props.visit.appointment._id}
                          }}
                        >Go!</Link>
                      </ListGroup.Item>
                      <ListGroup.Item>
                      <p className="listGroupText">Id:</p>
                      <p className="listGroupText bold">{this.props.visit.appointment._id}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="2">
                    Visit Admin
                    <ListGroup className="profileBasicListGroup">
                      <ListGroup.Item>
                        <p className="listGroupText">Id:</p>
                        <p className="listGroupText bold">{this.props.visit._id}</p>
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab.Pane>
                  <Tab.Pane eventKey="3">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Consultant List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'consultant' &&
                      this.state.users && (
                        <h3>Add user form</h3>
                    )}
                    <h3>Visit Consultant List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="4">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Complaint List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'complaint')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'complaint' && (
                        <h3>Add complaint form</h3>
                    )}
                    <h3>Visit Complaint List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="5">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Survey List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'survey')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'survey' && (
                        <h3>Add survey form</h3>
                    )}
                    <h3>Visit Survey List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="6">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit SystematicInquiry List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'systematicInquiry')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'systematicInquiry' && (
                        <h3>Add systematicInquiry form</h3>
                    )}
                    <h3>Visit SystematicInquiry List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="7">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Vitals List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'vitals')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'vitals' && (
                        <h3>Add vitals form</h3>
                    )}
                    <h3>Visit Vitals List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="8">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Examination List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'examination')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'examination' && (
                        <h3>Add Examination form</h3>
                    )}
                    <h3>Visit Examination List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="9">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Investigation List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'investigation')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'investigation' && (
                        <h3>Add Investigation form</h3>
                    )}
                    <h3>Visit Investigation List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="10">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Diagnosis List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'diagnosis')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'diagnosis' && (
                        <h3>Add Diagnosis form</h3>
                    )}
                    <h3>Visit Diagnosis List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="11">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Treatment List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'treatment')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'treatment' && (
                        <h3>Add Treatment form</h3>
                    )}
                    <h3>Visit Treatment List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="12">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Billing List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'billing')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'billing' && (
                        <h3>Add Billing form</h3>
                    )}
                    <h3>Visit Billing List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="13">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Vigilance List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'vigilance')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'vigilance' && (
                        <h3>Add Vigilance form</h3>
                    )}
                    <h3>Visit Vigilance List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="13">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Image List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'image' && (
                        <h3>Add Image form</h3>
                    )}
                    <h3>Visit Image List</h3>
                  </Tab.Pane>
                  <Tab.Pane eventKey="13">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit File List:</p>
                      <Button variant="outline-primary" onClick={this.toggleSideCol}>Filter</Button>
                      {this.context.role === 'Admin' && (
                        <Button variant="outline-success" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                      )}
                    </Row>
                    {this.state.adding.state === true &&
                      this.state.adding.field === 'file' && (
                        <h3>Add File form</h3>
                    )}
                    <h3>Visit File List</h3>
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

export default VisitDetail;
