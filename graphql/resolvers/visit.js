const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const Appointment = require('../../models/appointment');
const Visit = require('../../models/visit');
const Reminder = require('../../models/reminder');
const util = require('util');
const mongoose = require('mongoose');
const moment = require('moment');
const mailgun = require("mailgun-js");
const puppeteer = require('puppeteer');

const { transformVisit } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  getAllVisits: async (args, req) => {
    console.log("Resolver: getAllVisits...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const visits = await Visit.find({})
      .populate('consultants')
      .populate('appointment')
      .populate('patient');
      return visits.map(visit => {
        return transformVisit(visit,);
      });
    } catch (err) {
      throw err;
    }
  },
  getVisitById: async (args, req) => {
    console.log("Resolver: getVisitById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const visit = await Visit.findById(args.visitId)
      .populate('consultants')
      .populate('appointment')
      .populate('patient');
      return {
        ...visit._doc,
        _id: visit.id,
        title: visit.title,
        date: visit.date
      };
    } catch (err) {
      throw err;
    }
  },
  getVisitsByField: async (args, req) => {
    console.log("Resolver: getVisitsByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Visit.find(query)
      .populate('consultants')
      .populate('appointment')
      .populate('patient');
      return patients.map(patient => {
        return transformVisit(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getVisitsByFieldRegex: async (args, req) => {
    console.log("Resolver: getVisitsByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Visit.find(query)
      .populate('consultants')
      .populate('appointment')
      .populate('patient');
      return patients.map(patient => {
        return transformVisit(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getVisitsByConsultants: async (args, req) => {
    console.log("Resolver: getVisitsByConsultants...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const consultants = args.consultantIds.split(',');
      const visits = await Visit.find({
        consultants: {$all: consultants}
      })
      .populate('consultants')
      .populate('appointment')
      .populate('patient');
      return visits.map(visit => {
        return transformVisit(visit);
      });
    } catch (err) {
      throw err;
    }
  },
  getPocketVars: async (args, req) => {
    console.log('Resolver: getPocketVars...');
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const pocketVars = process.env.CREDS;
      // console.log('pocketVars',pocketVars);
      // const pocketVars = JSON.stringify(pocketVariables);
      // console.log(pocketVariables,pocketVars);
      return pocketVars;
    } catch (err) {
      throw err;
    }
  },
  updateVisitAllFields: async (args, req) => {
    console.log("Resolver: updateVisitAllFields...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId},
        {

        },
        {new: true, useFindAndModify: false})
        .populate('consultants')
        .populate('appointment')
        .populate('patient');
      return {
        ...visit._doc,
        _id: visit.id,
        title: visit.title,
        date: visit.date
      };
    } catch (err) {
      throw err;
    }
  },
  updateVisitSingleField: async (args, req) => {
    console.log("ResolverupdateVisitSingleField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let query =  '';
      const resolverField = args.field;
      const resolverQuery = args.query;
      query = {[resolverField]:resolverQuery};
      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId},
        query,
        {new: true, useFindAndModify: false})
        .populate('consultants')
        .populate('appointment')
        .populate('patient');
      return {
        ...visit._doc,
        _id: visit.id,
        title: visit.title,
        date: visit.date
      };
    } catch (err) {
      throw err;
    }
  },
  updateVisitPatient: async (args, req) => {
    console.log("Resolver: updateVisitPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const patient = await Patient.findById({_id: args.patientId})
        console.log('x',patient);
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {patient: patient},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitConsultant: async (args, req) => {
    console.log("Resolver: addVisitConsultant...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const consultant = await User.findById({_id: args.consultantId})
        if (consultant.role !== 'Nurse' && consultant.role !== 'Doctor') {
          console.log('...this staff is a '+consultant.role+' pick a Nurse or Doctor & try again ...');
          throw new Error('...this staff is a '+consultant.role+' pick a Nurse or Doctor & try again ...')
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {consultants: consultant}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitConsultant: async (args, req) => {
    console.log("Resolver: deleteVisitConsultant...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const consultant = await User.findById({_id: args.consultantId})
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {consultants: consultant._id}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitComplaint: async (args, req) => {
    console.log("Resolver: addVisitComplaint...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const complaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis,
          attachments: [args.visitInput.complaintAttachment]
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {complaints: complaint}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitComplaint: async (args, req) => {
    console.log("Resolver: deleteVisitComplaint...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const complaintAttachments = args.visitInput.complaintAttachments.split(',');
        const complaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis,
          attachments: complaintAttachments
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {complaints: complaint}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitComplaintAttachment: async (args, req) => {
    console.log("Resolver: addVisitComplaintAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const complaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis
        }
        const newAttachment = args.visitInput.complaintAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'complaints.title': complaint.title,
            'complaints.description': complaint.description,
            'complaints.anamnesis': complaint.anamnesis
          },
          {$addToSet: {'complaints.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitComplaintAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitComplaintAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const complaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis
        }
        const attachment = args.visitInput.complaintAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'complaints.title': complaint.title,
            'complaints.description': complaint.description,
            'complaints.anamnesis': complaint.anamnesis
          },
          {$pull: {'complaints.$.attachments': attachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitSurvey: async (args, req) => {
    console.log("Resolver: addVisitSurvey...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription,
          attachments: [args.visitInput.surveyAttachment]
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {surveys: survey}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitSurvey: async (args, req) => {
    console.log("Resolver: deleteVisitSurvey...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.surveyAttachments.split(',');
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription,
          attachments: attachments
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {surveys: survey}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitSurveyAttachment: async (args, req) => {
    console.log("Resolver: addVisitSurveyAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription
        }
        const newAttachment = args.visitInput.surveyAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'surveys.title': survey.title,
            'surveys.description': survey.description
          },
          {$addToSet: {'surveys.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitSurveyAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitSurveyAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription
        }
        const oldAttachment = args.visitInput.surveyAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'surveys.title': survey.title,
            'surveys.description': survey.description
          },
          {$pull: {'surveys.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitSysInquiry: async (args, req) => {
    console.log("Resolver: addVisitSysInquiry...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription,
          attachments: [args.visitInput.systematicInquiryAttachment]
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {systematicInquiry: systematicInquiry}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitSysInquiry: async (args, req) => {
    console.log("Resolver: deleteVisitSysInquiry...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.systematicInquiryAttachments.split(',');
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription,
          attachments: attachments
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {systematicInquiry: systematicInquiry}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitSysInquiryAttachment: async (args, req) => {
    console.log("Resolver: addVisitSysInquiryAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription
        }
        const newAttachment = args.visitInput.systematicInquiryAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'systematicInquiry.title': systematicInquiry.title,
            'systematicInquiry.description': systematicInquiry.description
          },
          {$addToSet: {'systematicInquiry.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitSysInquiryAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitSysInquiryAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription
        }
        const oldAttachment = args.visitInput.systematicInquiryAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'systematicInquiry.title': systematicInquiry.title,
            'systematicInquiry.description': systematicInquiry.description
          },
          {$pull: {'systematicInquiry.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitVitals: async (args, req) => {
    console.log("Resolver: addVisitVitals...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const vitals = {
          pr: args.visitInput.vitalsPr,
          bp1: args.visitInput.vitalsBp1,
          bp2: args.visitInput.vitalsBp2,
          rr: args.visitInput.vitalsRr,
          temp: args.visitInput.vitalsTemp,
          ps02: args.visitInput.vitalsPs02,
          heightUnit: args.visitInput.vitalsHeightUnit,
          heightValue: args.visitInput.vitalsHeightValue,
          weightUnit: args.visitInput.vitalsWeightUnit,
          weightValue: args.visitInput.vitalsWeightValue,
          bmi: args.visitInput.vitalsBmi,
          urine: {
            type: args.visitInput.vitalsUrineType,
            value: args.visitInput.vitalsUrineValue
          }
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {vitals: vitals}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitVitals: async (args, req) => {
    console.log("Resolver: deleteVisitVitals...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const vitals = {
          pr: args.visitInput.vitalsPr,
          bp1: args.visitInput.vitalsBp1,
          bp2: args.visitInput.vitalsBp2,
          rr: args.visitInput.vitalsRr,
          temp: args.visitInput.vitalsTemp,
          ps02: args.visitInput.vitalsPs02,
          heightUnit: args.visitInput.vitalsHeightUnit,
          heightValue: args.visitInput.vitalsHeightValue,
          weightUnit: args.visitInput.vitalsWeightUnit,
          weightValue: args.visitInput.vitalsWeightValue,
          bmi: args.visitInput.vitalsBmi,
          urine: {
            type: args.visitInput.vitalsUrineType,
            value: args.visitInput.vitalsUrineValue
          }
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {vitals: vitals}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitExamination: async (args, req) => {
    console.log("Resolver: addVisitExamination...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          type: args.visitInput.examinationType,
          measure: args.visitInput.examinationMeasure,
          value: args.visitInput.examinationValue,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp,
          attachments: [args.visitInput.examinationAttachment]
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {examination: examination}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitExaminationAttachment: async (args, req) => {
    console.log("Resolver: addVisitExaminationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          type: args.visitInput.examinationType,
          measure: args.visitInput.examinationMeasure,
          value: args.visitInput.examinationValue,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp
        }
        const newAttachment = args.visitInput.examinationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'examination.general': examination.general,
            'examination.area': examination.area,
            'examination.type': examination.type,
            'examination.measure': examination.measure,
            'examination.value': examination.value,
            'examination.description': examination.description,
            'examination.followUp': examination.followUp
          },
          {$addToSet: {'examination.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitExaminationAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitExaminationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          type: args.visitInput.examinationType,
          measure: args.visitInput.examinationMeasure,
          value: args.visitInput.examinationValue,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp
        }
        const oldAttachment = args.visitInput.examinationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'examination.general': examination.general,
            'examination.area': examination.area,
            'examination.type': examination.type,
            'examination.measure': examination.measure,
            'examination.value': examination.value,
            'examination.description': examination.description,
            'examination.followUp': examination.followUp
          },
          {$pull: {'examination.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitExamination: async (args, req) => {
    console.log("Resolver: deleteVisitExamination...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.examinationAttachments.split(',');
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          type: args.visitInput.examinationType,
          measure: args.visitInput.examinationMeasure,
          value: args.visitInput.examinationValue,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp,
          attachments: attachments
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {examination: examination}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitInvestigation: async (args, req) => {
    console.log("Resolver: addVisitInvestigation...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const investigation = {
          type: args.visitInput.investigationType,
          title: args.visitInput.investigationTitle,
          description: args.visitInput.investigationDescription,
          attachments: [args.visitInput.investigationAttachment],
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {investigation: investigation}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitInvestigationAttachment: async (args, req) => {
    console.log("Resolver: addVisitInvestigationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const investigation = {
          type: args.visitInput.investigationType,
          title: args.visitInput.investigationTitle,
          description: args.visitInput.investigationDescription,
        }
        const newAttachment = args.visitInput.investigationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'investigation.type': investigation.type,
            'investigation.title': investigation.title,
            'investigation.description': investigation.description
          },
          {$addToSet: {'investigation.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitInvestigationAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitInvestigationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const investigation = {
          type: args.visitInput.investigationType,
          title: args.visitInput.investigationTitle,
          description: args.visitInput.investigationDescription,
        }
        const oldAttachment = args.visitInput.investigationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'investigation.type': investigation.type,
            'investigation.title': investigation.title,
            'investigation.description': investigation.description
          },
          {$pull: {'investigation.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitInvestigation: async (args, req) => {
    console.log("Resolver: deleteVisitInvestigation...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.investigationAttachments.split(',');
        const investigation = {
          type: args.visitInput.investigationType,
          title: args.visitInput.investigationTitle,
          description: args.visitInput.investigationDescription,
          attachments: attachments,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {investigation: investigation}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitDiagnosis: async (args, req) => {
    console.log("Resolver: addVisitDiagnosis...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const diagnosis = {
          type: args.visitInput.diagnosisType,
          title: args.visitInput.diagnosisTitle,
          description: args.visitInput.diagnosisDescription,
          attachments: [args.visitInput.diagnosisAttachment],
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {diagnosis: diagnosis}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitDiagnosisAttachment: async (args, req) => {
    console.log("Resolver: addVisitDiagnosisAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const diagnosis = {
          type: args.visitInput.diagnosisType,
          title: args.visitInput.diagnosisTitle,
          description: args.visitInput.diagnosisDescription,
        }
        const newAttachment = args.visitInput.diagnosisAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'diagnosis.type': diagnosis.type,
            'diagnosis.title': diagnosis.title,
            'diagnosis.description': diagnosis.description
          },
          {$addToSet: {'diagnosis.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitDiagnosisAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitDiagnosisAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const diagnosis = {
          type: args.visitInput.diagnosisType,
          title: args.visitInput.diagnosisTitle,
          description: args.visitInput.diagnosisDescription,
        }
        const oldAttachment = args.visitInput.diagnosisAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'diagnosis.type': diagnosis.type,
            'diagnosis.title': diagnosis.title,
            'diagnosis.description': diagnosis.description
          },
          {$pull: {'diagnosis.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitDiagnosis: async (args, req) => {
    console.log("Resolver: deleteVisitDiagnosis...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.diagnosisAttachments.split(',');
        const diagnosis = {
          type: args.visitInput.diagnosisType,
          title: args.visitInput.diagnosisTitle,
          description: args.visitInput.diagnosisDescription,
          attachments: attachments,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {diagnosis: diagnosis}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitTreatment: async (args, req) => {
    console.log("Resolver: addVisitTreatment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const treatment = {
          type: args.visitInput.treatmentType,
          title: args.visitInput.treatmentTitle,
          description: args.visitInput.treatmentDescription,
          dose: args.visitInput.treatmentDose,
          frequency: args.visitInput.treatmentFrequency,
          attachments: [args.visitInput.treatmentAttachment],
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {treatment: treatment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitTreatmentAttachment: async (args, req) => {
    console.log("Resolver: addVisitTreatmentAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const treatment = {
          type: args.visitInput.treatmentType,
          title: args.visitInput.treatmentTitle,
          description: args.visitInput.treatmentDescription,
          dose: args.visitInput.treatmentDose,
          frequency: args.visitInput.treatmentFrequency,
        }
        console.log('v',treatment);
        const newAttachment = args.visitInput.treatmentAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'treatment.type': treatment.type,
            'treatment.title': treatment.title,
            'treatment.description': treatment.description,
            'treatment.dose': treatment.dose,
            'treatment.frequency': treatment.frequency
          },
          {$addToSet: {'treatment.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitTreatmentAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitTreatmentAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const treatment = {
          type: args.visitInput.treatmentType,
          title: args.visitInput.treatmentTitle,
          description: args.visitInput.treatmentDescription,
          dose: args.visitInput.treatmentDose,
          frequency: args.visitInput.treatmentFrequency,
        }
        const oldAttachment = args.visitInput.treatmentAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'treatment.type': treatment.type,
            'treatment.title': treatment.title,
            'treatment.description': treatment.description,
            'treatment.dose': treatment.dose,
            'treatment.frequency': treatment.frequency
          },
          {$pull: {'treatment.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitTreatment: async (args, req) => {
    console.log("Resolver: deleteVisitTreatment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.treatmentAttachments.split(',');
        const treatment = {
          type: args.visitInput.treatmentType,
          title: args.visitInput.treatmentTitle,
          description: args.visitInput.treatmentDescription,
          attachments: attachments,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {treatment: treatment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitBilling: async (args, req) => {
    console.log("Resolver: addVisitBilling...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const billing = {
          title: args.visitInput.billingTitle,
          type: args.visitInput.billingType,
          description: args.visitInput.billingDescription,
          amount: args.visitInput.billingAmount,
          paid: args.visitInput.billingPaid,
          attachments: [args.visitInput.billingAttachment],
          notes: args.visitInput.billingNotes
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {billing: billing}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitBillingAttachment: async (args, req) => {
    console.log("Resolver: addVisitBillingAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const billing = {
          title: args.visitInput.billingTitle,
          type: args.visitInput.billingType,
          description: args.visitInput.billingDescription,
          amount: args.visitInput.billingAmount,
          paid: args.visitInput.billingPaid,
          notes: args.visitInput.billingNotes
        }
        const newAttachment = args.visitInput.billingAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'billing.title': billing.title,
            'billing.type': billing.type,
            'billing.description': billing.description,
            'billing.amount': billing.amount,
            'billing.paid': billing.paid,
            'billing.notes': billing.notes
          },
          {$addToSet: {'billing.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitBillingAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitBillingAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const billing = {
          title: args.visitInput.billingTitle,
          type: args.visitInput.billingType,
          description: args.visitInput.billingDescription,
          amount: args.visitInput.billingAmount,
          paid: args.visitInput.billingPaid,
          notes: args.visitInput.billingNotes
        }
        const oldAttachment = args.visitInput.billingAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'billing.title': billing.title,
            'billing.type': billing.type,
            'billing.description': billing.description,
            'billing.amount': billing.amount,
            'billing.paid': billing.paid,
            'billing.notes': billing.notes
          },
          {$pull: {'billing.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitBilling: async (args, req) => {
    console.log("Resolver: deleteVisitBilling...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const attachments = args.visitInput.billingAttachments.split(',');
        const billing = {
          title: args.visitInput.billingTitle,
          type: args.visitInput.billingType,
          description: args.visitInput.billingDescription,
          amount: args.visitInput.billingAmount,
          paid: args.visitInput.billingPaid,
          attachments: attachments,
          notes: args.visitInput.billingNotes
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {billing: billing}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitImage: async (args, req) => {
    console.log("Resolver: addVisitImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const image = {
          name: args.visitInput.imageName,
          type: args.visitInput.imageType,
          path: args.visitInput.imagePath
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {images: image}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitImage: async (args, req) => {
    console.log("Resolver: deleteVisitImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const image = {
          name: args.visitInput.imageName,
          type: args.visitInput.imageType,
          path: args.visitInput.imagePath
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {images: image}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitFile: async (args, req) => {
    console.log("Resolver: addVisitFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const file = {
          name: args.visitInput.fileName,
          type: args.visitInput.fileType,
          path: args.visitInput.filePath
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {files: file}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitFile: async (args, req) => {
    console.log("Resolver: deleteVisitFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const file = {
          name: args.visitInput.fileName,
          type: args.visitInput.fileType,
          path: args.visitInput.filePath
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {files: file}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  addVisitVigilance: async (args, req) => {
    console.log("Resolver: addVisitVigilance...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const vigilance = {
          chronicIllness: {
            diabetes: {
              medication: args.visitInput.vigilanceChronicIllnessDiabetesMedication,
              testing: args.visitInput.vigilanceChronicIllnessDiabetesTesting,
              comment: args.visitInput.vigilanceChronicIllnessDiabetesComment
            },
            hbp: {
              medication: args.visitInput.vigilanceChronicIllnessHbpMedication,
              testing: args.visitInput.vigilanceChronicIllnessHbpTesting,
              comment: args.visitInput.vigilanceChronicIllnessHbpComment
            },
            dyslipidemia: {
              medication: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaMedication,
              testing: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaTesting,
              comment: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaComment
            },
            cad: {
              medication: args.visitInput.vigilanceChronicIllnessCadMedication,
              testing: args.visitInput.vigilanceChronicIllnessCadTesting,
              comment: args.visitInput.vigilanceChronicIllnessCadComment
            }
          },
          lifestyle: {
            weight: {
              medication: args.visitInput.vigilanceLifestyleWeightMedication,
              testing: args.visitInput.vigilanceLifestyleWeightTesting,
              comment: args.visitInput.vigilanceLifestyleWeightComment
            },
            diet: {
              medication: args.visitInput.vigilanceLifestyleDietMedication,
              testing: args.visitInput.vigilanceLifestyleDietTesting,
              comment: args.visitInput.vigilanceLifestyleDietComment
            },
            smoking: {
              medication: args.visitInput.vigilanceLifestyleSmokingMedication,
              testing: args.visitInput.vigilanceLifestyleSmokingTesting,
              comment: args.visitInput.vigilanceLifestyleSmokingComment
            },
            substanceAbuse: {
              medication: args.visitInput.vigilanceLifestyleSubstanceAbuseMedication,
              testing: args.visitInput.vigilanceLifestyleSubstanceAbuseTesting,
              comment: args.visitInput.vigilanceLifestyleSubstanceAbuseComment
            },
            exercise: {
              medication: args.visitInput.vigilanceLifestyleExerciseMedication,
              testing: args.visitInput.vigilanceLifestyleExerciseTesting,
              comment: args.visitInput.vigilanceLifestyleExerciseComment
            },
            allergies: {
              medication: args.visitInput.vigilanceLifestyleAllergiesMedication,
              testing: args.visitInput.vigilanceLifestyleAllergiesTesting,
              comment: args.visitInput.vigilanceLifestyleAllergiesComment
            },
            asthma: {
              medication: args.visitInput.vigilanceLifestyleAsthmaMedication,
              testing: args.visitInput.vigilanceLifestyleAsthmaTesting,
              comment: args.visitInput.vigilanceLifestyleAsthmaComment
            }
          },
          screening: {
            breast: {
              medication: args.visitInput.vigilanceScreeningBreastMedication,
              testing: args.visitInput.vigilanceScreeningBreastTesting,
              comment: args.visitInput.vigilanceScreeningBreastComment
            },
            prostate: {
              medication: args.visitInput.vigilanceScreeningProstateMedication,
              testing: args.visitInput.vigilanceScreeningProstateTesting,
              comment: args.visitInput.vigilanceScreeningProstateComment
            },
            cervix: {
              medication: args.visitInput.vigilanceScreeningCervixMedication,
              testing: args.visitInput.vigilanceScreeningCervixTesting,
              comment: args.visitInput.vigilanceScreeningCervixComment
            },
            colon: {
              medication: args.visitInput.vigilanceScreeningColonMedication,
              testing: args.visitInput.vigilanceScreeningColonTesting,
              comment: args.visitInput.vigilanceScreeningColonComment
            },
            dental: {
              medication: args.visitInput.vigilanceScreeningDentalMedication,
              testing: args.visitInput.vigilanceScreeningDentalTesting,
              comment: args.visitInput.vigilanceScreeningDentalComment
            }
          },
          vaccines: {
            influenza: {
              medication: args.visitInput.vigilanceVaccinesInfluenzaMedication,
              testing: args.visitInput.vigilanceVaccinesInfluenzaTesting,
              comment: args.visitInput.vigilanceVaccinesInfluenzaComment
            },
            varicella: {
              medication: args.visitInput.vigilanceVaccinesVaricellaMedication,
              testing: args.visitInput.vigilanceVaccinesVaricellaTesting,
              comment: args.visitInput.vigilanceVaccinesVaricellaComment
            },
            hpv: {
              medication: args.visitInput.vigilanceVaccinesHpvMedication,
              testing: args.visitInput.vigilanceVaccinesHpvTesting,
              comment: args.visitInput.vigilanceVaccinesHpvComment
            },
            mmr: {
              medication: args.visitInput.vigilanceVaccinesMmrMedication,
              testing: args.visitInput.vigilanceVaccinesMmrTesting,
              comment: args.visitInput.vigilanceVaccinesMmrComment
            },
            tetanus: {
              medication: args.visitInput.vigilanceVaccinesTetanusMedication,
              testing: args.visitInput.vigilanceVaccinesTetanusTesting,
              comment: args.visitInput.vigilanceVaccinesTetanusComment
            },
            pneumovax: {
              medication: args.visitInput.vigilanceVaccinesPneumovaxMedication,
              testing: args.visitInput.vigilanceVaccinesPneumovaxTesting,
              comment: args.visitInput.vigilanceVaccinesPneumovaxComment
            },
            other: {
              name: args.visitInput.vigilanceVaccinesOtherName,
              medication: args.visitInput.vigilanceVaccinesOtherMedication,
              testing: args.visitInput.vigilanceVaccinesOtherTesting,
              comment: args.visitInput.vigilanceVaccinesOtherComment
            }
          }
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {vigilance: vigilance}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitVigilance: async (args, req) => {
    console.log("Resolver: deleteVisitVigilance...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const vigilance = {
          chronicIllness: {
            diabetes: {
              medication: args.visitInput.vigilanceChronicIllnessDiabetesMedication,
              testing: args.visitInput.vigilanceChronicIllnessDiabetesTesting,
              comment: args.visitInput.vigilanceChronicIllnessDiabetesComment
            },
            hbp: {
              medication: args.visitInput.vigilanceChronicIllnessHbpMedication,
              testing: args.visitInput.vigilanceChronicIllnessHbpTesting,
              comment: args.visitInput.vigilanceChronicIllnessHbpComment
            },
            dyslipidemia: {
              medication: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaMedication,
              testing: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaTesting,
              comment: args.visitInput.vigilanceChronicIllnessHbpDyslipidemiaComment
            },
            cad: {
              medication: args.visitInput.vigilanceChronicIllnessCadMedication,
              testing: args.visitInput.vigilanceChronicIllnessCadTesting,
              comment: args.visitInput.vigilanceChronicIllnessCadComment
            }
          },
          lifestyle: {
            weight: {
              medication: args.visitInput.vigilanceLifestyleWeightMedication,
              testing: args.visitInput.vigilanceLifestyleWeightTesting,
              comment: args.visitInput.vigilanceLifestyleWeightComment
            },
            diet: {
              medication: args.visitInput.vigilanceLifestyleDietMedication,
              testing: args.visitInput.vigilanceLifestyleDietTesting,
              comment: args.visitInput.vigilanceLifestyleDietComment
            },
            smoking: {
              medication: args.visitInput.vigilanceLifestyleSmokingMedication,
              testing: args.visitInput.vigilanceLifestyleSmokingTesting,
              comment: args.visitInput.vigilanceLifestyleSmokingComment
            },
            substanceAbuse: {
              medication: args.visitInput.vigilanceLifestyleSubstanceAbuseMedication,
              testing: args.visitInput.vigilanceLifestyleSubstanceAbuseTesting,
              comment: args.visitInput.vigilanceLifestyleSubstanceAbuseComment
            },
            exercise: {
              medication: args.visitInput.vigilanceLifestyleExerciseMedication,
              testing: args.visitInput.vigilanceLifestyleExerciseTesting,
              comment: args.visitInput.vigilanceLifestyleExerciseComment
            },
            allergies: {
              medication: args.visitInput.vigilanceLifestyleAllergiesMedication,
              testing: args.visitInput.vigilanceLifestyleAllergiesTesting,
              comment: args.visitInput.vigilanceLifestyleAllergiesComment
            },
            asthma: {
              medication: args.visitInput.vigilanceLifestyleAsthmaMedication,
              testing: args.visitInput.vigilanceLifestyleAsthmaTesting,
              comment: args.visitInput.vigilanceLifestyleAsthmaComment
            }
          },
          screening: {
            breast: {
              medication: args.visitInput.vigilanceScreeningBreastMedication,
              testing: args.visitInput.vigilanceScreeningBreastTesting,
              comment: args.visitInput.vigilanceScreeningBreastComment
            },
            prostate: {
              medication: args.visitInput.vigilanceScreeningProstateMedication,
              testing: args.visitInput.vigilanceScreeningProstateTesting,
              comment: args.visitInput.vigilanceScreeningProstateComment
            },
            cervix: {
              medication: args.visitInput.vigilanceScreeningCervixMedication,
              testing: args.visitInput.vigilanceScreeningCervixTesting,
              comment: args.visitInput.vigilanceScreeningCervixComment
            },
            colon: {
              medication: args.visitInput.vigilanceScreeningColonMedication,
              testing: args.visitInput.vigilanceScreeningColonTesting,
              comment: args.visitInput.vigilanceScreeningColonComment
            },
            dental: {
              medication: args.visitInput.vigilanceScreeningDentalMedication,
              testing: args.visitInput.vigilanceScreeningDentalTesting,
              comment: args.visitInput.vigilanceScreeningDentalComment
            }
          },
          vaccines: {
            influenza: {
              medication: args.visitInput.vigilanceVaccinesInfluenzaMedication,
              testing: args.visitInput.vigilanceVaccinesInfluenzaTesting,
              comment: args.visitInput.vigilanceVaccinesInfluenzaComment
            },
            varicella: {
              medication: args.visitInput.vigilanceVaccinesVaricellaMedication,
              testing: args.visitInput.vigilanceVaccinesVaricellaTesting,
              comment: args.visitInput.vigilanceVaccinesVaricellaComment
            },
            hpv: {
              medication: args.visitInput.vigilanceVaccinesHpvMedication,
              testing: args.visitInput.vigilanceVaccinesHpvTesting,
              comment: args.visitInput.vigilanceVaccinesHpvComment
            },
            mmr: {
              medication: args.visitInput.vigilanceVaccinesMmrMedication,
              testing: args.visitInput.vigilanceVaccinesMmrTesting,
              comment: args.visitInput.vigilanceVaccinesMmrComment
            },
            tetanus: {
              medication: args.visitInput.vigilanceVaccinesTetanusMedication,
              testing: args.visitInput.vigilanceVaccinesTetanusTesting,
              comment: args.visitInput.vigilanceVaccinesTetanusComment
            },
            pneumovax: {
              medication: args.visitInput.vigilanceVaccinesPneumovaxMedication,
              testing: args.visitInput.vigilanceVaccinesPneumovaxTesting,
              comment: args.visitInput.vigilanceVaccinesPneumovaxComment
            },
            other: {
              name: args.visitInput.vigilanceVaccinesOtherName,
              medication: args.visitInput.vigilanceVaccinesOtherMedication,
              testing: args.visitInput.vigilanceVaccinesOtherTesting,
              comment: args.visitInput.vigilanceVaccinesOtherComment
            }
          }
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {vigilance: vigilance}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteVisitById: async (args, req) => {
    console.log("Resolver: deleteVisitById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const visit = await Visit.findByIdAndRemove({_id:args.visitId});
        return {
          ...visit._doc,
          _id: visit.id,
          title: visit.title,
          date: visit.date
        };
    } catch (err) {
      throw err;
    }
  },
  createVisit: async (args, req) => {
    console.log("Resolver: createVisit...");
    try {

      const appointment = await Appointment.findById({_id: args.appointmentId})
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      const consultants = appointment.consultants;
      const patient = appointment.patient;
      // console.log('appointment',appointment);
      const today = moment();
      const dateTime = moment(appointment.date).format('YYYY-MM-DD')+'T'+appointment.time+'';
      console.log('x',appointment.date,appointment.time,dateTime);
      console.log('y',moment(),moment(dateTime),moment(appointment.date).add(1,'d'));
      console.log('z',moment().format('YYYY-MM-DD'),moment(appointment.date).format('YYYY-MM-DD'));
      // console.log('too late', moment().format('YYYY-MM-DD') > moment(appointment.date).add(1,'d').format('YYYY-MM-DD'));
      // console.log('too early', moment().format('YYYY-MM-DD') < moment(appointment.date).add(1,'d').format('YYYY-MM-DD'));
      // console.log('on time', moment().format('YYYY-MM-DD') === moment(appointment.date).add(1,'d').format('YYYY-MM-DD'));
      const tooEarly = moment().format('YYYY-MM-DD') < moment(appointment.date).format('YYYY-MM-DD');
      const tooLate = moment().format('YYYY-MM-DD') > moment(appointment.date).format('YYYY-MM-DD');
      const onSchedule = moment().format('YYYY-MM-DD') === moment(appointment.date).add(1,'d').format('YYYY-MM-DD');

      if (tooEarly === true) {
        console.log('...appointment for this visit is in the future...please wait or create a new appointment...');
        throw new Error('...appointment for this visit is in the future...please wait or create a new appointment...');
      }
      if (tooLate === true) {
        console.log('...appointment for this visit has already gone... please create a new appointment...');
        throw new Error('...appointment for this visit has already gone... please create a new appointment...');
      }

      let date = moment().format('YYYY-MM-DD');

      const visitExists = await Visit.find({
          date: date,
          title: args.visitInput.title,
          patient: patient._id
      })
      if (visitExists.length > 0) {
        console.log('...a visit w/ this date, title & patient exists already...check your info and try again...');
        throw new Error('...a visit w/ this date, title & patient exists already...check your info and try again...')
      }

      const visit = new Visit({
        date: date,
        time: appointment.time,
        title: args.visitInput.title,
        type: args.visitInput.type,
        subType: args.visitInput.subType,
        patient: patient,
        consultants: consultants,
        appointment: appointment,
        complaints: [],
        surveys: [],
        systematicInquiry: [],
        vitals: [],
        examination: [],
        investigation: [],
        diagnosis: [],
        treatment: [],
        billing: [],
        vigilance: [],
        images: [],
        files: []
      });
      // console.log('visit', visit);

      const result = await visit.save();
      const updatePatient = await Patient.findOneAndUpdate(
        {_id: patient._id},
        {$addToSet: {visits: result}},
        {new: true, useFindAndModify: false}
      )
      const updateAppointment = await Appointment.findOneAndUpdate(
        {_id: appointment},
        {visit: result},
        {new: true, useFindAndModify: false}
      )


      // console.log('start');
      // for (let index = 0; index < array.length; index++) {
      //   let consultant = array[index];
      //   console.log('loop',index);
      //
      // }
      // console.log('end');

      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};
