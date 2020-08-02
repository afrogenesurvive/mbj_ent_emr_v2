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
import AddToCalendar from 'react-add-to-calendar';

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
import VisitComplaintList from '../lists/visit/VisitComplaintList'
import VisitSurveyList from '../lists/visit/VisitSurveyList'
import VisitSystematicInquiryList from '../lists/visit/VisitSystematicInquiryList'
import VisitVitalsList from '../lists/visit/VisitVitalsList'
import VisitExaminationList from '../lists/visit/VisitExaminationList'
import VisitInvestigationList from '../lists/visit/VisitInvestigationList'
import VisitDiagnosisList from '../lists/visit/VisitDiagnosisList'
import VisitTreatmentList from '../lists/visit/VisitTreatmentList'
import VisitBillingList from '../lists/visit/VisitBillingList'
import VisitVigilanceList from '../lists/visit/VisitVigilanceList'
import VisitImageList from '../lists/visit/VisitImageList'
import VisitFileList from '../lists/visit/VisitFileList'
import UserList from '../lists/user/UserList'


import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
import FilterComplaintForm from '../forms/filter/FilterComplaintForm';
import FilterSurveyForm from '../forms/filter/FilterSurveyForm';
import FilterSystematicInquiryForm from '../forms/filter/FilterSystematicInquiryForm';
import FilterDiagnosisForm from '../forms/filter/FilterDiagnosisForm';
import FilterVitalsForm from '../forms/filter/FilterVitalsForm';
import FilterExaminationForm from '../forms/filter/FilterExaminationForm';
import FilterInvestigationForm from '../forms/filter/FilterInvestigationForm';
import FilterTreatmentForm from '../forms/filter/FilterTreatmentForm';
import FilterBillingForm from '../forms/filter/FilterBillingForm';
import FilterImageForm from '../forms/filter/FilterImageForm';
import FilterFileForm from '../forms/filter/FilterFileForm';
import FilterUserForm from '../forms/filter/FilterUserForm';

import UpdatePatientSingleFieldForm from '../forms/add/UpdatePatientSingleFieldForm';

import AddUserForm from '../forms/add/AddUserForm';
import AddAttachmentForm from '../forms/add/AddAttachmentForm';
import AddImageForm from '../forms/add/AddImageForm';
import AddFileForm from '../forms/add/AddFileForm';
import AddComplaintForm from '../forms/add/AddComplaintForm';
import AddSurveyForm from '../forms/add/AddSurveyForm';
import AddSystematicInquiryForm from '../forms/add/AddSystematicInquiryForm';
import AddVitalsForm from '../forms/add/AddVitalsForm';
import AddExaminationForm from '../forms/add/AddExaminationForm';
import AddInvestigationForm from '../forms/add/AddInvestigationForm';
import AddDiagnosisForm from '../forms/add/AddDiagnosisForm';
import AddTreatmentForm from '../forms/add/AddTreatmentForm';
import AddBillingForm from '../forms/add/AddBillingForm';
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
    calEvent: {
      title: this.props.visit.title,
      description: this.props.visit.appointment.description,
      location: this.props.visit.appointment.location,
      startTime: moment.unix(this.props.visit.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')+'T'+this.props.visit.time+':00-05:00',
      endTime: moment.unix(this.props.visit.date.substr(0,10)).add(1,'days').format('YYYY-MM-DD')+'T'+this.props.visit.time+':00-05:00',
    },
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
  this.getAllUsers(seshStore);
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

submitAddComplaintForm = (event) => {
  event.preventDefault();
  console.log('...adding complaint...');
  this.context.setUserAlert('...adding complaint...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const title = event.target.title.value;
  const description = event.target.description.value;
  const anamnesis = event.target.anamnesis.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitComplaint(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            complaintTitle:"${title}",
            complaintDescription:"${description}",
            complaintAnamnesis:"${anamnesis}",
            complaintAttachment:"${attachment}"
          })
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
      // console.log('...resData...',resData.data.addVisitComplaint);
      let responseAlert = '...complaint add success!...';
      let error = null;
      if (resData.data.addVisitComplaint.error) {
        error = resData.data.addVisitComplaint.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitComplaint)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitComplaint,
        activityA: `addVisitComplaint?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitComplaint;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteComplaint = (args) => {

  console.log('...deleting complaint...');
  this.context.setUserAlert('...deleting complaint...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const title = args.title;
  const description = args.description;
  const anamnesis = args.anamnesis;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitComplaint(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            complaintTitle:"${title}",
            complaintDescription:"${description}",
            complaintAnamnesis:"${anamnesis}",
            complaintAttachments:"${attachments}"
          })
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
      // console.log('...resData...',resData.data.deleteVisitComplaint);
      let responseAlert = '...complaint delete success!...';
      let error = null;
      if (resData.data.deleteVisitComplaint.error) {
        error = resData.data.deleteVisitComplaint.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitComplaint)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitComplaint,
        activityA: `deleteVisitComplaint?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitComplaint;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddSurveyForm = (event) => {
  event.preventDefault();
  console.log('...adding survey...');
  this.context.setUserAlert('...adding survey...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitSurvey(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          surveyTitle:"${title}",
          surveyDescription:"${description}",
          surveyAttachment:"${attachment}"
        })
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
      // console.log('...resData...',resData.data.addVisitSurvey);
      let responseAlert = '...survey add success!...';
      let error = null;
      if (resData.data.addVisitSurvey.error) {
        error = resData.data.addVisitSurvey.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitSurvey)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitSurvey,
        activityA: `addVisitSurvey?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitSurvey;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteSurvey = (args) => {

  console.log('...deleting survey...');
  this.context.setUserAlert('...deleting survey...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const title = args.title;
  const description = args.description;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitSurvey(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          surveyTitle:"${title}",
          surveyDescription:"${description}",
          surveyAttachments:"${attachments}"
        })
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
      // console.log('...resData...',resData.data.deleteVisitSurvey);
      let responseAlert = '...survey delete success!...';
      let error = null;
      if (resData.data.deleteVisitSurvey.error) {
        error = resData.data.deleteVisitSurvey.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitSurvey)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitSurvey,
        activityA: `deleteVisitSurvey?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitSurvey;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddSystematicInquiryForm = (event) => {
  event.preventDefault();
  console.log('...adding systematicInquiry...');
  this.context.setUserAlert('...adding systematicInquiry...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitSysInquiry(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          systematicInquiryTitle:"${title}",
          systematicInquiryDescription:"${description}",
          systematicInquiryAttachment:"${attachment}"
        })
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
      // console.log('...resData...',resData.data.addVisitSysInquiry);
      let responseAlert = '...systematicInquiry add success!...';
      let error = null;
      if (resData.data.addVisitSysInquiry.error) {
        error = resData.data.addVisitSysInquiry.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitSysInquiry)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitSysInquiry,
        activityA: `addVisitSysInquiry?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitSysInquiry;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteSystematicInquiry = (args) => {

  console.log('...deleting systematicInquiry...');
  this.context.setUserAlert('...deleting systematicInquiry...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const title = args.title;
  const description = args.description;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitSysInquiry(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          systematicInquiryTitle:"${title}",
          systematicInquiryDescription:"${description}",
          systematicInquiryAttachments:"${attachments}"
        })
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
      // console.log('...resData...',resData.data.deleteVisitSysInquiry);
      let responseAlert = '...sys inquiry delete success!...';
      let error = null;
      if (resData.data.deleteVisitSysInquiry.error) {
        error = resData.data.deleteVisitSysInquiry.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitSysInquiry)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitSysInquiry,
        activityA: `deleteVisitSysInquiry?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitSysInquiry;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddVitalsForm = (event) => {
  event.preventDefault();
  console.log('...adding Vitals...');
  this.context.setUserAlert('...adding Vitals...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const pr = event.target.pr.value;
  const bp1 = event.target.bp1.value;
  const bp2 = event.target.bp2.value;
  const rr = event.target.rr.value;
  const temp = event.target.temp.value;
  const ps02 = event.target.ps02.value;
  const heightUnit = event.target.heightUnit.value;
  const heightValue = event.target.heightValue.value;
  const weightUnit = event.target.weightUnit.value;
  const weightValue = event.target.weightValue.value;
  const bmi = event.target.bmi.value;
  const urineType = event.target.urineType.value;
  const urineValue = event.target.urineValue.value;

  let requestBody = {
    query: `
      mutation {addVisitVitals(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          vitalsPr:${pr},
          vitalsBp1:${bp1},
          vitalsBp2:${bp2},
          vitalsRr:${rr},
          vitalsTemp:${temp},
          vitalsPs02:${ps02},
          vitalsHeightUnit:"${heightUnit}",
          vitalsHeightValue:${heightValue},
          vitalsWeightUnit:"${weightUnit}",
          vitalsWeightValue:${weightValue},
          vitalsBmi:${bmi},
          vitalsUrineType:"${urineType}",
          vitalsUrineValue:"${urineValue}"
        })
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
      // console.log('...resData...',resData.data.addVisitVitals);
      let responseAlert = '...Vitals add success!...';
      let error = null;
      if (resData.data.addVisitVitals.error) {
        error = resData.data.addVisitVitals.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitVitals)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitVitals,
        activityA: `addVisitVitals?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitVitals;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteVitals = (args) => {

  console.log('...deleting Vitals...');
  this.context.setUserAlert('...deleting Vitals...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const pr = args.pr;
  const bp1 = args.bp1;
  const bp2 = args.bp2;
  const rr = args.rr;
  const temp = args.temp;
  const ps02 = args.ps02;
  const heightUnit = args.heightUnit;
  const heightValue = args.heightValue;
  const weightUnit = args.weightUnit;
  const weightValue = args.weightValue;
  const bmi = args.bmi;
  const urineType = args.urine.type;
  const urineValue = args.urine.value;

  let requestBody = {
    query: `
    mutation {deleteVisitVitals(
      activityId:"${activityId}",
      visitId:"${visitId}",
      visitInput:{
        vitalsPr:${pr},
        vitalsBp1:${bp1},
        vitalsBp2:${bp2},
        vitalsRr:${rr},
        vitalsTemp:${temp},
        vitalsPs02:${ps02},
        vitalsHeightUnit:"${heightUnit}",
        vitalsHeightValue:${heightValue},
        vitalsWeightUnit:"${weightUnit}",
        vitalsWeightValue:${weightValue},
        vitalsBmi:${bmi},
        vitalsUrineType:"${urineType}",
        vitalsUrineValue:"${urineValue}"
      })
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
      // console.log('...resData...',resData.data.deleteVisitVitals);
      let responseAlert = '...vitals delete success!...';
      let error = null;
      if (resData.data.deleteVisitVitals.error) {
        error = resData.data.deleteVisitVitals.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitVitals)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitVitals,
        activityA: `deleteVisitVitals?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitVitals;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddExaminationForm = (event) => {
  event.preventDefault();
  console.log('...adding Examination...');
  this.context.setUserAlert('...adding Examination...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const general = event.target.general.value;
  const area = event.target.area.value;
  const type = event.target.type.value;
  const measure = event.target.measure.value;
  const value = event.target.value.value;
  const description = event.target.description.value;
  const followUp = event.target.followUp.checked;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitExamination(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          examinationGeneral:"${general}",
          examinationArea:"${area}",
          examinationType:"${type}",
          examinationMeasure:"${measure}",
          examinationValue:"${value}",
          examinationDescription:"${description}",
          examinationFollowUp:${followUp},
          examinationAttachment:"${attachment}"
        })
        {_id,date,time,title,type,subType,patient{_id},consultants{_id},appointment{_id},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.addVisitExamination);
      let responseAlert = '...Examination add success!...';
      let error = null;
      if (resData.data.addVisitExamination.error) {
        error = resData.data.addVisitExamination.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitExamination)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitExamination,
        activityA: `addVisitExamination?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitExamination;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteExamination = (args) => {

  console.log('...deleting Examination...');
  this.context.setUserAlert('...deleting Examination...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const general = args.general;
  const area = args.area;
  const type = args.type;
  const measure = args.measure;
  const value = args.value;
  const description = args.description;
  const followUp = args.followUp;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitExamination(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          examinationGeneral:"${general}",
          examinationArea:"${area}",
          examinationType:"${type}",
          examinationMeasure:"${measure}",
          examinationValue:"${value}",
          examinationDescription:"${description}",
          examinationFollowUp:${followUp},
          examinationAttachments:"${attachments}"
        })
        {_id,date,time,title,type,subType,patient{_id},consultants{_id},appointment{_id},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.deleteVisitExamination);
      let responseAlert = '...Examination delete success!...';
      let error = null;
      if (resData.data.deleteVisitExamination.error) {
        error = resData.data.deleteVisitExamination.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitExamination)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitExamination,
        activityA: `deleteVisitExamination?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitExamination;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddInvestigationForm = (event) => {
  event.preventDefault();
  console.log('...adding Investigation...');
  this.context.setUserAlert('...adding Investigation...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitInvestigation(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          investigationTitle:"${title}",
          investigationType:"${type}",
          investigationDescription:"${description}",
          investigationAttachment:"${attachment}"
        })
        {_id,date,time,title,type,subType,patient{_id},consultants{_id},appointment{_id},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.addVisitInvestigation);
      let responseAlert = '...Investigation add success!...';
      let error = null;
      if (resData.data.addVisitInvestigation.error) {
        error = resData.data.addVisitInvestigation.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitInvestigation)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitInvestigation,
        activityA: `addVisitInvestigation?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitInvestigation;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteInvestigation = (args) => {

  console.log('...deleting Investigation...');
  this.context.setUserAlert('...deleting Investigation...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = args.title;
  const type = args.type;
  const description = args.description;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitInvestigation(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          investigationTitle:"${title}",
          investigationType:"${type}",
          investigationDescription:"${description}",
          investigationAttachments:"${attachments}"
        })
        {_id,date,time,title,type,subType,patient{_id},consultants{_id},appointment{_id},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.deleteVisitInvestigation);
      let responseAlert = '...Investigation delete success!...';
      let error = null;
      if (resData.data.deleteVisitInvestigation.error) {
        error = resData.data.deleteVisitInvestigation.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitInvestigation)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitInvestigation,
        activityA: `deleteVisitInvestigation?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitInvestigation;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddDiagnosisForm = (event) => {
  event.preventDefault();
  console.log('...adding Diagnosis...');
  this.context.setUserAlert('...adding Diagnosis...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
      mutation {addVisitDiagnosis(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          diagnosisTitle:"${title}",
          diagnosisType:"${type}",
          diagnosisDescription:"${description}",
          diagnosisAttachment:"${attachment}"
        })
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
      // console.log('...resData...',resData.data.addVisitDiagnosis);
      let responseAlert = '...Diagnosis add success!...';
      let error = null;
      if (resData.data.addVisitDiagnosis.error) {
        error = resData.data.addVisitDiagnosis.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitDiagnosis)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitDiagnosis,
        activityA: `addVisitDiagnosis?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitDiagnosis;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteDiagnosis = (args) => {

  console.log('...deleting Diagnosis...');
  this.context.setUserAlert('...deleting Diagnosis...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = args.title;
  const type = args.type;
  const description = args.description;
  const attachments = args.attachments;

  let requestBody = {
    query: `
      mutation {deleteVisitDiagnosis(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          diagnosisTitle:"${title}",
          diagnosisType:"${type}",
          diagnosisDescription:"${description}",
          diagnosisAttachments:"${attachments}"
        })
        {_id,date,time,title,type,subType,patient{_id},consultants{_id},appointment{_id},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      // console.log('...resData...',resData.data.deleteVisitDiagnosis);
      let responseAlert = '...Diagnosis delete success!...';
      let error = null;
      if (resData.data.deleteVisitDiagnosis.error) {
        error = resData.data.deleteVisitDiagnosis.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitDiagnosis)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitDiagnosis,
        activityA: `deleteVisitDiagnosis?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitDiagnosis;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddTreatmentForm = (event) => {
  event.preventDefault();
  console.log('...adding Treatment...');
  this.context.setUserAlert('...adding Treatment...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const dose = event.target.dose.value;
  const frequency = event.target.frequency.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
        mutation {addVisitTreatment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            treatmentType:"${type}",
            treatmentTitle:"${title}",
            treatmentDescription:"${description}",
            treatmentDose:"${dose}",
            treatmentFrequency:"${frequency}",
            treatmentAttachment:"${attachment}"
          })
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
      // console.log('...resData...',resData.data.addVisitTreatment);
      let responseAlert = '...Treatment add success!...';
      let error = null;
      if (resData.data.addVisitTreatment.error) {
        error = resData.data.addVisitTreatment.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitTreatment)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitTreatment,
        activityA: `addVisitTreatment?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitTreatment;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteTreatment = (args) => {

  console.log('...deleting Treatment...');
  this.context.setUserAlert('...deleting Treatment...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = args.title;
  const type = args.type;
  const description = args.description;
  const dose = args.dose;
  const frequency = args.frequency;
  const attachments = args.attachments;

  let requestBody = {
    query: `
        mutation {deleteVisitTreatment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            treatmentType:"${type}",
            treatmentTitle:"${title}",
            treatmentDescription:"${description}",
            treatmentDose:"${dose}",
            treatmentFrequency:"${frequency}",
            treatmentAttachments:"${attachments}"
          })
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
      // console.log('...resData...',resData.data.deleteVisitTreatment);
      let responseAlert = '...Treatment delete success!...';
      let error = null;
      if (resData.data.deleteVisitTreatment.error) {
        error = resData.data.deleteVisitTreatment.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitTreatment)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitTreatment,
        activityA: `deleteVisitTreatment?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitTreatment;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddBillingForm = (event) => {
  event.preventDefault();
  console.log('...adding Billing...');
  this.context.setUserAlert('...adding Billing...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  const type = event.target.type.value;
  const description = event.target.description.value;
  const amount = event.target.amount.value;
  const paid = event.target.paid.checked;
  const notes = event.target.notes.value;
  const attachment = event.target.attachment.value;

  let requestBody = {
    query: `
        mutation {addVisitBilling(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            billingTitle:"${title}",
            billingType:"${type}",
            billingDescription:"${description}",
            billingAmount:${amount},
            billingPaid:${paid},
            billingAttachment:"${attachment}",
            billingNotes:"${notes}"
          })
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
      // console.log('...resData...',resData.data.addVisitBilling);
      let responseAlert = '...Billing add success!...';
      let error = null;
      if (resData.data.addVisitBilling.error) {
        error = resData.data.addVisitBilling.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitBilling)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitBilling,
        activityA: `addVisitBilling?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitBilling;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteBilling = (args) => {

  console.log('...deleting Billing...',args);
  this.context.setUserAlert('...deleting Billing...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = args.title;
  const type = args.type;
  const description = args.description;
  const amount = args.amount;
  const paid = args.paid;
  const notes = args.notes;
  const attachments = args.attachments;

  let requestBody = {
    query: `
        mutation {deleteVisitBilling(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            billingTitle:"${title}",
            billingType:"${type}",
            billingDescription:"${description}",
            billingAmount:${amount},
            billingPaid:${paid},
            billingAttachments:"${attachments}",
            billingNotes:"${notes}"
          })
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
      // console.log('...resData...',resData.data.deleteVisitBilling);
      let responseAlert = '...Billing delete success!...';
      let error = null;
      if (resData.data.deleteVisitBilling.error) {
        error = resData.data.deleteVisitBilling.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitBilling)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitBilling,
        activityA: `deleteVisitBilling?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitBilling;
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
  console.log('...adding Image...');
  this.context.setUserAlert('...adding Image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const name = event.target.name.value;
  const type = event.target.type.value;
  const path = event.target.path.value;

  let requestBody = {
    query: `
        mutation {addVisitImage(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            imageName:"${name}",
            imageType:"${type}",
            imagePath:"${path}"
          })
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
      // console.log('...resData...',resData.data.addVisitImage);
      let responseAlert = '...Image add success!...';
      let error = null;
      if (resData.data.addVisitImage.error) {
        error = resData.data.addVisitImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitImage)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitImage,
        activityA: `addVisitImage?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitImage;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteImage = (args) => {

  console.log('...deleting Image...',args);
  this.context.setUserAlert('...deleting Image...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const name = args.name;
  const type = args.type;
  const path = args.path;

  let requestBody = {
    query: `
    mutation {deleteVisitImage(
      activityId:"${activityId}",
      visitId:"${visitId}",
      visitInput:{
        imageName:"${name}",
        imageType:"${type}",
        imagePath:"${path}"
      })
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
      // console.log('...resData...',resData.data.deleteVisitImage);
      let responseAlert = '...Image delete success!...';
      let error = null;
      if (resData.data.deleteVisitImage.error) {
        error = resData.data.deleteVisitImage.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitImage)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitImage,
        activityA: `deleteVisitImage?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitImage;
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
  console.log('...adding File...');
  this.context.setUserAlert('...adding File...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const name = event.target.name.value;
  const type = event.target.type.value;
  const path = event.target.path.value;

  let requestBody = {
    query: `
        mutation {addVisitFile(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            fileName:"${name}",
            fileType:"${type}",
            filePath:"${path}"
          })
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
      // console.log('...resData...',resData.data.addVisitFile);
      let responseAlert = '...File add success!...';
      let error = null;
      if (resData.data.addVisitFile.error) {
        error = resData.data.addVisitFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitFile)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitFile,
        activityA: `addVisitFile?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitFile;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteFile = (args) => {

  console.log('...deleting File...',args);
  this.context.setUserAlert('...deleting File...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const name = args.name;
  const type = args.type;
  const path = args.path;

  let requestBody = {
    query: `
    mutation {deleteVisitFile(
      activityId:"${activityId}",
      visitId:"${visitId}",
      visitInput:{
        fileName:"${name}",
        fileType:"${type}",
        filePath:"${path}"
      })
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
      // console.log('...resData...',resData.data.deleteVisitFile);
      let responseAlert = '...File delete success!...';
      let error = null;
      if (resData.data.deleteVisitFile.error) {
        error = resData.data.deleteVisitFile.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitFile)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitFile,
        activityA: `deleteVisitFile?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitFile;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}

submitAddVigilanceForm = (event) => {
  event.preventDefault();
  console.log('...adding Vigilance...');
  this.context.setUserAlert('...adding Vigilance...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
    mutation {addVisitVigilance(
      activityId:\"5f09f4944bc80aab344f0fe3\",
      visitId:\"5f0fc060e75436155a2255bd\",
      visitInput:{
        vigilanceChronicIllnessDiabetesMedication:false,
        vigilanceChronicIllnessDiabetesTesting:false,
        vigilanceChronicIllnessDiabetesComment:\"toast\",
        vigilanceChronicIllnessHbpMedication:false,
        vigilanceChronicIllnessHbpTesting:false,
        vigilanceChronicIllnessHbpComment:\"xxds\",
        vigilanceChronicIllnessDyslipidemiaMedication:false,
        vigilanceChronicIllnessDyslipidemiaTesting:false,
        vigilanceChronicIllnessDyslipidemiaComment:\"z\",
        vigilanceChronicIllnessCadMedication:false,
        vigilanceChronicIllnessCadTesting:false,
        vigilanceChronicIllnessCadComment:\"a\",
        vigilanceLifestyleWeightMedication:false,
        vigilanceLifestyleWeightTesting:false,
        vigilanceLifestyleWeightComment:\"b\",
        vigilanceLifestyleDietMedication:false,
        vigilanceLifestyleDietTesting:false,
        vigilanceLifestyleDietComment:\"c\",
        vigilanceLifestyleSmokingMedication:false,
        vigilanceLifestyleSmokingTesting:false,
        vigilanceLifestyleSmokingComment:\"1\",
        vigilanceLifestyleSubstanceAbuseMedication:false,
        vigilanceLifestyleSubstanceAbuseTesting:false,
        vigilanceLifestyleSubstanceAbuseComment:\"2\",
        vigilanceLifestyleExerciseMedication:false,
        vigilanceLifestyleExerciseTesting:false,
        vigilanceLifestyleExerciseComment:\"3\",
        vigilanceLifestyleAllergiesMedication:false,
        vigilanceLifestyleAllergiesTesting:false,
        vigilanceLifestyleAllergiesComment:\"aa\",
        vigilanceLifestyleAsthmaMedication:false,
        vigilanceLifestyleAsthmaTesting:false,
        vigilanceLifestyleAsthmaComment:\"ab\",
        vigilanceScreeningBreastMedication:false,
        vigilanceScreeningBreastTesting:false,
        vigilanceScreeningBreastComment:\"ac\",
        vigilanceScreeningProstateMedication:false,
        vigilanceScreeningProstateTesting:false,
        vigilanceScreeningProstateComment:\"1a\",
        vigilanceScreeningCervixMedication:false,
        vigilanceScreeningCervixTesting:false,
        vigilanceScreeningCervixComment:\"1b\",
        vigilanceScreeningColonMedication:false,
        vigilanceScreeningColonTesting:false,
        vigilanceScreeningColonComment:\"1c\",
        vigilanceScreeningDentalMedication:false,
        vigilanceScreeningDentalTesting:false,
        vigilanceScreeningDentalComment:\"derp\",
        vigilanceVaccinesInfluenzaMedication:false,
        vigilanceVaccinesInfluenzaTesting:false,
        vigilanceVaccinesInfluenzaComment:\"herp\",
        vigilanceVaccinesVaricellaMedication:false,
        vigilanceVaccinesVaricellaTesting:false,
        vigilanceVaccinesVaricellaComment:\"twerp\",
        vigilanceVaccinesHpvMedication:false,
        vigilanceVaccinesHpvTesting:false,
        vigilanceVaccinesHpvComment:\"boob\",
        vigilanceVaccinesMmrMedication:false,
        vigilanceVaccinesMmrTesting:false,
        vigilanceVaccinesMmrComment:\"scoob\",
        vigilanceVaccinesTetanusMedication:false,
        vigilanceVaccinesTetanusTesting:false,
        vigilanceVaccinesTetanusComment:\"rude\",
        vigilanceVaccinesPneumovaxMedication:false,
        vigilanceVaccinesPneumovaxTesting:false,
        vigilanceVaccinesPneumovaxComment:\"x\",
        vigilanceVaccinesOtherName:\"x\",
        vigilanceVaccinesOtherMedication:false,
        vigilanceVaccinesOtherTesting:false,
        vigilanceVaccinesOtherComment:\"x\"
      })
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
      // console.log('...resData...',resData.data.addVisitVigilance);
      let responseAlert = '...Vigilance add success!...';
      let error = null;
      if (resData.data.addVisitVigilance.error) {
        error = resData.data.addVisitVigilance.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitVigilance)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.addVisitVigilance,
        activityA: `addVisitVigilance?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.addVisitVigilance;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });
}
deleteVigilance = (args) => {

  console.log('...deleting Vigilance...',args);
  this.context.setUserAlert('...deleting Vigilance...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
        mutation {deleteVisitVigilance(
          activityId:\"5f09f4944bc80aab344f0fe3\",
          visitId:\"5f0fc060e75436155a2255bd\",
          visitInput:{
            vigilanceChronicIllnessDiabetesMedication:false,
            vigilanceChronicIllnessDiabetesTesting:false,
            vigilanceChronicIllnessDiabetesComment:\"toast\",
            vigilanceChronicIllnessHbpMedication:false,
            vigilanceChronicIllnessHbpTesting:false,
            vigilanceChronicIllnessHbpComment:\"xxds\",
            vigilanceChronicIllnessDyslipidemiaMedication:false,
            vigilanceChronicIllnessDyslipidemiaTesting:false,
            vigilanceChronicIllnessDyslipidemiaComment:\"z\",
            vigilanceChronicIllnessCadMedication:false,
            vigilanceChronicIllnessCadTesting:false,
            vigilanceChronicIllnessCadComment:\"a\",
            vigilanceLifestyleWeightMedication:false,
            vigilanceLifestyleWeightTesting:false,
            vigilanceLifestyleWeightComment:\"b\",
            vigilanceLifestyleDietMedication:false,
            vigilanceLifestyleDietTesting:false,
            vigilanceLifestyleDietComment:\"c\",
            vigilanceLifestyleSmokingMedication:false,
            vigilanceLifestyleSmokingTesting:false,
            vigilanceLifestyleSmokingComment:\"1\",
            vigilanceLifestyleSubstanceAbuseMedication:false,
            vigilanceLifestyleSubstanceAbuseTesting:false,
            vigilanceLifestyleSubstanceAbuseComment:\"2\",
            vigilanceLifestyleExerciseMedication:false,
            vigilanceLifestyleExerciseTesting:false,
            vigilanceLifestyleExerciseComment:\"3\",
            vigilanceLifestyleAllergiesMedication:false,
            vigilanceLifestyleAllergiesTesting:false,
            vigilanceLifestyleAllergiesComment:\"aa\",
            vigilanceLifestyleAsthmaMedication:false,
            vigilanceLifestyleAsthmaTesting:false,
            vigilanceLifestyleAsthmaComment:\"ab\",
            vigilanceScreeningBreastMedication:false,
            vigilanceScreeningBreastTesting:false,
            vigilanceScreeningBreastComment:\"ac\",
            vigilanceScreeningProstateMedication:false,
            vigilanceScreeningProstateTesting:false,
            vigilanceScreeningProstateComment:\"1a\",
            vigilanceScreeningCervixMedication:false,
            vigilanceScreeningCervixTesting:false,
            vigilanceScreeningCervixComment:\"1b\",
            vigilanceScreeningColonMedication:false,
            vigilanceScreeningColonTesting:false,
            vigilanceScreeningColonComment:\"1c\",
            vigilanceScreeningDentalMedication:false,
            vigilanceScreeningDentalTesting:false,
            vigilanceScreeningDentalComment:\"derp\",
            vigilanceVaccinesInfluenzaMedication:false,
            vigilanceVaccinesInfluenzaTesting:false,
            vigilanceVaccinesInfluenzaComment:\"herp\",
            vigilanceVaccinesVaricellaMedication:false,
            vigilanceVaccinesVaricellaTesting:false,
            vigilanceVaccinesVaricellaComment:\"twerp\",
            vigilanceVaccinesHpvMedication:false,
            vigilanceVaccinesHpvTesting:false,
            vigilanceVaccinesHpvComment:\"boob\",
            vigilanceVaccinesMmrMedication:false,
            vigilanceVaccinesMmrTesting:false,
            vigilanceVaccinesMmrComment:\"scoob\",
            vigilanceVaccinesTetanusMedication:false,
            vigilanceVaccinesTetanusTesting:false,
            vigilanceVaccinesTetanusComment:\"rude\",
            vigilanceVaccinesPneumovaxMedication:false,
            vigilanceVaccinesPneumovaxTesting:false,
            vigilanceVaccinesPneumovaxComment:\"x\",
            vigilanceVaccinesOtherName:\"x\",
            vigilanceVaccinesOtherMedication:false,
            vigilanceVaccinesOtherTesting:false,
            vigilanceVaccinesOtherComment:\"x\"
          })
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
      // console.log('...resData...',resData.data.deleteVisitVigilance);
      let responseAlert = '...Vigilance delete success!...';
      let error = null;
      if (resData.data.deleteVisitVigilance.error) {
        error = resData.data.deleteVisitVigilance.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitVigilance)
      this.setState({
        isLoading: false,
        selectedVisit: resData.data.deleteVisitVigilance,
        activityA: `deleteVisitFile?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitVigilance;
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
  const visitId = this.props.visit._id;

  const userRole = this.state.users.filter(x => x._id === consultantId)[0].role;
  if (userRole !== 'Doctor' && userRole !== 'Nurse') {
    console.log('...please choose a Doctor or Nurse to add please...');
    this.context.setUserAlert('...please choose a Doctor or Nurse to add please...')
    return
  }

  let requestBody = {
    query: `
      mutation {addVisitConsultant(
        activityId:"${activityId}",
        visitId:"${visitId}",
        consultantId:"${consultantId}"
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
      // console.log('...resData...',resData.data.addVisitConsultant);
      let responseAlert = '...add consultant success!...';
      let error = null;
      if (resData.data.addVisitConsultant.error) {
        error = resData.data.addVisitConsultant.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitConsultant)
      this.setState({
        isLoading: false,
        activityA: `addVisitConsultant?activityId:${activityId},visitId:${visitId},consultantId:${consultantId}`,
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
deleteConsultant = (args) => {
  console.log('...deleting consultant...');
  this.context.setUserAlert('...deleting consultant...')
  this.setState({isLoading: true});
  //
  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = args._id;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
      mutation {deleteVisitConsultant(
        activityId:"${activityId}",
        visitId:"${visitId}",
        consultantId:"${consultantId}"
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
      // console.log('...resData...',resData.data.deleteVisitConsultant);
      let responseAlert = '...delete consultant success!...';
      let error = null;
      if (resData.data.deleteVisitConsultant.error) {
        error = resData.data.deleteVisitConsultant.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitConsultant)
      this.setState({
        isLoading: false,
        activityA: `deleteVisitConsultant?activityId:${activityId},visitId:${visitId},consultantId:${consultantId}`,
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

startAddAttachment = (args) => {
  console.log('...start add attachment...');
  this.setState({
    addAttachmentForm: true,
    addAttachmentArgs: args
  })
}
cancelAddAttachment = () => {
  this.setState({
    addAttachmentForm: false
  })
}
addAttachment = (event) => {
  event.preventDefault();
  console.log('...adding attachment...');
  this.context.setUserAlert('...adding attachment...');
  this.setState({
    isLoading: true,
    addAttachmentForm: false
  })

  const token = this.context.token;
  const activityId = this.context.activityId;
  const patientId = this.props.patient._id;
  let args = this.state.addAttachmentArgs;
  let field = args.field;

  let allergyTitle;
  let allergyType;
  let allergyDescription;
  let allergyAttachment;
  let medicationTitle;
  let medicationType;
  let medicationDescription;
  let medicationAttachment;

  if (field === 'allergy') {
    allergyTitle = args.data.title;
    allergyType = args.data.type;
    allergyDescription = args.data.description;
    allergyAttachment = event.target.attachment.value;
  }
  if (field === 'medication') {
    medicationTitle = args.data.title;
    medicationType = args.data.type;
    medicationDescription = args.data.description;
    medicationAttachment = event.target.attachment.value;
  }

  let requestBody;
  if (field === 'allergy') {
    requestBody = {
      query: `
        mutation {addPatientAllergyAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            allergyType:"${allergyType}",
            allergyTitle:"${allergyTitle}",
            allergyDescription:"${allergyDescription}",
            allergyAttachment:"${allergyAttachment}"
          })
          {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
      `};
  }
  if (field === 'medication') {
    requestBody = {
      query: `
        mutation {addPatientMedicationAttachment(
          activityId:"${activityId}",
          patientId:"${patientId}",
          patientInput:{
            medicationType:"${medicationType}",
            medicationTitle:"${medicationTitle}",
            medicationDescription:"${medicationDescription}",
            medicationAttachment:"${medicationAttachment}"
          })
          {_id,active,title,name,role,username,registration{date,number},dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},expiryDate,referral{date,reason,physician{name,email,phone}},attendingPhysician,occupation{role,employer{name,phone,email,address}},insurance{company,policyNumber,description,expiryDate,subscriber{company,description}},nextOfKin{name,relation,contact{email,phone1,phone2}},allergies{type,title,description,attachments},medication{type,title,description,attachments},images{name,type,path},files{name,type,path},notes,tags,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress,attended,important,notes,tags},visits{_id},reminders{_id},activity{date,request}}}
      `};
  }

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
      if (field === 'allergy') {
        // console.log('...resData...',resData.data.addPatientAllergyAttachment);
      }
      if (field === 'medication') {
        // console.log('...resData...',resData.data.addPatientMedicationAttachment);
      }

      let responseAlert = '...add attachment success!...';
      let error = null;

      if (field === 'allergy') {
        if (resData.data.addPatientAllergyAttachment.error) {
          error = resData.data.addPatientAllergyAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'medication') {
        if (resData.data.addPatientMedicationAttachment.error) {
          error = resData.data.addPatientMedicationAttachment.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (field === 'allergy') {
        this.props.updatePatient(resData.data.addPatientAllergyAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.addPatientAllergyAttachment,
          activityA: `addPatientAllergyAttachmentRegex?activityId:${activityId},patientId:${patientId}`
        });
      }
      if (field === 'medication') {
        this.props.updatePatient(resData.data.addPatientMedicationAttachment)
        this.setState({
          isLoading: false,
          selectedPatient: resData.data.addPatientMedicationAttachment,
          activityA: `addPatientMedicationAttachment?activityId:${activityId},patientId:${patientId}`
        });
      }

      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false })
    });

}
deleteAttachment = (args) => {
  console.log('...deleting attachment...', args);
  let field = args.field;
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
                  <Nav.Link eventKey="5" onClick={this.menuSelect.bind(this, 'survey')}>Survey</Nav.Link>
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
                  <FilterComplaintForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'survey' && (
                  <FilterSurveyForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'systematicInquiry' && (
                  <FilterSystematicInquiryForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'vitals' && (
                  <FilterVitalsForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'examination' && (
                  <FilterExaminationForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'investigation' && (
                  <FilterInvestigationForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'diagnosis' && (
                  <FilterDiagnosisForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'treatment' && (
                  <FilterTreatmentForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'billing' && (
                  <FilterBillingForm
                    onCancel={this.toggleSideCol}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.menuSelect === 'vigilance' && (
                  <h3>Filter vigilance form</h3>
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
                        <AddUserForm
                          onConfirm={this.submitAddUserForm}
                          onCancel={this.cancelAdd}
                          filter={this.state.filter}
                          users={this.state.users}
                        />
                    )}
                    <UserList
                      filter={this.state.filter}
                      authId={this.context.activityId}
                      users={this.props.visit.consultants}
                      visitPage={true}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteConsultant}
                    />
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
                        <AddComplaintForm
                          onConfirm={this.submitAddComplaintForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitComplaintList
                      filter={this.state.filter}
                      complaints={this.props.visit.complaints}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteComplaint}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddSurveyForm
                          onConfirm={this.submitAddSurveyForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitSurveyList
                      filter={this.state.filter}
                      surveys={this.props.visit.surveys}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteSurvey}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddSystematicInquiryForm
                          onConfirm={this.submitAddSystematicInquiryForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitSystematicInquiryList
                      filter={this.state.filter}
                      systematicInquiry={this.props.visit.systematicInquiry}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteSystematicInquiry}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddVitalsForm
                          onConfirm={this.submitAddVitalsForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    <VisitVitalsList
                      filter={this.state.filter}
                      vitals={this.props.visit.vitals}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteVitals}
                    />
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
                        <AddExaminationForm
                          onConfirm={this.submitAddExaminationForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitExaminationList
                      filter={this.state.filter}
                      examination={this.props.visit.examination}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteExamination}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddInvestigationForm
                          onConfirm={this.submitAddInvestigationForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitInvestigationList
                      filter={this.state.filter}
                      investigation={this.props.visit.investigation}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteInvestigation}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddDiagnosisForm
                          onConfirm={this.submitAddDiagnosisForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitDiagnosisList
                      filter={this.state.filter}
                      diagnosis={this.props.visit.diagnosis}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteDiagnosis}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddTreatmentForm
                          onConfirm={this.submitAddTreatmentForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitTreatmentList
                      filter={this.state.filter}
                      treatment={this.props.visit.treatment}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteTreatment}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                        <AddBillingForm
                          onConfirm={this.submitAddBillingForm}
                          onCancel={this.cancelAdd}
                        />
                    )}
                    {this.state.addAttachmentForm === true && (
                      <AddAttachmentForm
                        onCancel={this.cancelAddAttachment}
                        onConfirm={this.addAttachment}
                      />
                    )}
                    <VisitBillingList
                      filter={this.state.filter}
                      billing={this.props.visit.billing}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteBilling}
                      onAddAttachment={this.startAddAttachment}
                    />
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
                    <VisitVigilanceList
                      filter={this.state.filter}
                      vigilance={this.props.visit.vigilance}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteVigilance}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="14">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit Image List:</p>
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
                    <VisitImageList
                      filter={this.state.filter}
                      images={this.props.visit.images}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteImage}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="15">
                    <Row className="displayPaneHeadRow">
                      <p className="displayPaneTitle">Visit File List:</p>
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
                    <VisitFileList
                      filter={this.state.filter}
                      files={this.props.visit.files}
                      authId={this.context.activityId}
                      canDelete={this.state.canDelete}
                      onDelete={this.deleteFile}
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

export default VisitDetail;
