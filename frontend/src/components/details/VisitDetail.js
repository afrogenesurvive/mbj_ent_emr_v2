import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import Tab from 'react-bootstrap/Tab';
// import Nav from 'react-bootstrap/Nav';
// import { NavLink } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment-timezone';
// import AddToCalendar from 'react-add-to-calendar';
import S3 from 'react-aws-s3';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthContext from '../../context/auth-context';
// import AlertBox from '../alertBox/AlertBox';
import LoadingOverlay from '../overlay/LoadingOverlay';
import LoadingOverlay2 from '../overlay/LoadingOverlay2';

// import PatientAddressList from '../lists/patient/PatientAddressList';
// import PatientNextOfKinList from '../lists/patient/PatientNextOfKinList'
import PatientAllergyList from '../lists/patient/PatientAllergyList'
import PatientMedicationList from '../lists/patient/PatientMedicationList'
// import PatientImageList from '../lists/patient/PatientImageList'
// import PatientFileList from '../lists/patient/PatientFileList'
// import UserAppointmentList from '../lists/user/UserAppointmentList'
// import AppointmentNoteList from '../lists/appointment/AppointmentNoteList'
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


// import FilterAppointmentForm from '../forms/filter/FilterAppointmentForm';
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

// import PatientAllergyList from '../lists/patient/PatientAllergyList'
// import PatientMedicationList from '../lists/patient/PatientMedicationList'
import PatientComorbidityList from '../lists/patient/PatientComorbidityList'
import FilterAllergyForm from '../forms/filter/FilterAllergyForm';
import FilterMedicationForm from '../forms/filter/FilterMedicationForm';
import FilterComorbidityForm from '../forms/filter/FilterComorbidityForm';

// import loadingGif from '../../assets/loading.gif';
import {
  // faBatteryThreeQuarters,
  // faPlusSquare,
  // faBatteryEmpty,
  // faFolderMinus,
  // faEye,
  // faEraser,
  // faTrashAlt,
  // faBan,
  // faCheckSquare,
  faExternalLinkAlt,
  // faBath,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './details.css';

class VisitDetail extends Component {
  state = {
    visitPage: true,
    activityA: null,
    role: null,
    overlay: false,
    overlay2: false,
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
    startFilter: false,
    selectFilter: null,
    menuSelected: null,
    menuSelect: 'basic',
    adding: {
      state: null,
      field: null
    },
    canUpdate: false,
    updating: {
      state: null,
      field: null,
      previous: {}
    },
    canDelete: false,
    canEdit: false,
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

    },
    pocketVars: null,
    s3State: {
      action: null,
      target: null,
      status: null
    },
    hasComorbidities: false,
    hasAllergies: false,
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.propsVisit = this.props.visit;
    this.hasComorbidities = false;
    this.hasAllergies = false;
    this.overlay2 = false;
  }

componentDidMount () {
  console.log('...visit details component mounted...',this.props.visit);
  let seshStore;
  if (sessionStorage.getItem('logInfo')) {
    seshStore = JSON.parse(sessionStorage.getItem('logInfo'));
    this.getPocketVars(seshStore);
  }
  if (this.context.role === 'Admin'
      // this.context.role === 'Doctor' ||
      // this.context.role === 'Nurse'
    ) {
    this.setState({
      canDelete: true
    })
  }

  // console.log('canEdit...?', this.props.visit.consultants.map(x=>x._id), this.context.activityId, this.context.role);
  if ( this.props.visit.consultants.map(x=>x._id).includes(this.context.activityId) === true) {
    console.log('You can edit!!');
    this.setState({
      canEdit: true,
      canUpdate: true
    })
  }

  this.getAllUsers(seshStore);
  this.checkAllergies();
}
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

   fetch('https://mbjentemr.click/graphql', {
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
      console.log(err);
      this.context.setUserAlert(err);
    });
  }

logUserActivity(args) {
  console.log('...logUserActivity...');
  const activityId = args.activityId;
  const token = args.token;
  const userId = activityId;
  const request = this.state.activityA;
  const activityDate = moment().tz("America/Bogota").format('YYYY-MM-DD');
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
   fetch('https://mbjentemr.click/graphql', {
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
        {_id,title,name,role,username,registrationNumber,employmentDate,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},loggedIn,clientConnected,verification{verified,type,code},attendance{date,status,description,highlighted},leave{type,startDate,endDate,description,highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted},notes,appointments{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,visit{_id},patient{_id,name},consultants{_id},inProgress,attended,important,notes,tags,creator{_id}},visits{_id,date,time,title,type,subType,patient{_id,title,name,lastName,role,username,dob,age,gender,contact{phone,phone2,email}},consultants{_id,title,name,role,username,gender,contact{phone,phone2,email}}},reminders{_id},activity{date,request}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.setState({
        isLoading: false,
        users: resData.data.getAllUsers,
        activityA: `getAllUsers?activityId:${activityId},userId:${userId}`
      });
      this.logUserActivity({activityId: activityId,token: token});

      this.setStateCalEvent();
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
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const title = this.props.visit.patient.name+'_complaint_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const description = event.target.description.value.replace(/\n/g, ' ');
  const anamnesis = event.target.anamnesis.value.replace(/\n/g, ' ');
  // const attachment = event.target.attachment.value;

  if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      anamnesis.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/complaint/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'complaint attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'complaint attachment',
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
              target: 'complaint attachment',
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
              target: 'complaint attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitComplaint(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            complaintTitle:"${title}",
            complaintDescription:"${description}",
            complaintAnamnesis:"${anamnesis}",
            complaintAttachment:"${file2Path}"
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitComplaint)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteComplaint = (args) => {

  console.log('...deleting complaint...');
  this.context.setUserAlert('...deleting complaint...')
  this.setState({isLoading: true, overlay2: true});

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
            complaintAttachments:"${attachments}",
            complaintHighlighted:${args.highlighted}
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitComplaint)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitComplaint,
        activityA: `deleteVisitComplaint?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitComplaint;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/complaint/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/complaint/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `complaint attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitComplaintHighlighted = (args) => {
  console.log('...toggling visit complaint highlight...');
  this.context.setUserAlert('...toggling visit complaint highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  let title = args.title;
  let description = args.description.replace(/\n/g, ' ');
  let anamnesis = args.anamnesis.replace(/\n/g, ' ');
  let highlighted = args.highlighted;
  let attachments = args.attachments.join();

  requestBody = {
    query: `
      mutation {toggleVisitComplaintHighlighted(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          complaintTitle:"${title}",
          complaintDescription:"${description}",
          complaintAnamnesis:"${anamnesis}",
          complaintHighlighted:${highlighted},
          complaintAttachments:"${attachments}"
        })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitComplaintHighlighted);
      let responseAlert = `...complaint highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitComplaintHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitComplaintHighlighted,
        activityA: `toggleVisitComplaintHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitComplaintHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
submitUpdateComplaintForm = (event) => {
  event.preventDefault();
  console.log('updating complaint...');
  this.context.setUserAlert('...updating complaint...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldComplaint = {
    title: this.state.updating.previous.title,
    description: this.state.updating.previous.description,
    anamnesis: this.state.updating.previous.anamnesis,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newComplaint = {
    title: this.props.visit.patient.name+'_complaint_'+moment().format('YYYY-MM-DD, h:mm:ss a'),
    description: event.target.description.value,
    anamnesis: event.target.anamnesis.value,
    attachments: oldComplaint.attachments,
    highlighted: oldComplaint.highlighted,
  }


  if (
      newComplaint.title.trim().length === 0 ||
      newComplaint.description.trim().length === 0 ||
      newComplaint.anamnesis.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitComplaint(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          complaintTitle:"${oldComplaint.title}",
          complaintDescription:"${oldComplaint.description}",
          complaintAnamnesis:"${oldComplaint.anamnesis}",
          complaintAttachments:"${oldComplaint.attachments}",
          complaintHighlighted: ${oldComplaint.highlighted}
        }
        visitInput2:{
          complaintTitle:"${newComplaint.title}",
          complaintDescription:"${newComplaint.description}",
          complaintAnamnesis:"${newComplaint.anamnesis}",
          complaintAttachments:"${newComplaint.attachments}",
          complaintHighlighted: ${newComplaint.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientComplaint);
      let responseAlert = '...complaint update success!...';
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
      this.props.updateVisit(resData.data.updateVisitComplaint)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitComplaint,
        activityA: `updateVisitComplaint?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitComplaint;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddSurveyForm = (event) => {
  event.preventDefault();
  console.log('...adding survey...');
  this.context.setUserAlert('...adding survey...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = this.props.visit.patient.name+'_survey_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const description = event.target.description.value.replace(/\n/g, ' ');
  // const attachment = event.target.attachment.value;

  if (
      title.trim().length === 0 ||
      description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/survey/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'survey attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'survey attachment',
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
              target: 'survey attachment',
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
              target: 'survey attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitSurvey(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          surveyTitle:"${title}",
          surveyDescription:"${description}",
          surveyAttachment:"${file2Path}"
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitSurvey)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteSurvey = (args) => {

  console.log('...deleting survey...');
  this.context.setUserAlert('...deleting survey...')
  this.setState({isLoading: true, overlay2: false});

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
          surveyAttachments:"${attachments}",
          surveyHighlighted:${args.highlighted}
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitSurvey)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitSurvey,
        activityA: `deleteVisitSurvey?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitSurvey;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/survey/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/survey/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `survey attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitSurveyHighlighted = (args) => {
  console.log('...toggling visit survey highlight...');
  this.context.setUserAlert('...toggling visit survey highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  let title = args.title;
  let description = args.description.replace(/\n/g, ' ');
  let highlighted = args.highlighted;
  let attachments = args.attachments.join();

  requestBody = {
    query: `
      mutation {toggleVisitSurveyHighlighted(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          surveyTitle:"${title}",
          surveyDescription:"${description}",
          surveyHighlighted:${highlighted},
          surveyAttachments:"${attachments}"
        })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitSurveyHighlighted);
      let responseAlert = `...survey highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitSurveyHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitSurveyHighlighted,
        activityA: `toggleVisitSurveyHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitSurveyHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
submitUpdateSurveyForm = (event) => {
  event.preventDefault();
  console.log('updating survey...');
  this.context.setUserAlert('...updating survey...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldSurvey = {
    title: this.state.updating.previous.title,
    description: this.state.updating.previous.description,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newSurvey = {
    title: this.props.visit.patient.name+'_survey_'+moment().format('YYYY-MM-DD, h:mm:ss a'),
    description: event.target.description.value,
    attachments: oldSurvey.attachments,
    highlighted: oldSurvey.highlighted,
  }


  if (
      newSurvey.title.trim().length === 0 ||
      newSurvey.description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitSurvey(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          surveyTitle:"${oldSurvey.title}",
          surveyDescription:"${oldSurvey.description}",
          surveyAttachments:"${oldSurvey.attachments}",
          surveyHighlighted: ${oldSurvey.highlighted}
        }
        visitInput2:{
          surveyTitle:"${newSurvey.title}",
          surveyDescription:"${newSurvey.description}",
          surveyAttachments:"${newSurvey.attachments}",
          surveyHighlighted: ${newSurvey.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientSurvey);
      let responseAlert = '...survey update success!...';
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
      this.props.updateVisit(resData.data.updateVisitSurvey)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitSurvey,
        activityA: `updateVisitSurvey?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitSurvey;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddSystematicInquiryForm = (event) => {
  event.preventDefault();
  console.log('...adding systematicInquiry...');
  this.context.setUserAlert('...adding systematicInquiry...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = this.props.visit.patient.name+'_systematicInquiry_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const description = event.target.description.value.replace(/\n/g, ' ');

  // const attachment = event.target.attachment.value;

  if (
      title.trim().length === 0 ||
      description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/systematicInquiry/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'systematicInquiry attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'systematicInquiry attachment',
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
              target: 'systematicInquiry attachment',
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
              target: 'systematicInquiry attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitSysInquiry(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          systematicInquiryTitle:"${title}",
          systematicInquiryDescription:"${description}",
          systematicInquiryAttachment:"${file2Path}"
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitSysInquiry)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteSystematicInquiry = (args) => {

  console.log('...deleting systematicInquiry...');
  this.context.setUserAlert('...deleting systematicInquiry...')
  this.setState({isLoading: true, overlay2: true});

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
          systematicInquiryAttachments:"${attachments}",
          systematicInquiryHighlighted:${args.highlighted}
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitSysInquiry)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitSysInquiry,
        activityA: `deleteVisitSysInquiry?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitSysInquiry;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/systematicInquiry/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/systematicInquiry/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `systematicInquiry attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');

    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitSysInquiryHighlighted = (args) => {
  console.log('...toggling visit systematicInquiry highlight...');
  this.context.setUserAlert('...toggling visit systematicInquiry highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  let title = args.title;
  let description = args.description.replace(/\n/g, ' ');
  let highlighted = args.highlighted;
  let attachments = args.attachments.join();

  requestBody = {
    query: `
      mutation {toggleVisitSysInquiryHighlighted(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          systematicInquiryTitle:"${title}",
          systematicInquiryDescription:"${description}",
          systematicInquiryHighlighted:${highlighted},
          systematicInquiryAttachments:"${attachments}"
        })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitSysInquiryHighlighted);
      let responseAlert = `...systematicInquiry highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitSysInquiryHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitSysInquiryHighlighted,
        activityA: `toggleVisitSysInquiryHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitSysInquiryHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateSystematicInquiryForm = (event) => {
  event.preventDefault();
  console.log('updating systematicInquiry...');
  this.context.setUserAlert('...updating systematicInquiry...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldSystematicInquiry = {
    title: this.state.updating.previous.title,
    description: this.state.updating.previous.description,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newSystematicInquiry = {
    title: this.props.visit.patient.name+'_systematicInquiry_'+moment().format('YYYY-MM-DD, h:mm:ss a'),
    description: event.target.description.value,
    attachments: oldSystematicInquiry.attachments,
    highlighted: oldSystematicInquiry.highlighted,
  }


  if (
      newSystematicInquiry.title.trim().length === 0 ||
      newSystematicInquiry.description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitSysInquiry(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          systematicInquiryTitle:"${oldSystematicInquiry.title}",
          systematicInquiryDescription:"${oldSystematicInquiry.description}",
          systematicInquiryAttachments:"${oldSystematicInquiry.attachments}",
          systematicInquiryHighlighted: ${oldSystematicInquiry.highlighted}
        }
        visitInput2:{
          systematicInquiryTitle:"${newSystematicInquiry.title}",
          systematicInquiryDescription:"${newSystematicInquiry.description}",
          systematicInquiryAttachments:"${newSystematicInquiry.attachments}",
          systematicInquiryHighlighted: ${newSystematicInquiry.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientSysInquiry);
      let responseAlert = '...systematicInquiry update success!...';
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
      this.props.updateVisit(resData.data.updateVisitSysInquiry)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitSysInquiry,
        activityA: `updateVisitSysInquiry?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitSysInquiry;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddVitalsForm = (event) => {
  event.preventDefault();
  console.log('...adding Vitals...');
  this.context.setUserAlert('...adding Vitals...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const pr = event.target.pr.value;
  const bp1 = event.target.bp1.value;
  const bp2 = event.target.bp2.value;
  const rr = event.target.rr.value;
  const temp = event.target.temp.value;
  const sp02 = event.target.sp02.value;
  const heightUnit = event.target.heightUnit.value;
  const heightValue = event.target.heightValue.value;
  const weightUnit = event.target.weightUnit.value;
  const weightValue = event.target.weightValue.value;
  let bmi = 0;
  const urineType = event.target.urineType.value;
  const urineValue = event.target.urineValue.value;
  if (heightUnit === 'M' ) {
    bmi = weightValue/(heightValue**2)
  }
  if (heightUnit === 'In' ) {
    bmi = 703 * (weightValue/(heightValue**2))
  }
  bmi = bmi.toFixed(2)
  console.log('bmi',bmi);

  if (
      pr.trim().length === 0 ||
      bp1.trim().length === 0 ||
      bp2.trim().length === 0 ||
      rr.trim().length === 0 ||
      temp.trim().length === 0 ||
      sp02.trim().length === 0 ||
      heightUnit.trim().length === 0 ||
      heightValue.trim().length === 0 ||
      weightUnit.trim().length === 0 ||
      weightValue.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

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
          vitalsSp02:${sp02},
          vitalsHeightUnit:"${heightUnit}",
          vitalsHeightValue:${heightValue},
          vitalsWeightUnit:"${weightUnit}",
          vitalsWeightValue:${weightValue},
          vitalsBmi:${bmi},
          vitalsUrineType:"${urineType}",
          vitalsUrineValue:"${urineValue}"
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitVitals)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteVitals = (args) => {

  // this.setState({
  //   overlay2: true
  // })
  // this.overlay2 = true;

  console.log('...deleting Vitals...');
  this.context.setUserAlert('...deleting Vitals...')
  this.setState({
    isLoading: true,
    overlay2: true
  });

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const pr = args.pr;
  const bp1 = args.bp1;
  const bp2 = args.bp2;
  const rr = args.rr;
  const temp = args.temp;
  const sp02 = args.sp02;
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
        vitalsSp02:${sp02},
        vitalsHeightUnit:"${heightUnit}",
        vitalsHeightValue:${heightValue},
        vitalsWeightUnit:"${weightUnit}",
        vitalsWeightValue:${weightValue},
        vitalsBmi:${bmi},
        vitalsUrineType:"${urineType}",
        vitalsUrineValue:"${urineValue}",
        vitalsHighlighted:${args.highlighted}
      })
      {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitVitals)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitVitalsHighlighted = (args) => {
  console.log('...toggling visit vitals highlight...');
  this.context.setUserAlert('...toggling visit vitals highlight...')
  this.setState({isLoading: true,overlay2:true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const pr = args.pr;
  const bp1 = args.bp1;
  const bp2 = args.bp2;
  const rr = args.rr;
  const temp = args.temp;
  const sp02 = args.sp02;
  const heightUnit = args.heightUnit;
  const heightValue = args.heightValue;
  const weightUnit = args.weightUnit;
  const weightValue = args.weightValue;
  const bmi = args.bmi;
  const urineType = args.urine.type;
  const urineValue = args.urine.value;
  let highlighted = args.highlighted;


  requestBody = {
    query: `
      mutation {
        toggleVisitVitalsHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            vitalsPr: ${pr},
            vitalsBp1: ${bp1},
            vitalsBp2: ${bp2},
            vitalsRr: ${rr},
            vitalsTemp: ${temp},
            vitalsSp02: ${sp02},
            vitalsHeightUnit: "${heightUnit}",
            vitalsHeightValue: ${heightValue},
            vitalsWeightUnit: "${weightUnit}",
            vitalsWeightValue: ${weightValue},
            vitalsBmi: ${bmi},
            vitalsUrineType: "${urineType}",
            vitalsUrineValue: "${urineValue}",
            vitalsHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitVitalsHighlighted);
      let responseAlert = `...vitals highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitVitalsHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitVitalsHighlighted,
        activityA: `toggleVisitVitalsHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitVitalsHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateVitalsForm = (event) => {
  event.preventDefault();
  console.log('updating vitals...');
  this.context.setUserAlert('...updating vitals...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldVitals = {
    pr: this.state.updating.previous.pr,
    bp1: this.state.updating.previous.bp1,
    bp2: this.state.updating.previous.bp2,
    rr: this.state.updating.previous.rr,
    temp: this.state.updating.previous.temp,
    sp02: this.state.updating.previous.sp02,
    heightUnit: this.state.updating.previous.heightUnit,
    heightValue: this.state.updating.previous.heightValue,
    weightUnit: this.state.updating.previous.weightUnit,
    weightValue: this.state.updating.previous.weightValue,
    bmi: this.state.updating.previous.bmi,
    urineType: this.state.updating.previous.urine.type,
    urineValue: this.state.updating.previous.urine.value,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newVitals = {
    pr: event.target.pr.value,
    bp1: event.target.bp1.value,
    bp2: event.target.bp2.value,
    rr: event.target.rr.value,
    temp: event.target.temp.value,
    sp02: event.target.sp02.value,
    heightUnit: event.target.heightUnit.value,
    heightValue: event.target.heightValue.value,
    weightUnit: event.target.weightUnit.value,
    weightValue: event.target.weightValue.value,
    bmi: 0,
    urineType: event.target.urineType.value,
    urineValue: event.target.urineValue.value,
    highlighted: oldVitals.highlighted,
  }


  if (newVitals.heightUnit === 'M' ) {
    newVitals.bmi = newVitals.weightValue/(newVitals.heightValue**2)
  }
  if (newVitals.heightUnit === 'In' ) {
    newVitals.bmi = 703 * (newVitals.weightValue/(newVitals.heightValue**2))
  }
  newVitals.bmi = newVitals.bmi.toFixed(2)
  console.log('bmi',oldVitals ,newVitals ,newVitals.bmi);

  if (
      newVitals.pr.trim().length === 0 ||
      newVitals.bp1.trim().length === 0 ||
      newVitals.bp2.trim().length === 0 ||
      newVitals.rr.trim().length === 0 ||
      newVitals.temp.trim().length === 0 ||
      newVitals.sp02.trim().length === 0 ||
      newVitals.heightUnit.trim().length === 0 ||
      newVitals.heightValue.trim().length === 0 ||
      newVitals.weightUnit.trim().length === 0 ||
      newVitals.weightValue.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitVitals(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          vitalsPr:${oldVitals.pr},
          vitalsBp1:${oldVitals.bp1},
          vitalsBp2:${oldVitals.bp2},
          vitalsRr:${oldVitals.rr},
          vitalsTemp:${oldVitals.temp},
          vitalsSp02:${oldVitals.sp02},
          vitalsHeightUnit:"${oldVitals.heightUnit}",
          vitalsHeightValue:${oldVitals.heightValue},
          vitalsWeightUnit:"${oldVitals.weightUnit}",
          vitalsWeightValue:${oldVitals.weightValue},
          vitalsBmi:${oldVitals.bmi},
          vitalsUrineType:"${oldVitals.urineType}",
          vitalsUrineValue:"${oldVitals.urineValue}",
          vitalsHighlighted: ${oldVitals.highlighted}
        }
        visitInput2:{
          vitalsPr:${newVitals.pr},
          vitalsBp1:${newVitals.bp1},
          vitalsBp2:${newVitals.bp2},
          vitalsRr:${newVitals.rr},
          vitalsTemp:${newVitals.temp},
          vitalsSp02:${newVitals.sp02},
          vitalsHeightUnit:"${newVitals.heightUnit}",
          vitalsHeightValue:${newVitals.heightValue},
          vitalsWeightUnit:"${newVitals.weightUnit}",
          vitalsWeightValue:${newVitals.weightValue},
          vitalsBmi:${newVitals.bmi},
          vitalsUrineType:"${newVitals.urineType}",
          vitalsUrineValue:"${newVitals.urineValue}",
          vitalsHighlighted: ${newVitals.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientVitals);
      let responseAlert = '...vitals update success!...';
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
      this.props.updateVisit(resData.data.updateVisitVitals)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitVitals,
        activityA: `updateVisitVitals?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitVitals;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddExaminationForm = (event) => {
  event.preventDefault();
  console.log('...adding Examination...');
  this.context.setUserAlert('...adding Examination...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const general = event.target.general.value;
  const area = event.target.area.value;
  const inspection = event.target.inspection.value;
  const palpation = event.target.palpation.value;
  const percussion = event.target.percussion.value;
  const auscultation = event.target.auscultation.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  const followUp = event.target.followUp.checked;
  // const attachment = event.target.attachment.value;

  if (
      general.trim().length === 0 ||
      area.trim().length === 0 ||
      inspection.trim().length === 0 ||
      palpation.trim().length === 0 ||
      percussion.trim().length === 0 ||
      auscultation.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/examination/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'examination attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'examination attachment',
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
              target: 'examination attachment',
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
              target: 'examination attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitExamination(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          examinationGeneral:"${general}",
          examinationArea:"${area}",
          examinationInspection: "${inspection}",
          examinationPalpation: "${palpation}",
          examinationPercussion: "${percussion}",
          examinationAuscultation: "${auscultation}",
          examinationDescription:"${description}",
          examinationFollowUp:${followUp},
          examinationAttachment:"${file2Path}"
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitExamination)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteExamination = (args) => {

  console.log('...deleting Examination...');
  this.context.setUserAlert('...deleting Examination...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const general = args.general;
  const area = args.area;
  const inspection = args.inspection;
  const palpation = args.palpation;
  const percussion = args.percussion;
  const auscultation = args.auscultation;
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
          examinationInspection: "${inspection}",
          examinationPalpation: "${palpation}",
          examinationPercussion: "${percussion}",
          examinationAuscultation: "${auscultation}",
          examinationDescription:"${description}",
          examinationFollowUp:${followUp},
          examinationAttachments:"${attachments}",
          examinationHighlighted:${args.highlighted}
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitExamination)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitExamination,
        activityA: `deleteVisitExamination?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitExamination;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/examination/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/examination/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `examination attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitExaminationHighlighted = (args) => {
  console.log('...toggling visit examination highlight...');
  this.context.setUserAlert('...toggling visit examination highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const general = args.general;
  const area = args.area;
  const inspection = args.inspection;
  const palpation = args.palpation;
  const percussion = args.percussion;
  const auscultation = args.auscultation;
  const description = args.description.replace(/\n/g, ' ');
  const followUp = args.followUp;
  const attachments = args.attachments.join();
  let highlighted = args.highlighted;


  requestBody = {
    query: `
      mutation {
        toggleVisitExaminationHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            examinationGeneral:"${general}",
            examinationArea:"${area}",
            examinationInspection: "${inspection}",
            examinationPalpation: "${palpation}",
            examinationPercussion: "${percussion}",
            examinationAuscultation: "${auscultation}",
            examinationDescription:"${description}",
            examinationFollowUp:${followUp},
            examinationAttachments:"${attachments}"
            examinationHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitExaminationHighlighted);
      let responseAlert = `...examination highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitExaminationHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitExaminationHighlighted,
        activityA: `toggleVisitExaminationHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitExaminationHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateExaminationForm = (event) => {
  event.preventDefault();
  console.log('updating examination...');
  this.context.setUserAlert('...updating examination...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldExamination = {
    general: this.state.updating.previous.general,
    area: this.state.updating.previous.area,
    inspection: this.state.updating.previous.inspection,
    palpation: this.state.updating.previous.palpation,
    percussion: this.state.updating.previous.percussion,
    auscultation: this.state.updating.previous.auscultation,
    description: this.state.updating.previous.description,
    followUp: this.state.updating.previous.followUp,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newExamination = {
    general: event.target.general.value,
    area: event.target.area.value,
    inspection: event.target.inspection.value,
    palpation: event.target.palpation.value,
    percussion: event.target.percussion.value,
    auscultation: event.target.auscultation.value,
    description: event.target.description.value,
    followUp: event.target.followUp.checked,
    attachments: oldExamination.attachments,
    highlighted: oldExamination.highlighted,
  }


if (
      newExamination.general.trim().length === 0 ||
      newExamination.area.trim().length === 0 ||
      newExamination.inspection.trim().length === 0 ||
      newExamination.palpation.trim().length === 0 ||
      newExamination.percussion.trim().length === 0 ||
      newExamination.auscultation.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitExamination(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          examinationGeneral:"${oldExamination.general}",
          examinationArea:"${oldExamination.area}",
          examinationInspection: "${oldExamination.inspection}",
          examinationPalpation: "${oldExamination.palpation}",
          examinationPercussion: "${oldExamination.percussion}",
          examinationAuscultation: "${oldExamination.auscultation}",
          examinationDescription:"${oldExamination.description}",
          examinationFollowUp:${oldExamination.followUp},
          examinationAttachments:"${oldExamination.attachments}",
          examinationHighlighted: ${oldExamination.highlighted}
        }
        visitInput2:{
          examinationGeneral:"${newExamination.general}",
          examinationArea:"${newExamination.area}",
          examinationInspection: "${newExamination.inspection}",
          examinationPalpation: "${newExamination.palpation}",
          examinationPercussion: "${newExamination.percussion}",
          examinationAuscultation: "${newExamination.auscultation}",
          examinationDescription:"${newExamination.description}",
          examinationFollowUp:${newExamination.followUp},
          examinationAttachments:"${newExamination.attachments}",
          examinationHighlighted: ${newExamination.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientExamination);
      let responseAlert = '...examination update success!...';
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
      this.props.updateVisit(resData.data.updateVisitExamination)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitExamination,
        activityA: `updateVisitExamination?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitExamination;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddInvestigationForm = (event) => {
  event.preventDefault();
  console.log('...adding Investigation...');
  this.context.setUserAlert('...adding Investigation...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = this.props.visit.patient.name+'_investigation_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  // const attachment = event.target.attachment.value;

  if (
      type.trim().length === 0 ||
      description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/investigation/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'investigation attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'investigation attachment',
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
              target: 'investigation attachment',
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
              target: 'investigation attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitInvestigation(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          investigationTitle:"${title}",
          investigationType:"${type}",
          investigationDescription:"${description}",
          investigationAttachment:"${file2Path}"
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitInvestigation)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteInvestigation = (args) => {

  console.log('...deleting Investigation...');
  this.context.setUserAlert('...deleting Investigation...')
  this.setState({isLoading: true, overlay2: true});

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
          investigationAttachments:"${attachments}",
          investigationHighlighted:${args.highlighted}
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitInvestigation)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitInvestigation,
        activityA: `deleteVisitInvestigation?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitInvestigation;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/investigation/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/investigation/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `investigation attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitInvestigationHighlighted = (args) => {
  console.log('...toggling visit investigation highlight...');
  this.context.setUserAlert('...toggling visit investigation highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const title = args.title;
  const type = args.type;
  const description = args.description.replace(/\n/g, ' ');
  const attachments = args.attachments.join();
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitInvestigationHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            investigationTitle:"${title}",
            investigationType:"${type}",
            investigationDescription:"${description}",
            investigationAttachments:"${attachments}"
            investigationHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitInvestigationHighlighted);
      let responseAlert = `...investigation highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitInvestigationHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitInvestigationHighlighted,
        activityA: `toggleVisitInvestigationHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitInvestigationHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateInvestigationForm = (event) => {
  event.preventDefault();
  console.log('updating investigation...');
  this.context.setUserAlert('...updating investigation...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldInvestigation = {
    title: this.state.updating.previous.title,
    type: this.state.updating.previous.type,
    description: this.state.updating.previous.description,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newInvestigation = {
    title: this.props.visit.patient.name+'_investigation_'+moment().format('YYYY-MM-DD, h:mm:ss a'),
    type: event.target.type.value,
    description: event.target.description.value,
    attachments: oldInvestigation.attachments,
    highlighted: oldInvestigation.highlighted,
  }


if (
      newInvestigation.title.trim().length === 0 ||
      newInvestigation.type.trim().length === 0 ||
      newInvestigation.description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitInvestigation(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          investigationTitle:"${oldInvestigation.title}",
          investigationType:"${oldInvestigation.type}",
          investigationDescription:"${oldInvestigation.description}",
          investigationAttachments:"${oldInvestigation.attachments}",
          investigationHighlighted: ${oldInvestigation.highlighted}
        }
        visitInput2:{
          investigationTitle:"${newInvestigation.title}",
          investigationType:"${newInvestigation.type}",
          investigationDescription:"${newInvestigation.description}",
          investigationAttachments:"${newInvestigation.attachments}",
          investigationHighlighted: ${newInvestigation.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientInvestigation);
      let responseAlert = '...investigation update success!...';
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
      this.props.updateVisit(resData.data.updateVisitInvestigation)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitInvestigation,
        activityA: `updateVisitInvestigation?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitInvestigation;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddDiagnosisForm = (event) => {
  event.preventDefault();
  console.log('...adding Diagnosis...');
  this.context.setUserAlert('...adding Diagnosis...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  // const title = this.props.visit.patient.name+'_diagnosis_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const type = '';
  // const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  // const attachment = event.target.attachment.value;

  if (
      title.trim().length === 0 ||
      description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/diagnosis/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'diagnosis attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'diagnosis attachment',
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
              target: 'diagnosis attachment',
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
              target: 'diagnosis attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody = {
    query: `
      mutation {addVisitDiagnosis(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          diagnosisTitle:"${title}",
          diagnosisType:"${type}",
          diagnosisDescription:"${description}",
          diagnosisAttachment:"${file2Path}"
        })
       {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitDiagnosis)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteDiagnosis = (args) => {

  console.log('...deleting Diagnosis...');
  this.context.setUserAlert('...deleting Diagnosis...')
  this.setState({isLoading: true, overlay2: true});

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
          diagnosisAttachments:"${attachments}",
          diagnosisHighlighted: ${args.highlighted}
        })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitDiagnosis)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitDiagnosis,
        activityA: `deleteVisitDiagnosis?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitDiagnosis;
      this.logUserActivity({activityId: activityId,token: token});

      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/diagnosis/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/diagnosis/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `diagnosis attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitDiagnosisHighlighted = (args) => {
  console.log('...toggling visit diagnosis highlight...');
  this.context.setUserAlert('...toggling visit diagnosis highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const title = args.title;
  const type = args.type;
  const description = args.description.replace(/\n/g, ' ');
  const attachments = args.attachments.join();
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitDiagnosisHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            diagnosisTitle:"${title}",
            diagnosisType:"${type}",
            diagnosisDescription:"${description}",
            diagnosisAttachments:"${attachments}"
            diagnosisHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitDiagnosisHighlighted);
      let responseAlert = `...diagnosis highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitDiagnosisHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitDiagnosisHighlighted,
        activityA: `toggleVisitDiagnosisHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitDiagnosisHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateDiagnosisForm = (event) => {
  event.preventDefault();
  console.log('updating diagnosis...');
  this.context.setUserAlert('...updating diagnosis...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldDiagnosis = {
    title: this.state.updating.previous.title,
    type: this.state.updating.previous.type,
    description: this.state.updating.previous.description,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newDiagnosis = {
    title: event.target.title.value,
    type: '',
    description: event.target.description.value,
    attachments: oldDiagnosis.attachments,
    highlighted: oldDiagnosis.highlighted,
  }


if (
      newDiagnosis.title.trim().length === 0 ||
      newDiagnosis.description.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitDiagnosis(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          diagnosisTitle:"${oldDiagnosis.title}",
          diagnosisType:"${oldDiagnosis.type}",
          diagnosisDescription:"${oldDiagnosis.description}",
          diagnosisAttachments:"${oldDiagnosis.attachments}",
          diagnosisHighlighted: ${oldDiagnosis.highlighted}
        }
        visitInput2:{
          diagnosisTitle:"${newDiagnosis.title}",
          diagnosisType:"${newDiagnosis.type}",
          diagnosisDescription:"${newDiagnosis.description}",
          diagnosisAttachments:"${newDiagnosis.attachments}",
          diagnosisHighlighted: ${newDiagnosis.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientDiagnosis);
      let responseAlert = '...diagnosis update success!...';
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
      this.props.updateVisit(resData.data.updateVisitDiagnosis)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitDiagnosis,
        activityA: `updateVisitDiagnosis?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitDiagnosis;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddTreatmentForm = (event) => {
  event.preventDefault();
  console.log('...adding Treatment...');
  this.context.setUserAlert('...adding Treatment...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = event.target.title.value;
  // const title = this.props.visit.patient.name+'_treatment_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const type = '';
  // const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  const dose = event.target.dose.value;
  const frequency = event.target.frequency.value;
  // const attachment = event.target.attachment.value;

  if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      dose.trim().length === 0 ||
      frequency.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/treatment/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'treatment attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'treatment attachment',
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
              target: 'treatment attachment',
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
              target: 'treatment attachment',
              status: 'failed'
            }
          });
        })
      }


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
            treatmentAttachment:"${file2Path}"
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitTreatment)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteTreatment = (args) => {

  console.log('...deleting Treatment...');
  this.context.setUserAlert('...deleting Treatment...')
  this.setState({isLoading: true, overlay2: true});

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
            treatmentAttachments:"${attachments}",
            treatmentHighlighted: ${args.highlighted}
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitTreatment)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitTreatment,
        activityA: `deleteVisitTreatment?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitTreatment;
      this.logUserActivity({activityId: activityId,token: token});


      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/treatment/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/treatment/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `treatment attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitTreatmentHighlighted = (args) => {
  console.log('...toggling visit treatment highlight...');
  this.context.setUserAlert('...toggling visit treatment highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const title = args.title;
  const type = args.type;
  const description = args.description.replace(/\n/g, ' ');
  const dose = args.dose;
  const frequency = args.frequency;
  const attachments = args.attachments.join();
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitTreatmentHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            treatmentType:"${type}",
            treatmentTitle:"${title}",
            treatmentDescription:"${description}",
            treatmentDose:"${dose}",
            treatmentFrequency:"${frequency}",
            treatmentAttachments:"${attachments}"
            treatmentHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitTreatmentHighlighted);
      let responseAlert = `...treatment highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitTreatmentHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitTreatmentHighlighted,
        activityA: `toggleVisitTreatmentHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitTreatmentHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateTreatmentForm = (event) => {
  event.preventDefault();
  console.log('updating treatment...');
  this.context.setUserAlert('...updating treatment...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldTreatment = {
    title: this.state.updating.previous.title,
    type: this.state.updating.previous.type,
    description: this.state.updating.previous.description,
    dose: this.state.updating.previous.dose,
    frequency: this.state.updating.previous.frequency,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newTreatment = {
    title: event.target.title.value,
    type: '',
    description: event.target.description.value,
    dose: event.target.dose.value,
    frequency: event.target.frequency.value,
    attachments: oldTreatment.attachments,
    highlighted: oldTreatment.highlighted,
  }


if (
      newTreatment.title.trim().length === 0 ||
      newTreatment.description.trim().length === 0 ||
      newTreatment.dose.trim().length === 0 ||
      newTreatment.frequency.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitTreatment(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          treatmentTitle:"${oldTreatment.title}",
          treatmentType:"${oldTreatment.type}",
          treatmentDescription:"${oldTreatment.description}",
          treatmentDose:"${oldTreatment.dose}",
          treatmentFrequency:"${oldTreatment.frequency}",
          treatmentAttachments:"${oldTreatment.attachments}",
          treatmentHighlighted: ${oldTreatment.highlighted}
        }
        visitInput2:{
          treatmentTitle:"${newTreatment.title}",
          treatmentType:"${newTreatment.type}",
          treatmentDescription:"${newTreatment.description}",
          treatmentDose:"${newTreatment.dose}",
          treatmentFrequency:"${newTreatment.frequecy}",
          treatmentAttachments:"${newTreatment.attachments}",
          treatmentHighlighted: ${newTreatment.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientTreatment);
      let responseAlert = '...treatment update success!...';
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
      this.props.updateVisit(resData.data.updateVisitTreatment)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitTreatment,
        activityA: `updateVisitTreatment?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitTreatment;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddBillingForm = (event) => {
  event.preventDefault();
  console.log('...adding Billing...',event.target.amount.value.trim().length);
  this.context.setUserAlert('...adding Billing...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const title = this.props.visit.patient.name+'_billing_'+moment().format('YYYY-MM-DD, h:mm:ss a');
  const type = event.target.type.value;
  const description = event.target.description.value.replace(/\n/g, ' ');
  const amount = event.target.amount.value;
  const paid = event.target.paid.checked;
  const notes = event.target.notes.value.replace(/\n/g, ' ');
  // const attachment = event.target.attachment.value;


  if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      parseFloat(amount) <= 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    file2Path = '';
    // this.context.setUserAlert("...no file!? Please add a file...")
    //     this.setState({isLoading: false})
    //     return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/billing/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

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
    console.log('...s3 uploading attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: 'billing attachment'
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: 'billing attachment',
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
              target: 'billing attachment',
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
              target: 'billing attachment',
              status: 'failed'
            }
          });
        })
      }


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
            billingAttachment:"${file2Path}",
            billingNotes:"${notes}"
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitBilling)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
updateBillingPaid = (args) => {
  console.log('...updating billing paid...');
  this.context.setUserAlert('...updating billing paid...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
    mutation {updateVisitBillingPaid(
      activityId:"${activityId}",
      visitId:"${visitId}",
      visitInput:{
        billingTitle:"${args.title}",
        billingType:"${args.type}",
        billingDescription:"${args.description}",
        billingAmount:${args.amount},
        billingPaid:${args.paid},
        billingNotes:"${args.notes}"
      })
       {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updateVisitBillingPaid);
      let responseAlert = '...billing update success!...';
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
      this.props.updateVisit(resData.data.updateVisitBillingPaid)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitBillingPaid,
        activityA: `updateVisitBillingPaid?activityId:${activityId},visitId:${visitId}`,
      });
      this.context.selectedVisit = resData.data.updateVisitBillingPaid;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
deleteBilling = (args) => {

  console.log('...deleting Billing...',args);
  this.context.setUserAlert('...deleting Billing...')
  this.setState({isLoading: true, overlay2: true});

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
            billingNotes:"${notes}",
            billingHighlighted:${args.highlighted}
          })
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitBilling)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitBilling,
        activityA: `deleteVisitBilling?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitBilling;
      this.logUserActivity({activityId: activityId,token: token});

      const preAttachments = args.attachments;

      const filePath = 'visit/'+visitId+'/billing/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/billing/attachments/';


      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachments..')
      console.log('...s3 deleting attachments..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `billing attachments`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: 'file',
          status: 'inProgress'
        }
      });

      console.log('start');
      for (let index = 0; index < preAttachments.length; index++) {
        let preAttachment = preAttachments[index];
        console.log('multifile deletion...',index);

        let filename = preAttachment;
        let filename2 = filename.replace(filePath2,'');

        ReactS3Client
        .deleteFile(filename2, config)
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


      }
      console.log('end');


    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitBillingHighlighted = (args) => {
  console.log('...toggling visit billing highlight...');
  this.context.setUserAlert('...toggling visit billing highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const title = args.title;
  const type = args.type;
  const description = args.description.replace(/\n/g, ' ');
  const amount = args.amount;
  const paid = args.paid;
  const notes = args.notes;
  const attachments = args.attachments.join();
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitBillingHighlighted(
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
            billingHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitBillingHighlighted);
      let responseAlert = `...billing highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitBillingHighlighted)
      this.setState({
        isLoading: false,
        overlay2: true,
        selectedVisit: resData.data.toggleVisitBillingHighlighted,
        activityA: `toggleVisitBillingHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitBillingHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateBillingForm = (event) => {
  event.preventDefault();
  console.log('updating billing...');
  this.context.setUserAlert('...updating billing...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const oldBilling = {
    title: this.state.updating.previous.title,
    type: this.state.updating.previous.type,
    description: this.state.updating.previous.description,
    amount: this.state.updating.previous.amount,
    paid: this.state.updating.previous.paid,
    notes: this.state.updating.previous.notes,
    attachments: this.state.updating.previous.attachments,
    highlighted: this.state.updating.previous.highlighted,
  }
  const newBilling = {
    title: this.props.visit.patient.name+'_billing_'+moment().format('YYYY-MM-DD, h:mm:ss a'),
    type: event.target.type.value,
    description: event.target.description.value,
    amount: event.target.amount.value,
    paid: event.target.paid.checked,
    notes: event.target.notes.value,
    attachments: oldBilling.attachments,
    highlighted: oldBilling.highlighted,
  }


if (
    newBilling.title.trim().length === 0 ||
    newBilling.description.trim().length === 0 ||
    parseFloat(newBilling.amount) <= 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }


  let requestBody = {
    query: `
      mutation {updateVisitBilling(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          billingTitle:"${oldBilling.title}",
          billingType:"${oldBilling.type}",
          billingDescription:"${oldBilling.description}",
          billingAmount:${oldBilling.amount},
          billingPaid:${oldBilling.paid},
          billingNotes:"${oldBilling.notes}",
          billingAttachments:"${oldBilling.attachments}",
          billingHighlighted: ${oldBilling.highlighted}
        }
        visitInput2:{
          billingTitle:"${newBilling.title}",
          billingType:"${newBilling.type}",
          billingDescription:"${newBilling.description}",
          billingAmount:${newBilling.amount},
          billingPaid:${newBilling.paid},
          billingNotes:"${newBilling.notes}",
          billingAttachments:"${newBilling.attachments}",
          billingHighlighted: ${newBilling.highlighted}
        })
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientBilling);
      let responseAlert = '...billing update success!...';
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
      this.props.updateVisit(resData.data.updateVisitBilling)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitBilling,
        activityA: `updateVisitBilling?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitBilling;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddImageForm = (event) => {
  event.preventDefault();
  console.log('...adding Image...');
  this.context.setUserAlert('...adding Image...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let imageName;
  let imageType;
  let imagePath;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false, overlay2: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/images';
    console.log('...file present...');
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
        mutation {addVisitImage(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            imageName:"${imageName}",
            imageType:"${imageType}",
            imagePath:"${imagePath}"
          })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitImage)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteImage = (args) => {

  console.log('...deleting Image...',args);
  this.context.setUserAlert('...deleting Image...')
  this.setState({isLoading: true, overlay2: true});

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
        imagePath:"${path}",
        imageHighlighted:${args.highlighted}
      })
     {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitImage)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitImage,
        activityA: `deleteVisitImage?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitImage;
      this.logUserActivity({activityId: activityId,token: token});


      const filePath = 'visit/'+visitId+'/images';
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
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitImageHighlighted = (args) => {
  console.log('...toggling visit image highlight...');
  this.context.setUserAlert('...toggling visit image highlight...')
  this.setState({isLoading: true, overlay2: false});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const name = args.name;
  const type = args.type;
  const path = args.path;
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitImageHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            imageName:"${name}",
            imageType:"${type}",
            imagePath:"${path}"
            imageHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitImageHighlighted);
      let responseAlert = `...image highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitImageHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitImageHighlighted,
        activityA: `toggleVisitImageHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitImageHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddFileForm = (event) => {
  event.preventDefault();
  console.log('...adding File...');
  this.context.setUserAlert('...adding File...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let file2Name;
  let file2Type;
  let file2Path;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false, overlay2: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/files';
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
        mutation {addVisitFile(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            fileName:"${file2Name}",
            fileType:"${file2Type}",
            filePath:"${file2Path}"
          })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitFile)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteFile = (args) => {

  console.log('...deleting File...',args);
  this.context.setUserAlert('...deleting File...')
  this.setState({isLoading: true, overlay2: true});

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
        filePath:"${path}",
        fileHighlighted:${args.highlighted}
      })
     {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitFile)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.deleteVisitFile,
        activityA: `deleteVisitFile?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.deleteVisitFile;
      this.logUserActivity({activityId: activityId,token: token});

      const filePath = 'visit/'+visitId+'/files';
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
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitFileHighlighted = (args) => {
  console.log('...toggling visit file highlight...');
  this.context.setUserAlert('...toggling visit file highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  const name = args.name;
  const type = args.type;
  const path = args.path;
  let highlighted = args.highlighted;

  requestBody = {
    query: `
      mutation {
        toggleVisitFileHighlighted(
          activityId:"${activityId}",
          visitId:"${visitId}",
          visitInput:{
            fileName:"${name}",
            fileType:"${type}",
            filePath:"${path}"
            fileHighlighted: ${highlighted},
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitFileHighlighted);
      let responseAlert = `...file highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitFileHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitFileHighlighted,
        activityA: `toggleVisitFileHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitFileHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddVigilanceForm = (event) => {
  event.preventDefault();
  console.log('...adding Vigilance...');
  this.context.setUserAlert('...adding Vigilance...')
  this.setState({isLoading: true, overlay2: true});

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
     {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitVigilance)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteVigilance = (args) => {

  console.log('...deleting Vigilance...');
  this.context.setUserAlert('...deleting Vigilance...')
  this.setState({isLoading: true, overlay2: true});

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
            vigilanceVaccinesOtherComment:"${args.vaccines.other.comment}",
            vigilanceHighlighted:${args.highlighted}
          })
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitVigilance)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
    });
}
toggleVisitVigilanceHighlighted = (args) => {
  console.log('...toggling visit vigilance highlight...');
  this.context.setUserAlert('...toggling visit vigilance highlight...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let requestBody;

  requestBody = {
    query: `
      mutation {
        toggleVisitVigilanceHighlighted(
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
            vigilanceVaccinesOtherComment:"${args.vaccines.other.comment}",
            vigilanceHighlighted: ${args.highlighted}
          })
          {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};


   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.toggleVisitVigilanceHighlighted);
      let responseAlert = `...vigilance highlight toggled!...`;
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
      this.props.updateVisit(resData.data.toggleVisitVigilanceHighlighted)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.toggleVisitVigilanceHighlighted,
        activityA: `toggleVisitVigilanceHighlighted?activityId:${activityId},visitId:${visitId}`,
        adding: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.toggleVisitVigilanceHighlighted;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
submitUpdateVigilanceForm = (event) => {
  event.preventDefault();
  console.log('updating vigilance...');
  this.context.setUserAlert('...updating vigilance...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;


  const oldVigilance = {
    chronicIllness: {
      diabetes: {
        medication: this.state.updating.previous.chronicIllness.diabetes.medication,
        testing: this.state.updating.previous.chronicIllness.diabetes.testing,
        comment: this.state.updating.previous.chronicIllness.diabetes.comment
      },
      hbp: {
        medication: this.state.updating.previous.chronicIllness.hbp.medication,
        testing: this.state.updating.previous.chronicIllness.hbp.testing,
        comment: this.state.updating.previous.chronicIllness.hbp.comment
      },
      dyslipidemia: {
        medication: this.state.updating.previous.chronicIllness.dyslipidemia.medication,
        testing: this.state.updating.previous.chronicIllness.dyslipidemia.testing,
        comment: this.state.updating.previous.chronicIllness.dyslipidemia.comment
      },
      cad: {
        medication: this.state.updating.previous.chronicIllness.cad.medication,
        testing: this.state.updating.previous.chronicIllness.cad.testing,
        comment: this.state.updating.previous.chronicIllness.cad.comment
      }
    },
    lifestyle: {
      weight: {
        medication: this.state.updating.previous.lifestyle.weight.medication,
        testing: this.state.updating.previous.lifestyle.weight.testing,
        comment: this.state.updating.previous.lifestyle.weight.comment
      },
      diet: {
        medication: this.state.updating.previous.lifestyle.diet.medication,
        testing: this.state.updating.previous.lifestyle.diet.testing,
        comment: this.state.updating.previous.lifestyle.diet.comment
      },
      smoking: {
        medication: this.state.updating.previous.lifestyle.smoking.medication,
        testing: this.state.updating.previous.lifestyle.smoking.testing,
        comment: this.state.updating.previous.lifestyle.smoking.comment
      },
      substanceAbuse: {
        medication: this.state.updating.previous.lifestyle.substanceAbuse.medication,
        testing: this.state.updating.previous.lifestyle.substanceAbuse.testing,
        comment: this.state.updating.previous.lifestyle.substanceAbuse.comment
      },
      exercise: {
        medication: this.state.updating.previous.lifestyle.exercise.medication,
        testing: this.state.updating.previous.lifestyle.exercise.testing,
        comment: this.state.updating.previous.lifestyle.exercise.comment
      },
      allergies: {
        medication: this.state.updating.previous.lifestyle.allergies.medication,
        testing: this.state.updating.previous.lifestyle.allergies.testing,
        comment: this.state.updating.previous.lifestyle.allergies.comment
      },
      asthma: {
        medication: this.state.updating.previous.lifestyle.asthma.medication,
        testing: this.state.updating.previous.lifestyle.asthma.testing,
        comment: this.state.updating.previous.lifestyle.asthma.comment
      }
    },
    screening: {
      breast: {
        medication: this.state.updating.previous.screening.breast.medication,
        testing: this.state.updating.previous.screening.breast.testing,
        comment: this.state.updating.previous.screening.breast.comment
      },
      prostate: {
        medication: this.state.updating.previous.screening.prostate.medication,
        testing: this.state.updating.previous.screening.prostate.testing,
        comment: this.state.updating.previous.screening.prostate.comment
      },
      cervix: {
        medication: this.state.updating.previous.screening.cervix.medication,
        testing: this.state.updating.previous.screening.cervix.testing,
        comment: this.state.updating.previous.screening.cervix.comment
      },
      colon: {
        medication: this.state.updating.previous.screening.colon.medication,
        testing: this.state.updating.previous.screening.colon.testing,
        comment: this.state.updating.previous.screening.colon.comment
      },
      dental: {
        medication: this.state.updating.previous.screening.dental.medication,
        testing: this.state.updating.previous.screening.dental.testing,
        comment: this.state.updating.previous.screening.dental.comment
      }
    },
    vaccines: {
      influenza: {
        medication: this.state.updating.previous.vaccines.influenza.medication,
        testing: this.state.updating.previous.vaccines.influenza.testing,
        comment: this.state.updating.previous.vaccines.influenza.comment
      },
      varicella: {
        medication: this.state.updating.previous.vaccines.varicella.medication,
        testing: this.state.updating.previous.vaccines.varicella.testing,
        comment: this.state.updating.previous.vaccines.varicella.comment
      },
      hpv: {
        medication: this.state.updating.previous.vaccines.hpv.medication,
        testing: this.state.updating.previous.vaccines.hpv.testing,
        comment: this.state.updating.previous.vaccines.hpv.comment
      },
      mmr: {
        medication: this.state.updating.previous.vaccines.mmr.medication,
        testing: this.state.updating.previous.vaccines.mmr.testing,
        comment: this.state.updating.previous.vaccines.mmr.comment
      },
      tetanus: {
        medication: this.state.updating.previous.vaccines.tetanus.medication,
        testing: this.state.updating.previous.vaccines.tetanus.testing,
        comment: this.state.updating.previous.vaccines.tetanus.comment
      },
      pneumovax: {
        medication: this.state.updating.previous.vaccines.pneumovax.medication,
        testing: this.state.updating.previous.vaccines.pneumovax.testing,
        comment: this.state.updating.previous.vaccines.pneumovax.comment
      },
      other: {
        name: this.state.updating.previous.vaccines.other.name,
        medication: this.state.updating.previous.vaccines.other.medication,
        testing: this.state.updating.previous.vaccines.other.testing,
        comment: this.state.updating.previous.vaccines.other.comment
      }
    },
    highlighted: this.state.updating.previous.highlighted,
  }
  const newVigilance = {
    chronicIllness: {
      diabetes: {
        medication: event.target.vigilanceChronicIllnessDiabetesMedication.checked,
        testing: event.target.vigilanceChronicIllnessDiabetesTesting.checked,
        comment: event.target.vigilanceChronicIllnessDiabetesComment.value
      },
      hbp: {
        medication: event.target.vigilanceChronicIllnessHbpMedication.checked,
        testing: event.target.vigilanceChronicIllnessHbpTesting.checked,
        comment: event.target.vigilanceChronicIllnessHbpComment.value
      },
      dyslipidemia: {
        medication: event.target.vigilanceChronicIllnessDyslipidemiaMedication.checked,
        testing: event.target.vigilanceChronicIllnessDyslipidemiaTesting.checked,
        comment: event.target.vigilanceChronicIllnessDyslipidemiaComment.value
      },
      cad: {
        medication: event.target.vigilanceChronicIllnessCadMedication.checked,
        testing: event.target.vigilanceChronicIllnessCadTesting.checked,
        comment: event.target.vigilanceChronicIllnessCadComment.value
      }
    },
    lifestyle: {
      weight: {
        medication: event.target.vigilanceLifestyleWeightMedication.checked,
        testing: event.target.vigilanceLifestyleWeightTesting.checked,
        comment: event.target.vigilanceLifestyleWeightComment.value
      },
      diet: {
        medication: event.target.vigilanceLifestyleDietMedication.checked,
        testing: event.target.vigilanceLifestyleDietTesting.checked,
        comment: event.target.vigilanceLifestyleDietComment.value
      },
      smoking: {
        medication: event.target.vigilanceLifestyleSmokingMedication.checked,
        testing: event.target.vigilanceLifestyleSmokingTesting.checked,
        comment: event.target.vigilanceLifestyleSmokingComment.value
      },
      substanceAbuse: {
        medication: event.target.vigilanceLifestyleSubstanceAbuseMedication.checked,
        testing: event.target.vigilanceLifestyleSubstanceAbuseTesting.checked,
        comment: event.target.vigilanceLifestyleSubstanceAbuseComment.value
      },
      exercise: {
        medication: event.target.vigilanceLifestyleExerciseMedication.checked,
        testing: event.target.vigilanceLifestyleExerciseTesting.checked,
        comment: event.target.vigilanceLifestyleExerciseComment.value
      },
      allergies: {
        medication: event.target.vigilanceLifestyleAllergiesMedication.checked,
        testing: event.target.vigilanceLifestyleAllergiesTesting.checked,
        comment: event.target.vigilanceLifestyleAllergiesComment.value
      },
      asthma: {
        medication: event.target.vigilanceLifestyleAsthmaMedication.checked,
        testing: event.target.vigilanceLifestyleAsthmaTesting.checked,
        comment: event.target.vigilanceLifestyleAsthmaComment.value
      }
    },
    screening: {
      breast: {
        medication: event.target.vigilanceScreeningBreastMedication.checked,
        testing: event.target.vigilanceScreeningBreastTesting.checked,
        comment: event.target.vigilanceScreeningBreastComment.value
      },
      prostate: {
        medication: event.target.vigilanceScreeningProstateMedication.checked,
        testing: event.target.vigilanceScreeningProstateTesting.checked,
        comment: event.target.vigilanceScreeningProstateComment.value
      },
      cervix: {
        medication: event.target.vigilanceScreeningCervixMedication.checked,
        testing: event.target.vigilanceScreeningCervixTesting.checked,
        comment: event.target.vigilanceScreeningCervixComment.value
      },
      colon: {
        medication: event.target.vigilanceScreeningColonMedication.checked,
        testing: event.target.vigilanceScreeningColonTesting.checked,
        comment: event.target.vigilanceScreeningColonComment.value
      },
      dental: {
        medication: event.target.vigilanceScreeningDentalMedication.checked,
        testing: event.target.vigilanceScreeningDentalTesting.checked,
        comment: event.target.vigilanceScreeningDentalComment.value
      }
    },
    vaccines: {
      influenza: {
        medication: event.target.vigilanceVaccinesInfluenzaMedication.checked,
        testing: event.target.vigilanceVaccinesInfluenzaTesting.checked,
        comment: event.target.vigilanceVaccinesInfluenzaComment.value
      },
      varicella: {
        medication: event.target.vigilanceVaccinesVaricellaMedication.checked,
        testing: event.target.vigilanceVaccinesVaricellaTesting.checked,
        comment: event.target.vigilanceVaccinesVaricellaComment.value
      },
      hpv: {
        medication: event.target.vigilanceVaccinesHpvMedication.checked,
        testing: event.target.vigilanceVaccinesHpvTesting.checked,
        comment: event.target.vigilanceVaccinesHpvComment.value
      },
      mmr: {
        medication: event.target.vigilanceVaccinesMmrMedication.checked,
        testing: event.target.vigilanceVaccinesMmrTesting.checked,
        comment: event.target.vigilanceVaccinesMmrComment.value
      },
      tetanus: {
        medication: event.target.vigilanceVaccinesTetanusMedication.checked,
        testing: event.target.vigilanceVaccinesTetanusTesting.checked,
        comment: event.target.vigilanceVaccinesTetanusComment.value
      },
      pneumovax: {
        medication: event.target.vigilanceVaccinesPneumovaxMedication.checked,
        testing: event.target.vigilanceVaccinesPneumovaxTesting.checked,
        comment: event.target.vigilanceVaccinesPneumovaxComment.value
      },
      other: {
        name: event.target.vigilanceVaccinesOtherName.value,
        medication: event.target.vigilanceVaccinesOtherMedication.checked,
        testing: event.target.vigilanceVaccinesOtherTesting.checked,
        comment: event.target.vigilanceVaccinesOtherComment.value
      }
    },
    highlighted: oldVigilance.highlighted,
  }

  console.log('1',oldVigilance);
  console.log('2',newVigilance);


  let requestBody = {
    query: `
      mutation {updateVisitVigilance(
        activityId:"${activityId}",
        visitId:"${visitId}",
        visitInput:{
          vigilanceChronicIllnessDiabetesMedication:${oldVigilance.chronicIllness.diabetes.medication},
          vigilanceChronicIllnessDiabetesTesting:${oldVigilance.chronicIllness.diabetes.testing},
          vigilanceChronicIllnessDiabetesComment:"${oldVigilance.chronicIllness.diabetes.comment}",
          vigilanceChronicIllnessHbpMedication:${oldVigilance.chronicIllness.hbp.medication},
          vigilanceChronicIllnessHbpTesting:${oldVigilance.chronicIllness.hbp.testing},
          vigilanceChronicIllnessHbpComment:"${oldVigilance.chronicIllness.hbp.comment}",
          vigilanceChronicIllnessDyslipidemiaMedication:${oldVigilance.chronicIllness.dyslipidemia.medication},
          vigilanceChronicIllnessDyslipidemiaTesting:${oldVigilance.chronicIllness.dyslipidemia.testing},
          vigilanceChronicIllnessDyslipidemiaComment:"${oldVigilance.chronicIllness.dyslipidemia.comment}",
          vigilanceChronicIllnessCadMedication:${oldVigilance.chronicIllness.cad.medication},
          vigilanceChronicIllnessCadTesting:${oldVigilance.chronicIllness.cad.testing},
          vigilanceChronicIllnessCadComment:"${oldVigilance.chronicIllness.cad.comment}",
          vigilanceLifestyleWeightMedication:${oldVigilance.lifestyle.weight.medication},
          vigilanceLifestyleWeightTesting:${oldVigilance.lifestyle.weight.testing},
          vigilanceLifestyleWeightComment:"${oldVigilance.lifestyle.weight.comment}",
          vigilanceLifestyleDietMedication:${oldVigilance.lifestyle.diet.medication},
          vigilanceLifestyleDietTesting:${oldVigilance.lifestyle.diet.testing},
          vigilanceLifestyleDietComment:"${oldVigilance.lifestyle.diet.comment}",
          vigilanceLifestyleSmokingMedication:${oldVigilance.lifestyle.smoking.medication},
          vigilanceLifestyleSmokingTesting:${oldVigilance.lifestyle.smoking.testing},
          vigilanceLifestyleSmokingComment:"${oldVigilance.lifestyle.smoking.comment}",
          vigilanceLifestyleSubstanceAbuseMedication:${oldVigilance.lifestyle.substanceAbuse.medication},
          vigilanceLifestyleSubstanceAbuseTesting:${oldVigilance.lifestyle.substanceAbuse.testing},
          vigilanceLifestyleSubstanceAbuseComment:"${oldVigilance.lifestyle.substanceAbuse.comment}",
          vigilanceLifestyleExerciseMedication:${oldVigilance.lifestyle.exercise.medication},
          vigilanceLifestyleExerciseTesting:${oldVigilance.lifestyle.exercise.testing},
          vigilanceLifestyleExerciseComment:"${oldVigilance.lifestyle.exercise.comment}",
          vigilanceLifestyleAllergiesMedication:${oldVigilance.lifestyle.allergies.medication},
          vigilanceLifestyleAllergiesTesting:${oldVigilance.lifestyle.allergies.testing},
          vigilanceLifestyleAllergiesComment:"${oldVigilance.lifestyle.allergies.comment}",
          vigilanceLifestyleAsthmaMedication:${oldVigilance.lifestyle.asthma.medication},
          vigilanceLifestyleAsthmaTesting:${oldVigilance.lifestyle.asthma.testing},
          vigilanceLifestyleAsthmaComment:"${oldVigilance.lifestyle.asthma.comment}",
          vigilanceScreeningBreastMedication:${oldVigilance.screening.breast.medication},
          vigilanceScreeningBreastTesting:${oldVigilance.screening.breast.testing},
          vigilanceScreeningBreastComment:"${oldVigilance.screening.breast.comment}",
          vigilanceScreeningProstateMedication:${oldVigilance.screening.prostate.medication},
          vigilanceScreeningProstateTesting:${oldVigilance.screening.prostate.testing},
          vigilanceScreeningProstateComment:"${oldVigilance.screening.prostate.comment}",
          vigilanceScreeningCervixMedication:${oldVigilance.screening.cervix.medication},
          vigilanceScreeningCervixTesting:${oldVigilance.screening.cervix.testing},
          vigilanceScreeningCervixComment:"${oldVigilance.screening.cervix.comment}",
          vigilanceScreeningColonMedication:${oldVigilance.screening.colon.medication},
          vigilanceScreeningColonTesting:${oldVigilance.screening.colon.testing},
          vigilanceScreeningColonComment:"${oldVigilance.screening.colon.comment}",
          vigilanceScreeningDentalMedication:${oldVigilance.screening.dental.medication},
          vigilanceScreeningDentalTesting:${oldVigilance.screening.dental.testing},
          vigilanceScreeningDentalComment:"${oldVigilance.screening.dental.comment}",
          vigilanceVaccinesInfluenzaMedication:${oldVigilance.vaccines.influenza.medication},
          vigilanceVaccinesInfluenzaTesting:${oldVigilance.vaccines.influenza.testing},
          vigilanceVaccinesInfluenzaComment:"${oldVigilance.vaccines.influenza.comment}",
          vigilanceVaccinesVaricellaMedication:${oldVigilance.vaccines.varicella.medication},
          vigilanceVaccinesVaricellaTesting:${oldVigilance.vaccines.varicella.testing},
          vigilanceVaccinesVaricellaComment:"${oldVigilance.vaccines.varicella.comment}",
          vigilanceVaccinesHpvMedication:${oldVigilance.vaccines.hpv.medication},
          vigilanceVaccinesHpvTesting:${oldVigilance.vaccines.hpv.testing},
          vigilanceVaccinesHpvComment:"${oldVigilance.vaccines.hpv.comment}",
          vigilanceVaccinesMmrMedication:${oldVigilance.vaccines.mmr.medication},
          vigilanceVaccinesMmrTesting:${oldVigilance.vaccines.mmr.testing},
          vigilanceVaccinesMmrComment:"${oldVigilance.vaccines.mmr.comment}",
          vigilanceVaccinesTetanusMedication:${oldVigilance.vaccines.tetanus.medication},
          vigilanceVaccinesTetanusTesting:${oldVigilance.vaccines.tetanus.testing},
          vigilanceVaccinesTetanusComment:"${oldVigilance.vaccines.tetanus.comment}",
          vigilanceVaccinesPneumovaxMedication:${oldVigilance.vaccines.pneumovax.medication},
          vigilanceVaccinesPneumovaxTesting:${oldVigilance.vaccines.pneumovax.testing},
          vigilanceVaccinesPneumovaxComment:"${oldVigilance.vaccines.pneumovax.comment}",
          vigilanceVaccinesOtherName:"${oldVigilance.vaccines.other.name}",
          vigilanceVaccinesOtherMedication:${oldVigilance.vaccines.other.medication},
          vigilanceVaccinesOtherTesting:${oldVigilance.vaccines.other.testing},
          vigilanceVaccinesOtherComment:"${oldVigilance.vaccines.other.comment}",
          vigilanceHighlighted: ${oldVigilance.highlighted}
        }
        visitInput2: {
          vigilanceChronicIllnessDiabetesMedication:${newVigilance.chronicIllness.diabetes.medication},
          vigilanceChronicIllnessDiabetesTesting:${newVigilance.chronicIllness.diabetes.testing},
          vigilanceChronicIllnessDiabetesComment:"${newVigilance.chronicIllness.diabetes.comment}",
          vigilanceChronicIllnessHbpMedication:${newVigilance.chronicIllness.hbp.medication},
          vigilanceChronicIllnessHbpTesting:${newVigilance.chronicIllness.hbp.testing},
          vigilanceChronicIllnessHbpComment:"${newVigilance.chronicIllness.hbp.comment}",
          vigilanceChronicIllnessDyslipidemiaMedication:${newVigilance.chronicIllness.dyslipidemia.medication},
          vigilanceChronicIllnessDyslipidemiaTesting:${newVigilance.chronicIllness.dyslipidemia.testing},
          vigilanceChronicIllnessDyslipidemiaComment:"${newVigilance.chronicIllness.dyslipidemia.comment}",
          vigilanceChronicIllnessCadMedication:${newVigilance.chronicIllness.cad.medication},
          vigilanceChronicIllnessCadTesting:${newVigilance.chronicIllness.cad.testing},
          vigilanceChronicIllnessCadComment:"${newVigilance.chronicIllness.cad.comment}",
          vigilanceLifestyleWeightMedication:${newVigilance.lifestyle.weight.medication},
          vigilanceLifestyleWeightTesting:${newVigilance.lifestyle.weight.testing},
          vigilanceLifestyleWeightComment:"${newVigilance.lifestyle.weight.comment}",
          vigilanceLifestyleDietMedication:${newVigilance.lifestyle.diet.medication},
          vigilanceLifestyleDietTesting:${newVigilance.lifestyle.diet.testing},
          vigilanceLifestyleDietComment:"${newVigilance.lifestyle.diet.comment}",
          vigilanceLifestyleSmokingMedication:${newVigilance.lifestyle.smoking.medication},
          vigilanceLifestyleSmokingTesting:${newVigilance.lifestyle.smoking.testing},
          vigilanceLifestyleSmokingComment:"${newVigilance.lifestyle.smoking.comment}",
          vigilanceLifestyleSubstanceAbuseMedication:${newVigilance.lifestyle.substanceAbuse.medication},
          vigilanceLifestyleSubstanceAbuseTesting:${newVigilance.lifestyle.substanceAbuse.testing},
          vigilanceLifestyleSubstanceAbuseComment:"${newVigilance.lifestyle.substanceAbuse.comment}",
          vigilanceLifestyleExerciseMedication:${newVigilance.lifestyle.exercise.medication},
          vigilanceLifestyleExerciseTesting:${newVigilance.lifestyle.exercise.testing},
          vigilanceLifestyleExerciseComment:"${newVigilance.lifestyle.exercise.comment}",
          vigilanceLifestyleAllergiesMedication:${newVigilance.lifestyle.allergies.medication},
          vigilanceLifestyleAllergiesTesting:${newVigilance.lifestyle.allergies.testing},
          vigilanceLifestyleAllergiesComment:"${newVigilance.lifestyle.allergies.comment}",
          vigilanceLifestyleAsthmaMedication:${newVigilance.lifestyle.asthma.medication},
          vigilanceLifestyleAsthmaTesting:${newVigilance.lifestyle.asthma.testing},
          vigilanceLifestyleAsthmaComment:"${newVigilance.lifestyle.asthma.comment}",
          vigilanceScreeningBreastMedication:${newVigilance.screening.breast.medication},
          vigilanceScreeningBreastTesting:${newVigilance.screening.breast.testing},
          vigilanceScreeningBreastComment:"${newVigilance.screening.breast.comment}",
          vigilanceScreeningProstateMedication:${newVigilance.screening.prostate.medication},
          vigilanceScreeningProstateTesting:${newVigilance.screening.prostate.testing},
          vigilanceScreeningProstateComment:"${newVigilance.screening.prostate.comment}",
          vigilanceScreeningCervixMedication:${newVigilance.screening.cervix.medication},
          vigilanceScreeningCervixTesting:${newVigilance.screening.cervix.testing},
          vigilanceScreeningCervixComment:"${newVigilance.screening.cervix.comment}",
          vigilanceScreeningColonMedication:${newVigilance.screening.colon.medication},
          vigilanceScreeningColonTesting:${newVigilance.screening.colon.testing},
          vigilanceScreeningColonComment:"${newVigilance.screening.colon.comment}",
          vigilanceScreeningDentalMedication:${newVigilance.screening.dental.medication},
          vigilanceScreeningDentalTesting:${newVigilance.screening.dental.testing},
          vigilanceScreeningDentalComment:"${newVigilance.screening.dental.comment}",
          vigilanceVaccinesInfluenzaMedication:${newVigilance.vaccines.influenza.medication},
          vigilanceVaccinesInfluenzaTesting:${newVigilance.vaccines.influenza.testing},
          vigilanceVaccinesInfluenzaComment:"${newVigilance.vaccines.influenza.comment}",
          vigilanceVaccinesVaricellaMedication:${newVigilance.vaccines.varicella.medication},
          vigilanceVaccinesVaricellaTesting:${newVigilance.vaccines.varicella.testing},
          vigilanceVaccinesVaricellaComment:"${newVigilance.vaccines.varicella.comment}",
          vigilanceVaccinesHpvMedication:${newVigilance.vaccines.hpv.medication},
          vigilanceVaccinesHpvTesting:${newVigilance.vaccines.hpv.testing},
          vigilanceVaccinesHpvComment:"${newVigilance.vaccines.hpv.comment}",
          vigilanceVaccinesMmrMedication:${newVigilance.vaccines.mmr.medication},
          vigilanceVaccinesMmrTesting:${newVigilance.vaccines.mmr.testing},
          vigilanceVaccinesMmrComment:"${newVigilance.vaccines.mmr.comment}",
          vigilanceVaccinesTetanusMedication:${newVigilance.vaccines.tetanus.medication},
          vigilanceVaccinesTetanusTesting:${newVigilance.vaccines.tetanus.testing},
          vigilanceVaccinesTetanusComment:"${newVigilance.vaccines.tetanus.comment}",
          vigilanceVaccinesPneumovaxMedication:${newVigilance.vaccines.pneumovax.medication},
          vigilanceVaccinesPneumovaxTesting:${newVigilance.vaccines.pneumovax.testing},
          vigilanceVaccinesPneumovaxComment:"${newVigilance.vaccines.pneumovax.comment}",
          vigilanceVaccinesOtherName:"${newVigilance.vaccines.other.name}",
          vigilanceVaccinesOtherMedication:${newVigilance.vaccines.other.medication},
          vigilanceVaccinesOtherTesting:${newVigilance.vaccines.other.testing},
          vigilanceVaccinesOtherComment:"${newVigilance.vaccines.other.comment}",
          vigilanceHighlighted: ${newVigilance.highlighted}
        }
      )
        {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};

   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.updatePatientVigilance);
      let responseAlert = '...vigilance update success!...';
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
      this.props.updateVisit(resData.data.updateVisitVigilance)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.updateVisitVigilance,
        activityA: `updateVisitVigilance?activityId:${activityId},visitId:${visitId}`,
        updating: {
          state: null,
          field: null,
          previous: {}
        }
      });
      this.context.selectedVisit = resData.data.updateVisitVigilance;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

submitAddUserForm = (event) => {
  event.preventDefault();
  console.log('...adding consultant...');
  this.context.setUserAlert('...adding consultant...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const consultantId = event.target.user.value;
  const visitId = this.props.visit._id;

  if (
      consultantId.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

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
       {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.addVisitConsultant)
      this.setState({
        isLoading: false,
        overlay2: false,
        activityA: `addVisitConsultant?activityId:${activityId},visitId:${visitId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });
}
deleteConsultant = (args) => {
  console.log('...deleting consultant...');
  this.context.setUserAlert('...deleting consultant...')
  this.setState({isLoading: true, overlay2: true});
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
       {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.deleteVisitConsultant)
      this.setState({
        isLoading: false,
        overlay2: false,
        activityA: `deleteVisitConsultant?activityId:${activityId},visitId:${visitId},consultantId:${consultantId}`,
      });
      this.logUserActivity({activityId: activityId,token: token});
      this.cancelAdd();
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
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
    addAttachmentForm: false,
    overlay2: true
  })

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  let args = this.state.addAttachmentArgs;
  let field = args.field;

  let file2Path;

  if (event.target.fileInput.value === "" ) {
    this.context.setUserAlert("...no file!? Please add a file...")
        this.setState({isLoading: false, overlay2: false})
        return;
  }

  if ( event.target.fileInput.value !== "" ) {
    let file = AuthContext._currentValue.file;

    const fileName = file.name;
    // const fileName = file.name.substr(0, file.name.length - 4);
    const filePath = 'visit/'+visitId+'/'+field+'/attachments';
    console.log('...file present...');
    let fileType = file.type.split('/')[1];
    let filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/'+filePath+'/'+fileName+'.'+fileType;

    file2Path = filePath2;

    const config = {
      bucketName: 'mbjentemrstorage',
      dirName: filePath,
      region: 'us-east-2',
      accessKeyId: this.state.pocketVars.s3.a,
      secretAccessKey: this.state.pocketVars.s3.b,
      s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
    }
    const ReactS3Client = new S3(config);
    this.context.setUserAlert("...s3 uploading allergy attachment ...")
    console.log('...s3 uploading allergy attachment..');
    this.setState({
      overlayStatus: {
        type: 's3',
        data: {
          action: 'upload',
          target: `${field} attachment`,
        }
      },
      overlay: true,
    s3State:  {
      action: 'upload',
      target: `${field} attachment`,
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
              target: 'allergy attachment',
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
              target: 'allergy attachment',
              status: 'failed'
            }
          });
        })
      }

  let requestBody;

  if (field === 'complaint') {
    let complaintTitle = args.data.title;
    let complaintDescription = args.data.description;
    let complaintAnamnesis = args.data.anamnesis;
    let complaintAttachment = file2Path;

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
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'survey') {
    let surveyTitle = args.data.title;
    let surveyDescription = args.data.description;
    let surveyAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'systematicInquiry') {
    let systematicInquiryTitle = args.data.title;
    let systematicInquiryDescription = args.data.description;
    let systematicInquiryAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
    let examinationAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'investigation') {
    let investigationTitle = args.data.title;
    let investigationType = args.data.type;
    let investigationDescription = args.data.description;
    let investigationAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'diagnosis') {
    let diagnosisTitle = args.data.title;
    let diagnosisType = args.data.type;
    let diagnosisDescription = args.data.description;
    let diagnosisAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'treatment') {
    let treatmentType = args.data.type;
    let treatmentTitle = args.data.title;
    let treatmentDescription = args.data.description;
    let treatmentDose = args.data.dosage;
    let treatmentFrequency = args.data.frequency;
    let treatmentAttachment = file2Path;

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
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'billing') {
    let billingAmount = args.data.amount;
    let billingPaid = args.data.paid;
    let billingTitle = args.data.title;
    let billingType = args.data.type;
    let billingDescription = args.data.description;
    let billingNotes = args.data.notes;
    let billingAttachment = file2Path;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }

   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }


      this.context.setUserAlert(responseAlert)

      if (field === 'complaint') {
        this.props.updateVisit(resData.data.addVisitComplaintAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitComplaintAttachment,
          activityA: `addVisitComplaintAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'survey') {
        this.props.updateVisit(resData.data.addVisitSurveyAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitSurveyAttachment,
          activityA: `addVisitSurveyAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'systematicInquiry') {
        this.props.updateVisit(resData.data.addVisitSysInquiryAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitSysInquiryAttachment,
          activityA: `addVisitSysInquiryAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'examination') {
        this.props.updateVisit(resData.data.addVisitExaminationAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitExaminationAttachment,
          activityA: `addVisitExaminationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'investigation') {
        this.props.updateVisit(resData.data.addVisitInvestigationAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitInvestigationAttachment,
          activityA: `addVisitInvestigationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'diagnosis') {
        this.props.updateVisit(resData.data.addVisitDiagnosisAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitDiagnosisAttachment,
          activityA: `addVisitDiagnosisAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'treatment') {
        this.props.updateVisit(resData.data.addVisitTreatmentAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitTreatmentAttachment,
          activityA: `addVisitTreatmentAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'billing') {
        this.props.updateVisit(resData.data.addVisitBillingAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.addVisitBillingAttachment,
          activityA: `addVisitBillingAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }

      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}
deleteAttachment = (args) => {
  console.log('...deleting attachment...', args.type);
  this.context.setUserAlert('...adding attachment...');
  this.setState({isLoading: true, overlay2: true})

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  const field = args.type;
  const attachment = args.attachment;
  const item = args.item;

  let requestBody;

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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }
  if (field === 'treatment') {

    let treatmentType = item.type;
    let treatmentTitle = item.title;
    let treatmentDescription = item.description;
    let treatmentDose = item.dosage;
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
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
           {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
      `};
  }

   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }
      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }


      this.context.setUserAlert(responseAlert)

      if (field === 'complaint') {
        this.props.updateVisit(resData.data.deleteVisitComplaintAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitComplaintAttachment,
          activityA: `deleteVisitComplaintAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'survey') {
        this.props.updateVisit(resData.data.deleteVisitSurveyAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitSurveyAttachment,
          activityA: `deleteVisitSurveyAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'systematicInquiry') {
        this.props.updateVisit(resData.data.deleteVisitSysInquiryAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitSysInquiryAttachment,
          activityA: `deleteVisitSysInquiryAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'examination') {
        this.props.updateVisit(resData.data.deleteVisitExaminationAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitExaminationAttachment,
          activityA: `deleteVisitExaminationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'investigation') {
        this.props.updateVisit(resData.data.deleteVisitInvestigationAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitInvestigationAttachment,
          activityA: `deleteVisitInvestigationAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'diagnosis') {
        this.props.updateVisit(resData.data.deleteVisitDiagnosisAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitDiagnosisAttachment,
          activityA: `deleteVisitDiagnosisAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'treatment') {
        this.props.updateVisit(resData.data.deleteVisitTreatmentAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitTreatmentAttachment,
          activityA: `deleteVisitTreatmentAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }
      if (field === 'billing') {
        this.props.updateVisit(resData.data.deleteVisitBillingAttachment)
        this.setState({
          isLoading: false,
          overlay2: false,
          selectedVisit: resData.data.deleteVisitBillingAttachment,
          activityA: `deleteVisitBillingAttachment?activityId:${activityId},visitId:${visitId}`
        });
      }

      this.logUserActivity({activityId: activityId,token: token});


      const filePath = 'visit/'+visitId+'/'+field+'/attachments';
      const filePath2 = 'https://mbjentemrstorage.s3.amazonaws.com/visit/'+visitId+'/'+field+'/attachments/';
      const filename = attachment;
      const filename2 = filename.replace(filePath2,'');
      console.log('1:',filePath);
      console.log('2:',filename);
      console.log('3:',filename2);
      const config = {
        bucketName: 'mbjentemrstorage',
        dirName: filePath,
        region: 'us-east-2',
        accessKeyId: this.state.pocketVars.s3.a,
        secretAccessKey: this.state.pocketVars.s3.b,
        s3Url: 'https://mbjentemrstorage.s3.amazonaws.com',
      }
      const ReactS3Client = new S3(config);
      this.context.setUserAlert('...s3 deleting attachment..')
      console.log('...s3 deleting attachment..');
      this.setState({
        overlayStatus: {
          type: 's3',
          data: {
            action: 'delete',
            target: `${field} attachment`
          }
        },
        overlay: true,
        s3State:  {
          action: 'delete',
          target: `${field} attachment`,
          status: 'inProgress'
        }
      });

      ReactS3Client
      .deleteFile(filename2, config)
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
      this.setState({isLoading: false, overlay2: false })
    });

}

submitUpdateSingleFieldForm = (event) => {
  event.preventDefault();
  console.log('...updating single field...');
  this.context.setUserAlert('...updating single field...')
  this.setState({isLoading: true, overlay2: true});

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;
  const field = event.target.field.value;
  const query = event.target.query.value;

  if (
      query.trim().length === 0
    ) {
    this.context.setUserAlert("...blank required fields!!!...")
    this.setState({isLoading: false, overlay2: false})
    return;
  }

  let requestBody = {
    query: `
      mutation {updateVisitSingleField(
        activityId:"${activityId}",
        visitId:"${visitId}",
        field:"${field}",
        query:"${query}"
      )
       {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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

      if (resData.errors) {
        error = resData.errors[0].message;
        responseAlert = error;
      }

      if (resData.data.error) {
        error = resData.data.error;
        responseAlert = error;
      }
      this.context.setUserAlert(responseAlert)
      this.props.updateVisit(resData.data.updateVisitSingleField)
      this.setState({
        isLoading: false,
        overlay2: false,
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
      this.setState({isLoading: false, overlay2: false })
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
toggleFilter = (args) => {
  this.setState({
    startFilter: !this.state.startFilter,
    selectFilter: args
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
    },
    updating: {
      state: null,
      field: null,
      previous: {}
    }
  })
}
startUpdate = (args) => {
  this.setState({
    updating: {
      state: true,
      field: args.field,
      previous: args.data
    }
  })
}

completeVisit = () => {
  console.log('...completing visit...');
  this.context.setUserAlert('...completing visit...')
  this.setState({isLoading: true, overlay2: true})

  const token = this.context.token;
  const activityId = this.context.activityId;
  const visitId = this.props.visit._id;

  let requestBody = {
    query: `
      mutation {completeVisitById(
        activityId:"${activityId}",
        visitId:"${visitId}"
      )
         {_id,date,time,title,type,subType,followUp,patient{_id,active,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary},allergies{type,title,description,attachments,highlighted},medication{type,title,description,dosage,attachments,highlighted},comorbidities{type,title,description,highlighted}},consultants{_id,title,name,role,username,dob,age,gender,contact{phone,phone2,email},addresses{number,street,town,city,parish,country,postalCode,primary}},appointment{_id,title,type,subType,date,time,checkinTime,seenTime,location,description,inProgress},complaints{title,description,anamnesis,attachments,highlighted},surveys{title,description,attachments,highlighted},systematicInquiry{title,description,attachments,highlighted},vitals{pr,bp1,bp2,rr,temp,sp02,heightUnit,heightValue,weightUnit,weightValue,bmi,urine{type,value},highlighted},examination{general,area,inspection,palpation,percussion,auscultation,description,followUp,attachments,highlighted},investigation{type,title,description,attachments,highlighted},diagnosis{type,title,description,attachments,highlighted},treatment{type,title,description,dose,frequency,attachments,highlighted},billing{title,type,description,amount,paid,attachments,notes,highlighted},vigilance{chronicIllness{diabetes{medication,testing,comment},hbp{medication,testing,comment},dyslipidemia{medication,testing,comment},cad{medication,testing,comment}},lifestyle{weight{medication,testing,comment},diet{medication,testing,comment},smoking{medication,testing,comment},substanceAbuse{medication,testing,comment},exercise{medication,testing,comment},allergies{medication,testing,comment},asthma{medication,testing,comment}},screening{breast{medication,testing,comment},prostate{medication,testing,comment},cervix{medication,testing,comment},colon{medication,testing,comment},dental{medication,testing,comment}},vaccines{influenza{medication,testing,comment},varicella{medication,testing,comment},hpv{medication,testing,comment},mmr{medication,testing,comment},tetanus{medication,testing,comment},pneumovax{medication,testing,comment},other{name,medication,testing,comment}},highlighted},images{name,type,path,highlighted},files{name,type,path,highlighted}}}
    `};
   fetch('https://mbjentemr.click/graphql', {
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
      // console.log('...resData...',resData.data.completeVisitById);
      let responseAlert = '...visit completed!...';
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
      this.props.updateVisit(resData.data.completeVisitById)
      this.setState({
        isLoading: false,
        overlay2: false,
        selectedVisit: resData.data.completeVisitById,
        activityA: `completeVisitById?activityId:${activityId},visitId:${visitId}`,
        updateSingleField: {
          state: null,
          field: null
        }
      });
      this.context.selectedVisit = resData.data.completeVisitById;
      this.logUserActivity({activityId: activityId,token: token});
    })
    .catch(err => {
      console.log(err);
      this.context.setUserAlert(err);
      this.setState({isLoading: false, overlay2: false })
    });

}

nullAttachment = (args) => {
  console.log(`can't add or delete attachments ${args.field} for here`);
  this.context.setUserAlert(`can't add or delete attachments ${args.field} for here`)
}
checkAllergies = () => {
  if ((this.propsVisit.patient.allergies.length > 0) === true) {
    this.setState({
      hasAllergies: true,
    })
    this.hasAllergies = true;
  }
  if ((this.propsVisit.patient.comorbidities.length > 0) === true) {
    this.setState({
      hasComorbidities: true,
    })
    this.hasComorbidities = true;
  }
  this.props.setAllergyCheck({
    hasAllergies: this.hasAllergies,
    hasComorbidities: this.hasComorbidities,
  })
}

toggleOverlay2 = () => {
  this.setState({
    overlay2: false
  })
  this.overlay2 = false;
}

setStateCalEvent = () => {

  if (this.props.visit.date.length === 12 ) {
    this.setState({
      calEvent: {
        title: this.props.visit.title,
        description: this.props.visit.appointment.description,
        location: this.props.visit.appointment.location,
        startTime: moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD, h:mm:ss a'),
        endTime: moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD, h:mm:ss a'),
      }
    })
  }
  if (this.props.visit.date.length === 13 ) {
    this.setState({
      calEvent: {
        title: this.props.visit.title,
        description: this.props.visit.appointment.description,
        location: this.props.visit.appointment.location,
        startTime: moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD, h:mm:ss a'),
        endTime: moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD, h:mm:ss a'),
      }
    })
  }

}


render() {

  return (
    <React.Fragment>

    {this.state.overlay === true && (
      <LoadingOverlay
        status={this.state.overlayStatus}
      />
    )}
    {this.state.overlay2 === true && (
      <LoadingOverlay2
        toggleOverlay2={this.toggleOverlay2}
      />
    )}

    <div className="topContainer">
      <Row className="">
        {!this.props.visit && (
          <h3>...</h3>
        )}
      </Row>

      <Row className="">
        {this.props.visit && (
          <Col md={12} className="">

            {this.state.updateSingleField.state === true && (
              <UpdatePatientSingleFieldForm
                field={this.state.updateSingleField.field}
                onConfirm={this.submitUpdateSingleFieldForm}
                onCancel={this.cancelUpdateSingleField}
              />
            )}
            {this.props.subMenu === 'all' && (
              <Row className="tabRowAll">
              <ul className="summaryList">
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.visit.title}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.visit.type}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'type')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">subType:</p>
                  <p className="listGroupText bold">{this.props.visit.subType}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">followUp:</p>
                  <p className="listGroupText bold">{this.props.visit.followUp.toString()}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'followUp')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date:</p>
                  {this.props.visit.date.length === 12 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                  {this.props.visit.date.length === 13 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Time:</p>
                  <p className="listGroupText bold">{this.props.visit.time}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'time')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText underlined">Patient:</p>
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
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Attending Physician:</p>
                <p className="listGroupText bold">{this.props.visit.patient.attendingPhysician}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText underlined">Appointment:</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.visit.appointment.title}</p>
                  <Link
                    to={{
                      pathname: "/appointments",
                      state: {appointment: this.props.visit.appointment._id}
                    }}
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Date:</p>
                {this.props.visit.appointment.date.length === 12 && (
                  <p className="listGroupText bold">{moment.unix(this.props.visit.appointment.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                )}
                {this.props.visit.appointment.date.length === 13 && (
                  <p className="listGroupText bold">{moment.unix(this.props.visit.appointment.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                )}
                </ListGroup.Item>
              </ListGroup>
              </Col>
              </li>

              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Comorbidities:
                {this.hasComorbidities === true && (
                  <FontAwesomeIcon icon={faExclamationTriangle} className="visitAttentionIcon" color="yellow" size="lg"/>
                )}
                </h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'comorbidities')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'comorbidities' && (
                <FilterComorbidityForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientComorbidityList
                  filter={this.state.filter}
                  comorbidities={this.props.visit.patient.comorbidities}
                  authId={this.context.activityId}
                  visitPage={true}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Allergies:
                {this.hasAllergies === true && (
                  <FontAwesomeIcon icon={faExclamationTriangle} className="visitAttentionIcon" color="yellow" size="sm"/>
                )}
                </h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'allergy')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'allergy' && (
                <FilterAllergyForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientAllergyList
                  filter={this.state.filter}
                  allergies={this.props.visit.patient.allergies}
                  authId={this.context.activityId}
                  onAddAttachment={this.nullAttachment}
                  deleteAttachment={this.nullAttachment}
                  visitPage={true}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Medication:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'medication')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'medication' && (
                <FilterMedicationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientMedicationList
                  filter={this.state.filter}
                  medication={this.props.visit.patient.medication}
                  authId={this.context.activityId}
                  onAddAttachment={this.nullAttachment}
                  deleteAttachment={this.nullAttachment}
                  visitPage={true}
                />
              </Col>
              </li>

              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Admin Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Id:</p>
                  <p className="listGroupText bold">{this.props.visit._id}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Consultants:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'consultant')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'consultant' && (
                <FilterUserForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Complaints:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'complaint')}>Filter</Button>
                  {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'complaint')}>Add</Button>
                  )}
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'complaint' && (
                  <FilterComplaintForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'complaint' && (
                    <AddComplaintForm
                      onConfirm={this.submitAddComplaintForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.updating.state === true &&
                  this.state.updating.field === 'complaint' && (
                    <AddComplaintForm
                      onConfirm={this.submitUpdateComplaintForm}
                      onCancel={this.cancelAdd}
                      previousComplaint={this.state.updating.previous}
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
                  toggleVisitComplaintHighlighted={this.toggleVisitComplaintHighlighted}
                  canUpdate={this.state.canUpdate}
                  startUpdate={this.startUpdate}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Surveys:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'survey')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'survey')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'survey' && (
                <FilterSurveyForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'survey' && (
                  <AddSurveyForm
                    onConfirm={this.submitAddSurveyForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'survey' && (
                  <AddSurveyForm
                    onConfirm={this.submitUpdateSurveyForm}
                    onCancel={this.cancelAdd}
                    previousSurvey={this.state.updating.previous}
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
                toggleVisitSurveyHighlighted={this.toggleVisitSurveyHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Systematic Inquiry/ Review of Systems:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'systematicInquiry')}>Filter</Button>
                  {this.state.canEdit === true && (
                    <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'systematicInquiry')}>Add</Button>
                  )}
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'systematicInquiry' && (
                  <FilterSystematicInquiryForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'systematicInquiry' && (
                    <AddSystematicInquiryForm
                      onConfirm={this.submitAddSystematicInquiryForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.updating.state === true &&
                  this.state.updating.field === 'systematicInquiry' && (
                    <AddSystematicInquiryForm
                      onConfirm={this.submitUpdateSystematicInquiryForm}
                      onCancel={this.cancelAdd}
                      previousSystematicInquiry={this.state.updating.previous}
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
                  toggleVisitSysInquiryHighlighted={this.toggleVisitSysInquiryHighlighted}
                  canUpdate={this.state.canUpdate}
                  startUpdate={this.startUpdate}
                />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Vitals:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'vitals')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'vitals')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'vitals' && (
                <FilterVitalsForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'vitals' && (
                  <AddVitalsForm
                    onConfirm={this.submitAddVitalsForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'vitals' && (
                  <AddVitalsForm
                    onConfirm={this.submitUpdateVitalsForm}
                    onCancel={this.cancelAdd}
                    previousVitals={this.state.updating.previous}
                  />
              )}
              <VisitVitalsList
                filter={this.state.filter}
                vitals={this.props.visit.vitals}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteVitals}
                toggleVisitVitalsHighlighted={this.toggleVisitVitalsHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Examinations:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'examination')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'examination')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'examination' && (
                <FilterExaminationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'examination' && (
                  <AddExaminationForm
                    onConfirm={this.submitAddExaminationForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'examination' && (
                  <AddExaminationForm
                    onConfirm={this.submitUpdateExaminationForm}
                    onCancel={this.cancelAdd}
                    previousExamination={this.state.updating.previous}
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
                toggleVisitExaminationHighlighted={this.toggleVisitExaminationHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Investigations:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'investigation')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'investigation')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'investigation' && (
                <FilterInvestigationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'investigation' && (
                  <AddInvestigationForm
                    onConfirm={this.submitAddInvestigationForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'investigation' && (
                  <AddInvestigationForm
                    onConfirm={this.submitUpdateInvestigationForm}
                    onCancel={this.cancelAdd}
                    previousInvestigation={this.state.updating.previous}
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
                toggleVisitInvestigationHighlighted={this.toggleVisitInvestigationHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Diagnoses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'diagnosis')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'diagnosis')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'diagnosis' && (
                <FilterDiagnosisForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'diagnosis' && (
                  <AddDiagnosisForm
                    onConfirm={this.submitAddDiagnosisForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'diagnosis' && (
                  <AddDiagnosisForm
                    onConfirm={this.submitUpdateDiagnosisForm}
                    onCancel={this.cancelAdd}
                    previousDiagnosis={this.state.updating.previous}
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
                toggleVisitDiagnosisHighlighted={this.toggleVisitDiagnosisHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Plan:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'treatment')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'treatment')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'treatment' && (
                <FilterTreatmentForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'treatment' && (
                  <AddTreatmentForm
                    onConfirm={this.submitAddTreatmentForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'treatment' && (
                  <AddTreatmentForm
                    onConfirm={this.submitUpdateTreatmentForm}
                    onCancel={this.cancelAdd}
                    previousTreatment={this.state.updating.previous}
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
                toggleVisitTreatmentHighlighted={this.toggleVisitTreatmentHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Billing:</h3>
              </Col>
              <Col className="subTabCol">
                <Button className="searchBtn" variant="outline-primary" onClick={this.toggleFilter.bind(this, 'billing')}>Filter</Button>
                <Button className="searchBtn" variant="outline-success" onClick={this.startAdd.bind(this, 'billing')}>Add</Button>
                {this.props.visit.appointment.inProgress === true && (
                  <Button className="searchBtn" variant="outline-primary" size="sm" onClick={this.completeVisit}>Complete Visit </Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'billing' && (
                <FilterBillingForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'billing' && (
                  <AddBillingForm
                    onConfirm={this.submitAddBillingForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'billing' && (
                  <AddBillingForm
                    onConfirm={this.submitUpdateBillingForm}
                    onCancel={this.cancelAdd}
                    previousBilling={this.state.updating.previous}
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
                updateBillingPaid={this.updateBillingPaid}
                toggleVisitBillingHighlighted={this.toggleVisitBillingHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Vigilance:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'vigilance')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'vigilance')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'vigilance' && (
                <h3>Filter vigilance form</h3>
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'vigilance' && (
                  <AddVigilanceForm
                    onConfirm={this.submitAddVigilanceForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'vigilance' && (
                  <AddVigilanceForm
                    onConfirm={this.submitUpdateVigilanceForm}
                    onCancel={this.cancelAdd}
                    previousVigilance={this.state.updating.previous}
                  />
              )}
              <VisitVigilanceList
                filter={this.state.filter}
                vigilance={this.props.visit.vigilance}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteVigilance}
                toggleVisitVigilanceHighlighted={this.toggleVisitVigilanceHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Images:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'image')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'image' && (
                <FilterImageForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
                toggleVisitImageHighlighted={this.toggleVisitImageHighlighted}
              />
              </Col>
              </li>
              <li className="summaryListItem">
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Files:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'file')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'file' && (
                <FilterFileForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
                toggleVisitFileHighlighted={this.toggleVisitFileHighlighted}
              />
              </Col>
              </li>
              </ul>
              </Row>
            )}
            {this.props.subMenu === 'basic' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Basic Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.visit.title}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'title')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Type:</p>
                  <p className="listGroupText bold">{this.props.visit.type}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'type')}>Edit</Button>
                  )}
                  <p className="listGroupText">subType:</p>
                  <p className="listGroupText bold">{this.props.visit.subType}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'subType')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">FollowUp:</p>
                  <p className="listGroupText bold">{this.props.visit.followUp.toString()}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'followUp')}>Edit</Button>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Date:</p>
                  {this.props.visit.date.length === 12 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                  {this.props.visit.date.length === 13 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                  <p className="listGroupText">Time:</p>
                  <p className="listGroupText bold">{this.props.visit.time}</p>
                  {this.state.canEdit === true && (
                    <Button variant="outline-primary" size="sm" onClick={this.startUpdateSingleField.bind(this, 'time')}>Edit</Button>
                  )}
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
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                <p className="listGroupText">Attending Physician:</p>
                <p className="listGroupText bold">{this.props.visit.patient.attendingPhysician}</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Appointment:</p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="listGroupText">Title:</p>
                  <p className="listGroupText bold">{this.props.visit.appointment.title}</p>
                  <p className="listGroupText">Date:</p>
                  {this.props.visit.appointment.date.length === 12 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.appointment.date.substr(0,9)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                  {this.props.visit.appointment.date.length === 13 && (
                    <p className="listGroupText bold">{moment.unix(this.props.visit.appointment.date.substr(0,10)).add(1, 'days').tz("America/Bogota").format('YYYY-MM-DD')}</p>
                  )}
                  <Link
                    to={{
                      pathname: "/appointments",
                      state: {appointment: this.props.visit.appointment._id}
                    }}
                  >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="listIcon"/>
                  </Link>
                </ListGroup.Item>
              </ListGroup>
              </Col>
            )}

            {this.props.subMenu === 'allergy' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Allergies:
                {this.hasAllergies === true && (
                  <FontAwesomeIcon icon={faExclamationTriangle} className="visitAttentionIcon" color="yellow" size="sm"/>
                )}
                </h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'allergy')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'allergy' && (
                <FilterAllergyForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientAllergyList
                  filter={this.state.filter}
                  allergies={this.props.visit.patient.allergies}
                  authId={this.context.activityId}
                  visitPage={true}
                  onAddAttachment={this.nullAttachment}
                  deleteAttachment={this.nullAttachment}
                />
              </Col>
            )}
            {this.props.subMenu === 'medication' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Medication:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'medication')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'medication' && (
                <FilterMedicationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientMedicationList
                  filter={this.state.filter}
                  medication={this.props.visit.patient.medication}
                  authId={this.context.activityId}
                  visitPage={true}
                  onAddAttachment={this.nullAttachment}
                  deleteAttachment={this.nullAttachment}
                />
              </Col>
            )}
            {this.props.subMenu === 'comorbidities' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Comorbidities:
                {this.hasComorbidities === true && (
                  <FontAwesomeIcon icon={faExclamationTriangle} className="visitAttentionIcon" color="yellow" size="sm"/>
                )}
                </h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'comorbidities')}>Filter</Button>
              </Col>
              {this.state.startFilter &&
                this.state.selectFilter === 'comorbidities' && (
                <FilterComorbidityForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
                <PatientComorbidityList
                  filter={this.state.filter}
                  comorbidities={this.props.visit.patient.comorbidities}
                  authId={this.context.activityId}
                  visitPage={true}
                />
              </Col>
            )}

            {this.props.subMenu === 'admin' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Admin Info:</h3>
              </Col>
              <ListGroup className="profileBasicListGroup">
                <ListGroup.Item>
                  <p className="listGroupText">Id:</p>
                  <p className="listGroupText bold">{this.props.visit._id}</p>
                </ListGroup.Item>
              </ListGroup>
              </Col>
            )}
            {this.props.subMenu === 'consultant' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Consultants:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'consultant')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'consultant')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'consultant' && (
                <FilterUserForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
              </Col>
            )}
            {this.props.subMenu === 'complaint' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Complaints:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'complaint')}>Filter</Button>
                  {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'complaint')}>Add</Button>
                  )}
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'complaint' && (
                  <FilterComplaintForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'complaint' && (
                    <AddComplaintForm
                      onConfirm={this.submitAddComplaintForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.updating.state === true &&
                  this.state.updating.field === 'complaint' && (
                    <AddComplaintForm
                      onConfirm={this.submitUpdateComplaintForm}
                      onCancel={this.cancelAdd}
                      previousComplaint={this.state.updating.previous}
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
                  toggleVisitComplaintHighlighted={this.toggleVisitComplaintHighlighted}
                  canUpdate={this.state.canUpdate}
                  startUpdate={this.startUpdate}
                />
              </Col>
            )}
            {this.props.subMenu === 'survey' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Surveys:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'survey')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'survey')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'survey' && (
                <FilterSurveyForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'survey' && (
                  <AddSurveyForm
                    onConfirm={this.submitAddSurveyForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'survey' && (
                  <AddSurveyForm
                    onConfirm={this.submitUpdateSurveyForm}
                    onCancel={this.cancelAdd}
                    previousSurvey={this.state.updating.previous}
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
                toggleVisitSurveyHighlighted={this.toggleVisitSurveyHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'systematicInquiry' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Systematic Inquiry/ Review of Systems:</h3>
              </Col>
                <Col className="subTabCol">
                  <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'systematicInquiry')}>Filter</Button>
                  {this.state.canEdit === true && (
                    <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'systematicInquiry')}>Add</Button>
                  )}
                </Col>
                {this.state.startFilter === true &&
                  this.state.selectFilter === 'systematicInquiry' && (
                  <FilterSystematicInquiryForm
                    onCancel={this.toggleFilter}
                    onConfirm={this.submitFilterForm}
                  />
                )}
                {this.state.adding.state === true &&
                  this.state.adding.field === 'systematicInquiry' && (
                    <AddSystematicInquiryForm
                      onConfirm={this.submitAddSystematicInquiryForm}
                      onCancel={this.cancelAdd}
                    />
                )}
                {this.state.updating.state === true &&
                  this.state.updating.field === 'systematicInquiry' && (
                    <AddSystematicInquiryForm
                      onConfirm={this.submitUpdateSystematicInquiryForm}
                      onCancel={this.cancelAdd}
                      previousSystematicInquiry={this.state.updating.previous}
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
                  toggleVisitSysInquiryHighlighted={this.toggleVisitSysInquiryHighlighted}
                  canUpdate={this.state.canUpdate}
                  startUpdate={this.startUpdate}
                />
              </Col>
            )}
            {this.props.subMenu === 'vitals' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Vitals:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'vitals')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'vitals')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'vitals' && (
                <FilterVitalsForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'vitals' && (
                  <AddVitalsForm
                    onConfirm={this.submitAddVitalsForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'vitals' && (
                  <AddVitalsForm
                    onConfirm={this.submitUpdateVitalsForm}
                    onCancel={this.cancelAdd}
                    previousVitals={this.state.updating.previous}
                  />
              )}
              <VisitVitalsList
                filter={this.state.filter}
                vitals={this.props.visit.vitals}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteVitals}
                toggleVisitVitalsHighlighted={this.toggleVisitVitalsHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'examination' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Examinations:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'examination')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'examination')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'examination' && (
                <FilterExaminationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'examination' && (
                  <AddExaminationForm
                    onConfirm={this.submitAddExaminationForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'examination' && (
                  <AddExaminationForm
                    onConfirm={this.submitUpdateExaminationForm}
                    onCancel={this.cancelAdd}
                    previousExamination={this.state.updating.previous}
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
                toggleVisitExaminationHighlighted={this.toggleVisitExaminationHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'investigation' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Investigations:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'investigation')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'investigation')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'investigation' && (
                <FilterInvestigationForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'investigation' && (
                  <AddInvestigationForm
                    onConfirm={this.submitAddInvestigationForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'investigation' && (
                  <AddInvestigationForm
                    onConfirm={this.submitUpdateInvestigationForm}
                    onCancel={this.cancelAdd}
                    previousInvestigation={this.state.updating.previous}
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
                toggleVisitInvestigationHighlighted={this.toggleVisitInvestigationHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'diagnosis' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Diagnoses:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'diagnosis')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'diagnosis')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'diagnosis' && (
                <FilterDiagnosisForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'diagnosis' && (
                  <AddDiagnosisForm
                    onConfirm={this.submitAddDiagnosisForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'diagnosis' && (
                  <AddDiagnosisForm
                    onConfirm={this.submitUpdateDiagnosisForm}
                    onCancel={this.cancelAdd}
                    previousDiagnosis={this.state.updating.previous}
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
                toggleVisitDiagnosisHighlighted={this.toggleVisitDiagnosisHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'treatment' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Plan:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'treatment')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'treatment')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'treatment' && (
                <FilterTreatmentForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'treatment' && (
                  <AddTreatmentForm
                    onConfirm={this.submitAddTreatmentForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'treatment' && (
                  <AddTreatmentForm
                    onConfirm={this.submitUpdateTreatmentForm}
                    onCancel={this.cancelAdd}
                    previousTreatment={this.state.updating.previous}
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
                toggleVisitTreatmentHighlighted={this.toggleVisitTreatmentHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'billing' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Billing:</h3>
              </Col>
              <Col className="subTabCol">
                <Button className="searchBtn" variant="outline-primary" onClick={this.toggleFilter.bind(this, 'billing')}>Filter</Button>
                <Button className="searchBtn" variant="outline-success" onClick={this.startAdd.bind(this, 'billing')}>Add</Button>
                <Button className="searchBtn" variant="outline-primary" size="sm" onClick={this.completeVisit}>Complete Visit</Button>
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'billing' && (
                <FilterBillingForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'billing' && (
                  <AddBillingForm
                    onConfirm={this.submitAddBillingForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'billing' && (
                  <AddBillingForm
                    onConfirm={this.submitUpdateBillingForm}
                    onCancel={this.cancelAdd}
                    previousBilling={this.state.updating.previous}
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
                updateBillingPaid={this.updateBillingPaid}
                toggleVisitBillingHighlighted={this.toggleVisitBillingHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'vigilance' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Vigilance:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'vigilance')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'vigilance')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'vigilance' && (
                <h3>Filter vigilance form</h3>
              )}
              {this.state.adding.state === true &&
                this.state.adding.field === 'vigilance' && (
                  <AddVigilanceForm
                    onConfirm={this.submitAddVigilanceForm}
                    onCancel={this.cancelAdd}
                  />
              )}
              {this.state.updating.state === true &&
                this.state.updating.field === 'vigilance' && (
                  <AddVigilanceForm
                    onConfirm={this.submitUpdateVigilanceForm}
                    onCancel={this.cancelAdd}
                    previousVigilance={this.state.updating.previous}
                  />
              )}
              <VisitVigilanceList
                filter={this.state.filter}
                vigilance={this.props.visit.vigilance}
                authId={this.context.activityId}
                canDelete={this.state.canDelete}
                onDelete={this.deleteVigilance}
                toggleVisitVigilanceHighlighted={this.toggleVisitVigilanceHighlighted}
                canUpdate={this.state.canUpdate}
                startUpdate={this.startUpdate}
              />
              </Col>
            )}
            {this.props.subMenu === 'image' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Images:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'image')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'image')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'image' && (
                <FilterImageForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
                toggleVisitImageHighlighted={this.toggleVisitImageHighlighted}
              />
              </Col>
            )}
            {this.props.subMenu === 'file' && (
              <Col className="tabCol2">
              <Col className="subTabCol">
                <h3 className="">Files:</h3>
              </Col>
              <Col className="subTabCol">
                <Button variant="outline-primary" className="searchBtn" onClick={this.toggleFilter.bind(this, 'file')}>Filter</Button>
                {this.state.canEdit === true && (
                  <Button variant="outline-success" className="searchBtn" onClick={this.startAdd.bind(this, 'file')}>Add</Button>
                )}
              </Col>
              {this.state.startFilter === true &&
                this.state.selectFilter === 'file' && (
                <FilterFileForm
                  onCancel={this.toggleFilter}
                  onConfirm={this.submitFilterForm}
                />
              )}
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
                toggleVisitFileHighlighted={this.toggleVisitFileHighlighted}
              />
              </Col>
            )}
          </Col>
        )}
      </Row>
    </div>
    </React.Fragment>
  );
}

}

export default VisitDetail;
