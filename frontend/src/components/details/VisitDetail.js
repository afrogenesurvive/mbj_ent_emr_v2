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
import AddVigilanceForm from '../forms/add/AddVigilanceForm';
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
      activityId:"${activityId}",
      visitId:"${visitId}",
      visitInput:{
        vigilanceChronicIllnessDiabetesMedication:${event.target.vigilanceChronicIllnessDiabetesMedication.checked},
        vigilanceChronicIllnessDiabetesTesting:${event.target.vigilanceChronicIllnessDiabetesTesting.checked},
        vigilanceChronicIllnessDiabetesComment:"${event.target.vigilanceChronicIllnessDiabetesComment.value}",
        vigilanceChronicIllnessHbpMedication:${event.target.vigilanceChronicIllnessHbpMedication.checked},
        vigilanceChronicIllnessHbpTesting:${event.target.vigilanceChronicIllnessHbpTesting.checked},
        vigilanceChronicIllnessHbpComment:"${event.target.vigilanceChronicIllnessHbpComment.value}",
        vigilanceChronicIllnessDyslipidemiaMedication:${event.target.vigilanceChronicIllnessDyslipidemiaMedication.checked},
        vigilanceChronicIllnessDyslipidemiaTesting:${event.target.vigilanceChronicIllnessDyslipidemiaTesting.checked},
        vigilanceChronicIllnessDyslipidemiaComment:"${event.target.vigilanceChronicIllnessDyslipidemiaComment.value}",
        vigilanceChronicIllnessCadMedication:${event.target.vigilanceChronicIllnessCadMedication.checked},
        vigilanceChronicIllnessCadTesting:${event.target.vigilanceChronicIllnessCadTesting.checked},
        vigilanceChronicIllnessCadComment:"${event.target.vigilanceChronicIllnessCadComment.value}",
        vigilanceLifestyleWeightMedication:${event.target.vigilanceLifestyleWeightMedication.checked},
        vigilanceLifestyleWeightTesting:${event.target.vigilanceLifestyleWeightTesting.checked},
        vigilanceLifestyleWeightComment:"${event.target.vigilanceLifestyleWeightComment.value}",
        vigilanceLifestyleDietMedication:${event.target.vigilanceLifestyleDietMedication.checked},
        vigilanceLifestyleDietTesting:${event.target.vigilanceLifestyleDietTesting.checked},
        vigilanceLifestyleDietComment:"${event.target.vigilanceLifestyleDietComment.value}",
        vigilanceLifestyleSmokingMedication:${event.target.vigilanceLifestyleSmokingMedication.checked},
        vigilanceLifestyleSmokingTesting:${event.target.vigilanceLifestyleSmokingTesting.checked},
        vigilanceLifestyleSmokingComment:"${event.target.vigilanceLifestyleSmokingComment.value}",
        vigilanceLifestyleSubstanceAbuseMedication:${event.target.vigilanceLifestyleSubstanceAbuseMedication.checked},
        vigilanceLifestyleSubstanceAbuseTesting:${event.target.vigilanceLifestyleSubstanceAbuseTesting.checked},
        vigilanceLifestyleSubstanceAbuseComment:"${event.target.vigilanceLifestyleSubstanceAbuseComment.value}",
        vigilanceLifestyleExerciseMedication:${event.target.vigilanceLifestyleExerciseMedication.checked},
        vigilanceLifestyleExerciseTesting:${event.target.vigilanceLifestyleExerciseTesting.checked},
        vigilanceLifestyleExerciseComment:"${event.target.vigilanceLifestyleExerciseComment.value}",
        vigilanceLifestyleAllergiesMedication:${event.target.vigilanceLifestyleAllergiesMedication.checked},
        vigilanceLifestyleAllergiesTesting:${event.target.vigilanceLifestyleAllergiesTesting.checked},
        vigilanceLifestyleAllergiesComment:"${event.target.vigilanceLifestyleAllergiesComment.value}",
        vigilanceLifestyleAsthmaMedication:${event.target.vigilanceLifestyleAsthmaMedication.checked},
        vigilanceLifestyleAsthmaTesting:${event.target.vigilanceLifestyleAsthmaTesting.checked},
        vigilanceLifestyleAsthmaComment:"${event.target.vigilanceLifestyleAsthmaComment.value}",
        vigilanceScreeningBreastMedication:${event.target.vigilanceScreeningBreastMedication.checked},
        vigilanceScreeningBreastTesting:${event.target.vigilanceScreeningBreastTesting.checked},
        vigilanceScreeningBreastComment:"${event.target.vigilanceScreeningBreastComment.value}",
        vigilanceScreeningProstateMedication:${event.target.vigilanceScreeningProstateMedication.checked},
        vigilanceScreeningProstateTesting:${event.target.vigilanceScreeningProstateTesting.checked},
        vigilanceScreeningProstateComment:"${event.target.vigilanceScreeningProstateComment.value}",
        vigilanceScreeningCervixMedication:${event.target.vigilanceScreeningCervixMedication.checked},
        vigilanceScreeningCervixTesting:${event.target.vigilanceScreeningCervixTesting.checked},
        vigilanceScreeningCervixComment:"${event.target.vigilanceScreeningCervixComment.value}",
        vigilanceScreeningColonMedication:${event.target.vigilanceScreeningColonMedication.checked},
        vigilanceScreeningColonTesting:${event.target.vigilanceScreeningColonTesting.checked},
        vigilanceScreeningColonComment:"${event.target.vigilanceScreeningColonComment.value}",
        vigilanceScreeningDentalMedication:${event.target.vigilanceScreeningDentalMedication.checked},
        vigilanceScreeningDentalTesting:${event.target.vigilanceScreeningDentalTesting.checked},
        vigilanceScreeningDentalComment:"${event.target.vigilanceScreeningDentalComment.value}",
        vigilanceVaccinesInfluenzaMedication:${event.target.vigilanceVaccinesInfluenzaMedication.checked},
        vigilanceVaccinesInfluenzaTesting:${event.target.vigilanceVaccinesInfluenzaTesting.checked},
        vigilanceVaccinesInfluenzaComment:"${event.target.vigilanceVaccinesInfluenzaComment.value}",
        vigilanceVaccinesVaricellaMedication:${event.target.vigilanceVaccinesVaricellaMedication.checked},
        vigilanceVaccinesVaricellaTesting:${event.target.vigilanceVaccinesVaricellaTesting.checked},
        vigilanceVaccinesVaricellaComment:"${event.target.vigilanceVaccinesVaricellaComment.value}",
        vigilanceVaccinesHpvMedication:${event.target.vigilanceVaccinesHpvMedication.checked},
        vigilanceVaccinesHpvTesting:${event.target.vigilanceVaccinesHpvTesting.checked},
        vigilanceVaccinesHpvComment:"${event.target.vigilanceVaccinesHpvComment.value}",
        vigilanceVaccinesMmrMedication:${event.target.vigilanceVaccinesMmrMedication.checked},
        vigilanceVaccinesMmrTesting:${event.target.vigilanceVaccinesMmrTesting.checked},
        vigilanceVaccinesMmrComment:"${event.target.vigilanceVaccinesMmrComment.value}",
        vigilanceVaccinesTetanusMedication:${event.target.vigilanceVaccinesTetanusMedication.checked},
        vigilanceVaccinesTetanusTesting:${event.target.vigilanceVaccinesTetanusTesting.checked},
        vigilanceVaccinesTetanusComment:"${event.target.vigilanceVaccinesTetanusComment.value}",
        vigilanceVaccinesPneumovaxMedication:${event.target.vigilanceVaccinesPneumovaxMedication.checked},
        vigilanceVaccinesPneumovaxTesting:${event.target.vigilanceVaccinesPneumovaxTesting.checked},
        vigilanceVaccinesPneumovaxComment:"${event.target.vigilanceVaccinesPneumovaxComment.value}",
        vigilanceVaccinesOtherName:"${event.target.vigilanceVaccinesOtherName.value}",
        vigilanceVaccinesOtherMedication:${event.target.vigilanceVaccinesOtherMedication.checked},
        vigilanceVaccinesOtherTesting:${event.target.vigilanceVaccinesOtherTesting.checked},
        vigilanceVaccinesOtherComment:"${event.target.vigilanceVaccinesOtherComment.value}"
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

  console.log('...deleting Vigilance...');
  this.context.setUserAlert('...deleting Vigilance...')
  this.setState({isLoading: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
        mutation {deleteVisitVigilance(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            vigilanceChronicIllnessDiabetesMedication:${args.chronicIllness.diabetes.medication},
            vigilanceChronicIllnessDiabetesTesting:${args.chronicIllness.diabetes.testing},
            vigilanceChronicIllnessDiabetesComment:"${args.chronicIllness.diabetes.comment}",
            vigilanceChronicIllnessHbpMedication:${args.chronicIllness.hbp.medication},
            vigilanceChronicIllnessHbpTesting:${args.chronicIllness.hbp.testing},
            vigilanceChronicIllnessHbpComment:"${args.chronicIllness.hbp.comment}",
            vigilanceChronicIllnessDyslipidemiaMedication:${args.chronicIllness.dyslipidemia.medication},
            vigilanceChronicIllnessDyslipidemiaTesting:${args.chronicIllness.dyslipidemia.testing},
            vigilanceChronicIllnessDyslipidemiaComment:"${args.chronicIllness.dyslipidemia.comment}",
            vigilanceChronicIllnessCadMedication:${args.chronicIllness.cad.medication},
            vigilanceChronicIllnessCadTesting:${args.chronicIllness.cad.testing},
            vigilanceChronicIllnessCadComment:"${args.chronicIllness.cad.comment}",
            vigilanceLifestyleWeightMedication:${args.lifestyle.weight.medication},
            vigilanceLifestyleWeightTesting:${args.lifestyle.weight.testing},
            vigilanceLifestyleWeightComment:"${args.lifestyle.weight.comment}",
            vigilanceLifestyleDietMedication:${args.lifestyle.diet.medication},
            vigilanceLifestyleDietTesting:${args.lifestyle.diet.testing},
            vigilanceLifestyleDietComment:"${args.lifestyle.diet.comment}",
            vigilanceLifestyleSmokingMedication:${args.lifestyle.smoking.medication},
            vigilanceLifestyleSmokingTesting:${args.lifestyle.smoking.testing},
            vigilanceLifestyleSmokingComment:"${args.lifestyle.smoking.comment}",
            vigilanceLifestyleSubstanceAbuseMedication:${args.lifestyle.substanceAbuse.medication},
            vigilanceLifestyleSubstanceAbuseTesting:${args.lifestyle.substanceAbuse.testing},
            vigilanceLifestyleSubstanceAbuseComment:"${args.lifestyle.substanceAbuse.comment}",
            vigilanceLifestyleExerciseMedication:${args.lifestyle.exercise.medication},
            vigilanceLifestyleExerciseTesting:${args.lifestyle.exercise.testing},
            vigilanceLifestyleExerciseComment:"${args.lifestyle.exercise.comment}",
            vigilanceLifestyleAllergiesMedication:${args.lifestyle.allergies.medication},
            vigilanceLifestyleAllergiesTesting:${args.lifestyle.allergies.testing},
            vigilanceLifestyleAllergiesComment:"${args.lifestyle.allergies.comment}",
            vigilanceLifestyleAsthmaMedication:${args.lifestyle.asthma.medication},
            vigilanceLifestyleAsthmaTesting:${args.lifestyle.asthma.testing},
            vigilanceLifestyleAsthmaComment:"${args.lifestyle.asthma.comment}",
            vigilanceScreeningBreastMedication:${args.screening.breast.medication},
            vigilanceScreeningBreastTesting:${args.screening.breast.testing},
            vigilanceScreeningBreastComment:"${args.screening.breast.comment}",
            vigilanceScreeningProstateMedication:${args.screening.prostate.medication},
            vigilanceScreeningProstateTesting:${args.screening.prostate.testing},
            vigilanceScreeningProstateComment:"${args.screening.prostate.comment}",
            vigilanceScreeningCervixMedication:${args.screening.cervix.medication},
            vigilanceScreeningCervixTesting:${args.screening.cervix.testing},
            vigilanceScreeningCervixComment:"${args.screening.cervix.comment}",
            vigilanceScreeningColonMedication:${args.screening.colon.medication},
            vigilanceScreeningColonTesting:${args.screening.colon.testing},
            vigilanceScreeningColonComment:"${args.screening.colon.comment}",
            vigilanceScreeningDentalMedication:${args.screening.dental.medication},
            vigilanceScreeningDentalTesting:${args.screening.dental.testing},
            vigilanceScreeningDentalComment:"${args.screening.dental.comment}",
            vigilanceVaccinesInfluenzaMedication:${args.vaccines.influenza.medication},
            vigilanceVaccinesInfluenzaTesting:${args.vaccines.influenza.testing},
            vigilanceVaccinesInfluenzaComment:"${args.vaccines.influenza.comment}",
            vigilanceVaccinesVaricellaMedication:${args.vaccines.varicella.medication},
            vigilanceVaccinesVaricellaTesting:${args.vaccines.varicella.testing},
            vigilanceVaccinesVaricellaComment:"${args.vaccines.varicella.comment}",
            vigilanceVaccinesHpvMedication:${args.vaccines.hpv.medication},
            vigilanceVaccinesHpvTesting:${args.vaccines.hpv.testing},
            vigilanceVaccinesHpvComment:"${args.vaccines.hpv.comment}",
            vigilanceVaccinesMmrMedication:${args.vaccines.mmr.medication},
            vigilanceVaccinesMmrTesting:${args.vaccines.mmr.testing},
            vigilanceVaccinesMmrComment:"${args.vaccines.mmr.comment}",
            vigilanceVaccinesTetanusMedication:${args.vaccines.tetanus.medication},
            vigilanceVaccinesTetanusTesting:${args.vaccines.tetanus.testing},
            vigilanceVaccinesTetanusComment:"${args.vaccines.tetanus.comment}",
            vigilanceVaccinesPneumovaxMedication:${args.vaccines.pneumovax.medication},
            vigilanceVaccinesPneumovaxTesting:${args.vaccines.pneumovax.testing},
            vigilanceVaccinesPneumovaxComment:"${args.vaccines.pneumovax.comment}",
            vigilanceVaccinesOtherName:"${args.vaccines.other.name}",
            vigilanceVaccinesOtherMedication:${args.vaccines.other.medication},
            vigilanceVaccinesOtherTesting:${args.vaccines.other.testing},
            vigilanceVaccinesOtherComment:"${args.vaccines.other.comment}"
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
  const visitId = this.props.visit._id;
  let args = this.state.addAttachmentArgs;
  let field = args.field;

  let requestBody;

  if (field === 'complaint') {
    let complaintTitle = args.data.title;
    let complaintDescription = args.data.description;
    let complaintAnamnesis = args.data.anamnesis;
    let complaintAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitComplaintAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            complaintTitle:"${complaintTitle}",
            complaintDescription:"${complaintDescription}",
            complaintAnamnesis:"${complaintAnamnesis}",
            complaintAttachment:"${complaintAttachment}"
          })
        {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'survey') {
    let surveyTitle = args.data.title;
    let surveyDescription = args.data.description;
    let surveyAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitSurveyAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            surveyTitle:"${surveyTitle}",
            surveyDescription:"${surveyDescription}",
            surveyAttachment:"${surveyAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'systematicInquiry') {
    let systematicInquiryTitle = args.data.title;
    let systematicInquiryDescription = args.data.description;
    let systematicInquiryAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitSysInquiryAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            systematicInquiryTitle:"${systematicInquiryTitle}",
            systematicInquiryDescription:"${systematicInquiryDescription}",
            systematicInquiryAttachment:"${systematicInquiryAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'examination') {
    let examinationGeneral = args.data.general;
    let examinationArea = args.data.area;
    let examinationType = args.data.type;
    let examinationMeasure = args.data.measure;
    let examinationValue = args.data.value;
    let examinationDescription = args.data.description;
    let examinationFollowUp = args.data.followUp;
    let examinationAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitExaminationAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            examinationGeneral:"${examinationGeneral}",
            examinationArea:"${examinationArea}",
            examinationType:"${examinationType}",
            examinationMeasure:"${examinationMeasure}",
            examinationValue:"${examinationValue}",
            examinationDescription:"${examinationDescription}",
            examinationFollowUp:${examinationFollowUp},
            examinationAttachment:"${examinationAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'investigation') {
    let investigationTitle = args.data.title;
    let investigationType = args.data.type;
    let investigationDescription = args.data.description;
    let investigationAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitInvestigationAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            investigationTitle:"${investigationTitle}",
            investigationType:"${investigationType}",
            investigationDescription:"${investigationDescription}",
            investigationAttachment:"${investigationAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'diagnosis') {
    let diagnosisTitle = args.data.title;
    let diagnosisType = args.data.type;
    let diagnosisDescription = args.data.description;
    let diagnosisAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitDiagnosisAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            diagnosisTitle:"${diagnosisTitle}",
            diagnosisType:"${diagnosisType}",
            diagnosisDescription:"${diagnosisDescription}",
            diagnosisAttachment:"${diagnosisAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'treatment') {
    let treatmentType = args.data.type;
    let treatmentTitle = args.data.title;
    let treatmentDescription = args.data.description;
    let treatmentDose = args.data.dose;
    let treatmentFrequency = args.data.frequency;
    let treatmentAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitTreatmentAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            treatmentType:"${treatmentType}",
            treatmentTitle:"${treatmentTitle}",
            treatmentDescription:"${treatmentDescription}",
            treatmentDose:"${treatmentDose}",
            treatmentFrequency:"${treatmentFrequency}",
            treatmentAttachment:"${treatmentAttachment}"
        })
        {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'billing') {
    let billingAmount = args.data.amount;
    let billingPaid = args.data.paid;
    let billingTitle = args.data.title;
    let billingType = args.data.type;
    let billingDescription = args.data.description;
    let billingNotes = args.data.notes;
    let billingAttachment = event.target.attachment.value;

    requestBody = {
      query: `
        mutation {addVisitBillingAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            billingTitle:"${billingTitle}",
            billingType:"${billingType}",
            billingDescription:"${billingDescription}",
            billingAmount:${billingAmount},
            billingPaid:${billingPaid},
            billingAttachment:"${billingAttachment}",
            billingNotes:"${billingNotes}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      if (field === 'complaint') {
        // console.log('...resData...',resData.data.addVisitComplaintAttachment);
      }
      if (field === 'survey') {
        // console.log('...resData...',resData.data.addVisitSurveyAttachment);
      }
      if (field === 'systematicInquiry') {
        // console.log('...resData...',resData.data.addVisitSysInquiryAttachment);
      }
      if (field === 'examination') {
        // console.log('...resData...',resData.data.addVisitExaminationAttachment);
      }
      if (field === 'investigation') {
        // console.log('...resData...',resData.data.addVisitInvestigationAttachment);
      }
      if (field === 'diagnosis') {
        // console.log('...resData...',resData.data.addVisitDiagnosisAttachment);
      }
      if (field === 'treatment') {
        // console.log('...resData...',resData.data.addVisitTreatmentAttachment);
      }
      if (field === 'billing') {
        // console.log('...resData...',resData.data.addVisitBillingAttachment);
      }

      let responseAlert = '...add attachment success!...';
      let error = null;

      if (field === 'complaint') {
        if (resData.data.addVisitComplaintAttachment.error) {
          error = resData.data.addVisitComplaintAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'survey') {
        if (resData.data.addVisitSurveyAttachment.error) {
          error = resData.data.addVisitSurveyAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'systematicInquiry') {
        if (resData.data.addVisitSysInquiryAttachment.error) {
          error = resData.data.addVisitSysInquiryAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'examination') {
        if (resData.data.addVisitExaminationAttachment.error) {
          error = resData.data.addVisitExaminationAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'investigation') {
        if (resData.data.addVisitInvestigationAttachment.error) {
          error = resData.data.addVisitInvestigationAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'diagnosis') {
        if (resData.data.addVisitDiagnosisAttachment.error) {
          error = resData.data.addVisitDiagnosisAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'treatment') {
        if (resData.data.addVisitTreatmentAttachment.error) {
          error = resData.data.addVisitTreatmentAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'billing') {
        if (resData.data.addVisitBillingAttachment.error) {
          error = resData.data.addVisitBillingAttachment.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (field === 'complaint') {
        this.props.updateVisit(resData.data.addVisitComplaintAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitComplaintAttachment,
          activityA: `addVisitComplaintAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'survey') {
        this.props.updateVisit(resData.data.addVisitSurveyAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitSurveyAttachment,
          activityA: `addVisitSurveyAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'systematicInquiry') {
        this.props.updateVisit(resData.data.addVisitSysInquiryAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitSysInquiryAttachment,
          activityA: `addVisitSysInquiryAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'examination') {
        this.props.updateVisit(resData.data.addVisitExaminationAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitExaminationAttachment,
          activityA: `addVisitExaminationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'investigation') {
        this.props.updateVisit(resData.data.addVisitInvestigationAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitInvestigationAttachment,
          activityA: `addVisitInvestigationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'diagnosis') {
        this.props.updateVisit(resData.data.addVisitDiagnosisAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitDiagnosisAttachment,
          activityA: `addVisitDiagnosisAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'treatment') {
        this.props.updateVisit(resData.data.addVisitTreatmentAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitTreatmentAttachment,
          activityA: `addVisitTreatmentAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'billing') {
        this.props.updateVisit(resData.data.addVisitBillingAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.addVisitBillingAttachment,
          activityA: `addVisitBillingAttachment?activityId:${activityId},visitId:${visitId}`
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
  console.log('...deleting attachment...', args.type);
  this.context.setUserAlert('...adding attachment...');
  // this.setState({isLoading: true})

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const field = args.type;
  const attachment = args.attachment;
  const item = args.item;

  let requestBody;

  // complaint
  // survey
  // systematicInquiry
  // examination
  // investigation
  // diagnosis
  // treatment
  // billing

  if (field === 'complaint') {
    let complaintTitle = item.title;
    let complaintDescription = item.description;
    let complaintAnamnesis = item.anamnesis;
    let complaintAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitComplaintAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            complaintTitle:"${complaintTitle}",
            complaintDescription:"${complaintDescription}",
            complaintAnamnesis:"${complaintAnamnesis}",
            complaintAttachment:"${complaintAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'survey') {
    let surveyTitle = item.title;
    let surveyDescription = item.description;
    let surveyAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitSurveyAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            surveyTitle:"${surveyTitle}",
            surveyDescription:"${surveyDescription}",
            surveyAttachment:"${surveyAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'systematicInquiry') {
    let systematicInquiryTitle = item.title;
    let systematicInquiryDescription = item.description;
    let systematicInquiryAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitSysInquiryAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            systematicInquiryTitle:"${systematicInquiryTitle}",
            systematicInquiryDescription:"${systematicInquiryDescription}",
            systematicInquiryAttachment:"${systematicInquiryAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'examination') {
    let examinationGeneral = item.general;
    let examinationArea = item.area;
    let examinationType = item.type;
    let examinationMeasure = item.measure;
    let examinationValue = item.value;
    let examinationDescription = item.description;
    let examinationFollowUp = item.followUp;
    let examinationAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitExaminationAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            examinationGeneral:"${examinationGeneral}",
            examinationArea:"${examinationArea}",
            examinationType:"${examinationType}",
            examinationMeasure:"${examinationMeasure}",
            examinationValue:"${examinationValue}",
            examinationDescription:"${examinationDescription}",
            examinationFollowUp:${examinationFollowUp},
            examinationAttachment:"${examinationAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'investigation') {
    let investigationTitle = item.title;
    let investigationType = item.type;
    let investigationDescription = item.description;
    let investigationAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitInvestigationAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            investigationTitle:"${investigationTitle}",
            investigationType:"${investigationType}",
            investigationDescription:"${investigationDescription}",
            investigationAttachment:"${investigationAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'diagnosis') {
    let diagnosisTitle = item.title;
    let diagnosisType = item.type;
    let diagnosisDescription = item.description;
    let diagnosisAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitDiagnosisAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            diagnosisTitle:"${diagnosisTitle}",
            diagnosisType:"${diagnosisType}",
            diagnosisDescription:"${diagnosisDescription}",
            diagnosisAttachment:"${diagnosisAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'treatment') {

    let treatmentType = item.type;
    let treatmentTitle = item.title;
    let treatmentDescription = item.description;
    let treatmentDose = item.dose;
    let treatmentFrequency = item.frequency;
    let treatmentAttachment = attachment;

    requestBody = {
      query: `
        mutation {deleteVisitTreatmentAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            treatmentType:"${treatmentType}",
            treatmentTitle:"${treatmentTitle}",
            treatmentDescription:"${treatmentDescription}",
            treatmentDose:"${treatmentDose}",
            treatmentFrequency:"${treatmentFrequency}",
            treatmentAttachment:"${treatmentAttachment}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
      `};
  }
  if (field === 'billing') {

    let billingTitle = item.title;
    let billingType = item.type;
    let billingDescription = item.description;
    let billingAmount = item.amount;
    let billingPaid = item.paid;
    let billingAttachment = attachment;
    let billingNotes = item.notes;

    requestBody = {
      query: `
        mutation {deleteVisitBillingAttachment(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            billingTitle:"${billingTitle}",
            billingType:"${billingType}",
            billingDescription:"${billingDescription}",
            billingAmount:${billingAmount},
            billingPaid:${billingPaid},
            billingAttachment:"${billingAttachment}",
            billingNotes:"${billingNotes}"
          })
          {_id,date,time,title,type,subType,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description},complaints{title,description,anamnesis,attachments},surveys{title,description,attachments},systematicInquiry{title,description,attachments},vitals{pr,bp1,bp2,rr,temp,ps02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value}},examination{general,area,type,measure,value,description,followUp,attachments},investigation{type,title,description,attachments},diagnosis{type,title,description,attachments},treatment{type,title,description,dose,frequency,attachments},billing{title,type,description,amount,paid,attachments,notes},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}}},images{name,type,path},files{name,type,path}}}
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
      if (field === 'complaint') {
        // console.log('...resData...',resData.data.deleteVisitComplaintAttachment);
      }
      if (field === 'survey') {
        // console.log('...resData...',resData.data.deleteVisitSurveyAttachment);
      }
      if (field === 'systematicInquiry') {
        // console.log('...resData...',resData.data.deleteVisitSysInquiryAttachment);
      }
      if (field === 'examination') {
        // console.log('...resData...',resData.data.deleteVisitExaminationAttachment);
      }
      if (field === 'investigation') {
        // console.log('...resData...',resData.data.deleteVisitInvestigationAttachment);
      }
      if (field === 'diagnosis') {
        // console.log('...resData...',resData.data.deleteVisitDiagnosisAttachment);
      }
      if (field === 'treatment') {
        // console.log('...resData...',resData.data.deleteVisitTreatmentAttachment);
      }
      if (field === 'billing') {
        // console.log('...resData...',resData.data.deleteVisitBillingAttachment);
      }

      let responseAlert = '...delete attachment success!...';
      let error = null;

      if (field === 'complaint') {
        if (resData.data.deleteVisitComplaintAttachment.error) {
          error = resData.data.deleteVisitComplaintAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'survey') {
        if (resData.data.deleteVisitSurveyAttachment.error) {
          error = resData.data.deleteVisitSurveyAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'systematicInquiry') {
        if (resData.data.deleteVisitSysInquiryAttachment.error) {
          error = resData.data.deleteVisitSysInquiryAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'examination') {
        if (resData.data.deleteVisitExaminationAttachment.error) {
          error = resData.data.deleteVisitExaminationAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'investigation') {
        if (resData.data.deleteVisitInvestigationAttachment.error) {
          error = resData.data.deleteVisitInvestigationAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'diagnosis') {
        if (resData.data.deleteVisitDiagnosisAttachment.error) {
          error = resData.data.deleteVisitDiagnosisAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'treatment') {
        if (resData.data.deleteVisitTreatmentAttachment.error) {
          error = resData.data.deleteVisitTreatmentAttachment.error;
          responseAlert = error;
        }
      }
      if (field === 'billing') {
        if (resData.data.deleteVisitBillingAttachment.error) {
          error = resData.data.deleteVisitBillingAttachment.error;
          responseAlert = error;
        }
      }

      this.context.setUserAlert(responseAlert)

      if (field === 'complaint') {
        this.props.updateVisit(resData.data.deleteVisitComplaintAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitComplaintAttachment,
          activityA: `deleteVisitComplaintAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'survey') {
        this.props.updateVisit(resData.data.deleteVisitSurveyAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitSurveyAttachment,
          activityA: `deleteVisitSurveyAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'systematicInquiry') {
        this.props.updateVisit(resData.data.deleteVisitSysInquiryAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitSysInquiryAttachment,
          activityA: `deleteVisitSysInquiryAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'examination') {
        this.props.updateVisit(resData.data.deleteVisitExaminationAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitExaminationAttachment,
          activityA: `deleteVisitExaminationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'investigation') {
        this.props.updateVisit(resData.data.deleteVisitInvestigationAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitInvestigationAttachment,
          activityA: `deleteVisitInvestigationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'diagnosis') {
        this.props.updateVisit(resData.data.deleteVisitDiagnosisAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitDiagnosisAttachment,
          activityA: `deleteVisitDiagnosisAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'treatment') {
        this.props.updateVisit(resData.data.deleteVisitTreatmentAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitTreatmentAttachment,
          activityA: `deleteVisitTreatmentAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'billing') {
        this.props.updateVisit(resData.data.deleteVisitBillingAttachment)
        this.setState({
          isLoading: false,
          selectedVisit: resData.data.deleteVisitBillingAttachment,
          activityA: `deleteVisitBillingAttachment?activityId:${activityId},visitId:${visitId}`
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                      deleteAttachment={this.deleteAttachment}
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
                        <AddVigilanceForm
                          onConfirm={this.submitAddVigilanceForm}
                          onCancel={this.cancelAdd}
                        />
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
