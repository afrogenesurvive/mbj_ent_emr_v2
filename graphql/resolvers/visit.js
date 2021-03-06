const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const Appointment = require('../../models/appointment');
const Visit = require('../../models/visit');
const Reminder = require('../../models/reminder');
const Queue = require('../../models/queue');
const util = require('util');
const mongoose = require('mongoose');
// const moment = require('moment');
const moment = require('moment-timezone');
const mailgun = require("mailgun-js");
// const puppeteer = require('puppeteer');

const { transformVisit } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  formatNewVisitProps: async (args, req) => {
    console.log("Resolver: formatNewVisitProps...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      let allUserIds2 = [];
      let allUserIds = await User.find({});
      allUserIds.map(user => {
        allUserIds2.push(user._id);
      })
      console.log('allUserIds',allUserIds2);
      for(const value of allUserIds2) {
        let compUser = await User.findOneAndUpdate(
          {_id:value},
          // {
          //   'attendance.$[].highlighted': false,
          //   'leave.$[].highlighted': false,
          //   'images.$[].highlighted': false,
          //   'files.$[].highlighted': false,
          // },
          // {'notes.$[]': {
          //   note: '',
          //   highlighted: false
          // }},
          {$unset: {"attendance.$[]._id": 1}},
          {new: true, useFindAndModify: false}
        )
      }

      let allPatientIds2 = [];
      let allPatientIds = await Patient.find({});
      allPatientIds.map(patient => {
        allPatientIds2.push(patient._id);
      })
      console.log('allPatientIds',allPatientIds2);
      // for(const value of allPatientIds2) {
      //   let compPatient = await Patient.findOneAndUpdate(
      //     {_id:value},
      //     {
      //       'nextOfKin.$[].highlighted': false,
      //       'allergies.$[].highlighted': false,
      //       'medication.$[].highlighted': false,
      //       'medication.$[].dosage': "",
      //       'images.$[].highlighted': false,
      //       'files.$[].highlighted': false,
      //       'comorbidities.$[].highlighted': false,
      //     },
      //     // {'notes.$[]': {
      //     //   note: '',
      //     //   highlighted: false
      //     // }},
      //     {new: true, useFindAndModify: false}
      //   )
      // }

      let allVisitIds2 = [];
      let allVisitIds = await Visit.find({});
      allVisitIds.map(visit => {
        allVisitIds2.push(visit._id);
      })
      console.log('allVisitIds',allVisitIds2);
      for(const value of allVisitIds2) {
        console.log(value);
        let compVisit = await Visit.findOneAndUpdate(
          {_id:value},
          // {
          //   'complaints.$[].highlighted': false,
          //   'surveys.$[].highlighted': false,
          //   'systematicInquiry.$[].highlighted': false,
          //   'vitals.$[].highlighted': false,
          //   'examination.$[].highlighted': false,
          //   'investigation.$[].highlighted': false,
          //   'diagnosis.$[].highlighted': false,
          //   'treatment.$[].highlighted': false,
          //   'billing.$[].highlighted': false,
          //   'vigilance.$[].highlighted': false,
          //   'images.$[].highlighted': false,
          //   'files.$[].highlighted': false,
          // },
          // {'notes.$[]': {
          //   note: '',
          //   highlighted: false
          // }},
          // {
          //   'vitals.$[].sp02': 0
          // },
          // {$unset: {"vitals.$[].ps02": 1}},
          // {$unset: {"vitals.$[]._id": 1}},
          {'examination.$[]': {
            general: '',
            area: '',
            inspection: '',
            palpation: '',
            percussion: '',
            auscultation: '',
            description: '',
            followUp: false,
            attachments: [],
            highlighted: false
          }},
          {new: true, useFindAndModify: false}
        )
      }


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
        )
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
        )
        .populate('consultants')
        .populate('appointment')
        .populate('patient');
        const updateConsultant = await User.findOneAndUpdate(
          {_id:args.consultantId},
          {$addToSet: {visits: visit}},
          {new: true, useFindAndModify: false}
        )
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
        )
        .populate('consultants')
        .populate('appointment')
        .populate('patient');
        const updateConsultant = await User.findOneAndUpdate(
          {_id:args.consultantId},
          {$pull: {visits: visit._id}},
          {new: true, useFindAndModify: false}
        )
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
  updatePatientAddress: async (args, req) => {
    console.log("Resolver: updatePatientAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const oldAddress = {
          number: args.patientInput.addressNumber,
          street: args.patientInput.addressStreet,
          town: args.patientInput.addressTown,
          city: args.patientInput.addressCity,
          parish: args.patientInput.addressParish,
          country: args.patientInput.addressCountry,
          postalCode: args.patientInput.addressPostalCode,
          primary: args.patientInput.addressPrimary
        };
        const newAddress = {
          number: args.patientInput2.addressNumber,
          street: args.patientInput2.addressStreet,
          town: args.patientInput2.addressTown,
          city: args.patientInput2.addressCity,
          parish: args.patientInput2.addressParish,
          country: args.patientInput2.addressCountry,
          postalCode: args.patientInput2.addressPostalCode,
          primary: args.patientInput2.addressPrimary
        };

        const patient = await Patient.findOneAndUpdate(
          {
            _id:args.patientId,
            addresses: oldAddress
          },
          { 'addresses.$': newAddress },
          {new: true, useFindAndModify: false}
        )
        .populate('appointments')
        .populate({
           path: 'appointments',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
        .populate('visits')
        .populate({
           path: 'visits',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
        .populate('reminders');

        return {
          ...patient._doc,
          _id: patient.id,
          email: patient.contact.email ,
          name: patient.name,
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
          attachments: [args.visitInput.complaintAttachment],
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {complaints: complaint}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitComplaint: async (args, req) => {
    console.log("Resolver: updateVisitComplaint...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      console.log(args);
        const oldComplaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis,
          attachments: args.visitInput.complaintAttachments.split(','),
          highlighted: args.visitInput.complaintHighlighted,
        }

        const newComplaint = {
          title: args.visitInput2.complaintTitle,
          description: args.visitInput2.complaintDescription,
          anamnesis: args.visitInput2.complaintAnamnesis,
          attachments: args.visitInput2.complaintAttachments.split(','),
          highlighted: args.visitInput2.complaintHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,complaints: oldComplaint},
          {'complaints.$': newComplaint},
          {new: true, useFindAndModify: false}
        )
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
          attachments: complaintAttachments,
          highlighted: args.visitInput.complaintHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {complaints: complaint}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitComplaintHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitComplaintHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const complaintAttachments = args.visitInput.complaintAttachments.split(',');
        const complaint = {
          title: args.visitInput.complaintTitle,
          description: args.visitInput.complaintDescription,
          anamnesis: args.visitInput.complaintAnamnesis,
          attachments: complaintAttachments,
          highlighted: args.visitInput.complaintHighlighted,
        }
        let newHighlighted;
        if (args.visitInput.complaintHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.complaintHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            complaints: complaint
          },
          {'complaints.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
        console.log('foo',complaint);
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'complaints.title': complaint.title,
            'complaints.description': complaint.description,
            'complaints.anamnesis': complaint.anamnesis
          },
          {$addToSet: {'complaints.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        )
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
        )
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
  addVisitSurvey: async (args, req) => {
    console.log("Resolver: addVisitSurvey...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription,
          attachments: [args.visitInput.surveyAttachment],
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {surveys: survey}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitSurvey: async (args, req) => {
    console.log("Resolver: updateVisitSurvey...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const oldSurvey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription,
          attachments: args.visitInput.surveyAttachments.split(','),
          highlighted: args.visitInput.surveyHighlighted,
        }
        const newSurvey = {
          title: args.visitInput2.surveyTitle,
          description: args.visitInput2.surveyDescription,
          attachments: args.visitInput2.surveyAttachments.split(','),
          highlighted: args.visitInput2.surveyHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,surveys: oldSurvey},
          {'surveys.$': newSurvey},
          {new: true, useFindAndModify: false}
        )
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
          attachments: attachments,
          highlighted: args.visitInput.surveyHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {surveys: survey}},
          {new: true, useFindAndModify: false}
        )
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
        )
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
        )
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
  toggleVisitSurveyHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitSurveyHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const surveyAttachments = args.visitInput.surveyAttachments.split(',');
        const survey = {
          title: args.visitInput.surveyTitle,
          description: args.visitInput.surveyDescription,
          attachments: surveyAttachments,
          highlighted: args.visitInput.surveyHighlighted,
        }
        let newHighlighted;
        if (args.visitInput.surveyHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.surveyHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            surveys: survey
          },
          {'surveys.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
  addVisitSysInquiry: async (args, req) => {
    console.log("Resolver: addVisitSysInquiry...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription,
          attachments: [args.visitInput.systematicInquiryAttachment],
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {systematicInquiry: systematicInquiry}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitSysInquiry: async (args, req) => {
    console.log("Resolver: updateVisitSysInquiry...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const oldSystematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription,
          attachments: args.visitInput.systematicInquiryAttachments.split(','),
          highlighted: args.visitInput.systematicInquiryHighlighted,
        }
        const newSystematicInquiry = {
          title: args.visitInput2.systematicInquiryTitle,
          description: args.visitInput2.systematicInquiryDescription,
          attachments: args.visitInput2.systematicInquiryAttachments.split(','),
          highlighted: args.visitInput2.systematicInquiryHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,systematicInquiry: oldSystematicInquiry},
          {'systematicInquiry.$': newSystematicInquiry},
          {new: true, useFindAndModify: false}
        )
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
          attachments: attachments,
          highlighted: args.visitInput.systematicInquiryHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {systematicInquiry: systematicInquiry}},
          {new: true, useFindAndModify: false}
        )
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
        )
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
        )
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
  toggleVisitSysInquiryHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitSysInquiryHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const systematicInquiryAttachments = args.visitInput.systematicInquiryAttachments.split(',');
        const systematicInquiry = {
          title: args.visitInput.systematicInquiryTitle,
          description: args.visitInput.systematicInquiryDescription,
          attachments: systematicInquiryAttachments,
          highlighted: args.visitInput.systematicInquiryHighlighted,
        }
        let newHighlighted;
        if (args.visitInput.systematicInquiryHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.systematicInquiryHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            systematicInquiry: systematicInquiry
          },
          {'systematicInquiry.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
          sp02: args.visitInput.vitalsSp02,
          heightUnit: args.visitInput.vitalsHeightUnit,
          heightValue: args.visitInput.vitalsHeightValue,
          weightUnit: args.visitInput.vitalsWeightUnit,
          weightValue: args.visitInput.vitalsWeightValue,
          bmi: args.visitInput.vitalsBmi,
          urine: {
            type: args.visitInput.vitalsUrineType,
            value: args.visitInput.vitalsUrineValue
          },
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {vitals: vitals}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitVitals: async (args, req) => {
    console.log("Resolver: updateVisitVitals...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldVitals = {
        pr: args.visitInput.vitalsPr,
        bp1: args.visitInput.vitalsBp1,
        bp2: args.visitInput.vitalsBp2,
        rr: args.visitInput.vitalsRr,
        temp: args.visitInput.vitalsTemp,
        sp02: args.visitInput.vitalsSp02,
        heightUnit: args.visitInput.vitalsHeightUnit,
        heightValue: args.visitInput.vitalsHeightValue,
        weightUnit: args.visitInput.vitalsWeightUnit,
        weightValue: args.visitInput.vitalsWeightValue,
        bmi: args.visitInput.vitalsBmi,
        urine: {
          type: args.visitInput.vitalsUrineType,
          value: args.visitInput.vitalsUrineValue
        },
        highlighted: args.visitInput.vitalsHighlighted,
      }
      const newVitals = {
        pr: args.visitInput2.vitalsPr,
        bp1: args.visitInput2.vitalsBp1,
        bp2: args.visitInput2.vitalsBp2,
        rr: args.visitInput2.vitalsRr,
        temp: args.visitInput2.vitalsTemp,
        sp02: args.visitInput2.vitalsSp02,
        heightUnit: args.visitInput2.vitalsHeightUnit,
        heightValue: args.visitInput2.vitalsHeightValue,
        weightUnit: args.visitInput2.vitalsWeightUnit,
        weightValue: args.visitInput2.vitalsWeightValue,
        bmi: args.visitInput2.vitalsBmi,
        urine: {
          type: args.visitInput2.vitalsUrineType,
          value: args.visitInput2.vitalsUrineValue
        },
        highlighted: args.visitInput2.vitalsHighlighted,
      }


        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,vitals: oldVitals},
          {'vitals.$': newVitals},
          {new: true, useFindAndModify: false}
        )
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
          sp02: args.visitInput.vitalsSp02,
          heightUnit: args.visitInput.vitalsHeightUnit,
          heightValue: args.visitInput.vitalsHeightValue,
          weightUnit: args.visitInput.vitalsWeightUnit,
          weightValue: args.visitInput.vitalsWeightValue,
          bmi: args.visitInput.vitalsBmi,
          urine: {
            type: args.visitInput.vitalsUrineType,
            value: args.visitInput.vitalsUrineValue
          },
          highlighted: args.visitInput.vitalsHighlighted,
        }
        // console.log('vitals',vitals);
        // const visitx = await Visit.find(
        //   {_id:args.visitId ,vitals: vitals}
        // )
        // console.log('visitx',visitx);

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {vitals: vitals}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitVitalsHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitVitalsHighlighted...");
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
        sp02: args.visitInput.vitalsSp02,
        heightUnit: args.visitInput.vitalsHeightUnit,
        heightValue: args.visitInput.vitalsHeightValue,
        weightUnit: args.visitInput.vitalsWeightUnit,
        weightValue: args.visitInput.vitalsWeightValue,
        bmi: args.visitInput.vitalsBmi,
        urine: {
          type: args.visitInput.vitalsUrineType,
          value: args.visitInput.vitalsUrineValue
        },
        highlighted: args.visitInput.vitalsHighlighted,
      }

      let newHighlighted;
      if (args.visitInput.vitalsHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.visitInput.vitalsHighlighted;
      }

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId,
          vitals: vitals
        },
        {'vitals.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
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
  addVisitExamination: async (args, req) => {
    console.log("Resolver: addVisitExamination...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          inspection: args.visitInput.examinationInspection,
          palpation: args.visitInput.examinationPalpation,
          percussion: args.visitInput.examinationPercussion,
          auscultation: args.visitInput.examinationAuscultation,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp,
          attachments: [args.visitInput.examinationAttachment],
          highlighted: false,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {examination: examination}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitExamination: async (args, req) => {
    console.log("Resolver: updateVisitExamination...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldExamination = {
        general: args.visitInput.examinationGeneral,
        area: args.visitInput.examinationArea,
        inspection: args.visitInput.examinationInspection,
        palpation: args.visitInput.examinationPalpation,
        percussion: args.visitInput.examinationPercussion,
        auscultation: args.visitInput.examinationAuscultation,
        description: args.visitInput.examinationDescription,
        followUp: args.visitInput.examinationFollowUp,
        attachments: args.visitInput.examinationAttachments.split(','),
        highlighted: args.visitInput.examinationHighlighted,
      }
      const newExamination = {
        general: args.visitInput2.examinationGeneral,
        area: args.visitInput2.examinationArea,
        inspection: args.visitInput2.examinationInspection,
        palpation: args.visitInput2.examinationPalpation,
        percussion: args.visitInput2.examinationPercussion,
        auscultation: args.visitInput2.examinationAuscultation,
        description: args.visitInput2.examinationDescription,
        followUp: args.visitInput2.examinationFollowUp,
        attachments: args.visitInput2.examinationAttachments.split(','),
        highlighted: args.visitInput2.examinationHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,examination: oldExamination},
          {'examination.$': newExamination},
          {new: true, useFindAndModify: false}
        )
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
  addVisitExaminationAttachment: async (args, req) => {
    console.log("Resolver: addVisitExaminationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          inspection: args.visitInput.examinationInspection,
          palpation: args.visitInput.examinationPalpation,
          percussion: args.visitInput.examinationPercussion,
          auscultation: args.visitInput.examinationAuscultation,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp
        }
        const newAttachment = args.visitInput.examinationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'examination.general': examination.general,
            'examination.area': examination.area,
            'examination.inspection': examination.inspection,
            'examination.palpation': examination.palpation,
            'examination.percussion': examination.percussion,
            'examination.auscultation': examination.auscultation,
            'examination.description': examination.description,
            'examination.followUp': examination.followUp
          },
          {$addToSet: {'examination.$.attachments': newAttachment}},
          {new: true, useFindAndModify: false}
        )
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
  deleteVisitExaminationAttachment: async (args, req) => {
    console.log("Resolver: deleteVisitExaminationAttachment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          inspection: args.visitInput.examinationInspection,
          palpation: args.visitInput.examinationPalpation,
          percussion: args.visitInput.examinationPercussion,
          auscultation: args.visitInput.examinationAuscultation,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp
        }
        const oldAttachment = args.visitInput.examinationAttachment;
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'examination.general': examination.general,
            'examination.area': examination.area,
            'examination.inspection': examination.inspection,
            'examination.palpation': examination.palpation,
            'examination.percussion': examination.percussion,
            'examination.auscultation': examination.auscultation,
            'examination.description': examination.description,
            'examination.followUp': examination.followUp
          },
          {$pull: {'examination.$.attachments': oldAttachment}},
          {new: true, useFindAndModify: false}
        )
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
          inspection: args.visitInput.examinationInspection,
          palpation: args.visitInput.examinationPalpation,
          percussion: args.visitInput.examinationPercussion,
          auscultation: args.visitInput.examinationAuscultation,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp,
          attachments: attachments,
          highlighted: args.visitInput.examinationHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {examination: examination}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitExaminationHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitExaminationHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const attachments = args.visitInput.examinationAttachments.split(',');
        const examination = {
          general: args.visitInput.examinationGeneral,
          area: args.visitInput.examinationArea,
          inspection: args.visitInput.examinationInspection,
          palpation: args.visitInput.examinationPalpation,
          percussion: args.visitInput.examinationPercussion,
          auscultation: args.visitInput.examinationAuscultation,
          description: args.visitInput.examinationDescription,
          followUp: args.visitInput.examinationFollowUp,
          attachments: attachments,
          highlighted: args.visitInput.examinationHighlighted,
        }
        let newHighlighted;
        if (args.visitInput.examinationHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.examinationHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            examination: examination
          },
          {'examination.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
          highlighted: false,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {investigation: investigation}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitInvestigation: async (args, req) => {
    console.log("Resolver: updateVisitInvestigation...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldInvestigation = {
        type: args.visitInput.investigationType,
        title: args.visitInput.investigationTitle,
        description: args.visitInput.investigationDescription,
        attachments: args.visitInput.investigationAttachments.split(','),
        highlighted: args.visitInput.investigationHighlighted,
      }
      const newInvestigation = {
        type: args.visitInput2.investigationType,
        title: args.visitInput2.investigationTitle,
        description: args.visitInput2.investigationDescription,
        attachments: args.visitInput2.investigationAttachments.split(','),
        highlighted: args.visitInput2.investigationHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,investigation: oldInvestigation},
          {'investigation.$': newInvestigation},
          {new: true, useFindAndModify: false}
        )
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
        )
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
        )
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
          highlighted: args.visitInput.investigationHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {investigation: investigation}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitInvestigationHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitInvestigationHighlighted...");
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
          highlighted: args.visitInput.investigationHighlighted,
        }
        let newHighlighted;
        if (args.visitInput.investigationHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.investigationHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            investigation: investigation
          },
          {'investigation.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {diagnosis: diagnosis}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitDiagnosis: async (args, req) => {
    console.log("Resolver: updateVisitDiagnosis...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldDiagnosis = {
        type: args.visitInput.diagnosisType,
        title: args.visitInput.diagnosisTitle,
        description: args.visitInput.diagnosisDescription,
        attachments: args.visitInput.diagnosisAttachments.split(','),
        highlighted: args.visitInput.diagnosisHighlighted,
      }
      const newDiagnosis = {
        type: args.visitInput2.diagnosisType,
        title: args.visitInput2.diagnosisTitle,
        description: args.visitInput2.diagnosisDescription,
        attachments: args.visitInput2.diagnosisAttachments.split(','),
        highlighted: args.visitInput2.diagnosisHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,diagnosis: oldDiagnosis},
          {'diagnosis.$': newDiagnosis},
          {new: true, useFindAndModify: false}
        )
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
        )
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
        )
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
          highlighted: args.visitInput.diagnosisHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {diagnosis: diagnosis}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitDiagnosisHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitDiagnosisHighlighted...");
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
        highlighted: args.visitInput.diagnosisHighlighted,
      }

        let newHighlighted;
        if (args.visitInput.diagnosisHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.diagnosisHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            diagnosis: diagnosis
          },
          {'diagnosis.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {treatment: treatment}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitTreatment: async (args, req) => {
    console.log("Resolver: updateVisitTreatment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldTreatment = {
        type: args.visitInput.treatmentType,
        title: args.visitInput.treatmentTitle,
        description: args.visitInput.treatmentDescription,
        dose: args.visitInput.treatmentDose,
        frequency: args.visitInput.treatmentFrequency,
        attachments: args.visitInput.treatmentAttachments.split(','),
        highlighted: args.visitInput.treatmentHighlighted,
      }
      const newTreatment = {
        type: args.visitInput2.treatmentType,
        title: args.visitInput2.treatmentTitle,
        description: args.visitInput2.treatmentDescription,
        dose: args.visitInput2.treatmentDose,
        frequency: args.visitInput2.treatmentFrequency,
        attachments: args.visitInput2.treatmentAttachments.split(','),
        highlighted: args.visitInput2.treatmentHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,treatment: oldTreatment},
          {'treatment.$': newTreatment},
          {new: true, useFindAndModify: false}
        )
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
        )
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
        )
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
          dose: args.visitInput.treatmentDose,
          frequency: args.visitInput.treatmentFrequency,
          attachments: attachments,
          highlighted: args.visitInput.treatmentHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {treatment: treatment}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitTreatmentHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitTreatmentHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const attachments = args.visitInput.treatmentAttachments.split(',');
      const treatment = {
        type: args.visitInput.treatmentType,
        title: args.visitInput.treatmentTitle,
        description: args.visitInput.treatmentDescription,
        dose: args.visitInput.treatmentDose,
        frequency: args.visitInput.treatmentFrequency,
        attachments: attachments,
        highlighted: args.visitInput.treatmentHighlighted,
      }

        let newHighlighted;
        if (args.visitInput.treatmentHighlighted === null) {
          newHighlighted = false;
        } else {
          newHighlighted = !args.visitInput.treatmentHighlighted;
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            treatment: treatment
          },
          {'treatment.$.highlighted': newHighlighted},
          {new: true, useFindAndModify: false}
        )
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
          notes: args.visitInput.billingNotes,
          highlighted: false,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {billing: billing}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitBilling: async (args, req) => {
    console.log("Resolver: updateVisitBilling...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldBilling = {
        title: args.visitInput.billingTitle,
        type: args.visitInput.billingType,
        description: args.visitInput.billingDescription,
        amount: args.visitInput.billingAmount,
        paid: args.visitInput.billingPaid,
        attachments: args.visitInput.billingAttachments.split(','),
        notes: args.visitInput.billingNotes,
        highlighted: args.visitInput.billingHighlighted,
      }
      const newBilling = {
        title: args.visitInput2.billingTitle,
        type: args.visitInput2.billingType,
        description: args.visitInput2.billingDescription,
        amount: args.visitInput2.billingAmount,
        paid: args.visitInput2.billingPaid,
        attachments: args.visitInput2.billingAttachments.split(','),
        notes: args.visitInput2.billingNotes,
        highlighted: args.visitInput2.billingHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,billing: oldBilling},
          {'billing.$': newBilling},
          {new: true, useFindAndModify: false}
        )
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
        )
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
  updateVisitBillingPaid: async (args, req) => {
    console.log("Resolver: updateVisitBillingPaid...");
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
        const preVisit = await Visit.findById(args.visitId)
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,
            'billing.title': billing.title,
            // 'billing.type': billing.type,
            // 'billing.description': billing.description,
            'billing.amount': billing.amount,
            'billing.paid': billing.paid,
            // 'billing.notes': billing.notes
          },
          {'billing.$.paid': true},
          {new: true, useFindAndModify: false}
        )
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
        )
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
          notes: args.visitInput.billingNotes,
          highlighted: args.visitInput.billingHighlighted,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {billing: billing}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitBillingHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitBillingHighlighted...");
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
        notes: args.visitInput.billingNotes,
        highlighted: args.visitInput.billingHighlighted,
      }

      let newHighlighted;
      if (args.visitInput.billingHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.visitInput.billingHighlighted;
      }

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId,
          billing: billing
        },
        {'billing.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
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
  addVisitImage: async (args, req) => {
    console.log("Resolver: addVisitImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const image = {
          name: args.visitInput.imageName,
          type: args.visitInput.imageType,
          path: args.visitInput.imagePath,
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {images: image}},
          {new: true, useFindAndModify: false}
        )
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
  deleteVisitImage: async (args, req) => {
    console.log("Resolver: deleteVisitImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const image = {
          name: args.visitInput.imageName,
          type: args.visitInput.imageType,
          path: args.visitInput.imagePath,
          highlighted: args.visitInput.imageHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {images: image}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitImageHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitImageHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const image = {
        name: args.visitInput.imageName,
        type: args.visitInput.imageType,
        path: args.visitInput.imagePath,
        highlighted: args.visitInput.imageHighlighted,
      }

      let newHighlighted;
      if (args.visitInput.imageHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.visitInput.imageHighlighted;
      }

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId,
          images: image
        },
        {'images.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
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
  addVisitFile: async (args, req) => {
    console.log("Resolver: addVisitFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const file = {
          name: args.visitInput.fileName,
          type: args.visitInput.fileType,
          path: args.visitInput.filePath,
          highlighted: false,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {files: file}},
          {new: true, useFindAndModify: false}
        )
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
  deleteVisitFile: async (args, req) => {
    console.log("Resolver: deleteVisitFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const file = {
          name: args.visitInput.fileName,
          type: args.visitInput.fileType,
          path: args.visitInput.filePath,
          highlighted: args.visitInput.fileHighlighted,
        }
        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {files: file}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitFileHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitFileHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const file = {
        name: args.visitInput.fileName,
        type: args.visitInput.fileType,
        path: args.visitInput.filePath,
        highlighted: args.visitInput.fileHighlighted,
      }

      let newHighlighted;
      if (args.visitInput.fileHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.visitInput.fileHighlighted;
      }

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId,
          files: file
        },
        {'files.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
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
              medication: args.visitInput.vigilanceChronicIllnessDyslipidemiaMedication,
              testing: args.visitInput.vigilanceChronicIllnessDyslipidemiaTesting,
              comment: args.visitInput.vigilanceChronicIllnessDyslipidemiaComment
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
          },
          highlighted: false,
        }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$addToSet: {vigilance: vigilance}},
          {new: true, useFindAndModify: false}
        )
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
  updateVisitVigilance: async (args, req) => {
    console.log("Resolver: updateVisitVigilance...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const oldVigilance = {
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
            medication: args.visitInput.vigilanceChronicIllnessDyslipidemiaMedication,
            testing: args.visitInput.vigilanceChronicIllnessDyslipidemiaTesting,
            comment: args.visitInput.vigilanceChronicIllnessDyslipidemiaComment
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
        },
        highlighted: args.visitInput.vigilanceHighlighted,
      }

      const newVigilance = {
        chronicIllness: {
          diabetes: {
            medication: args.visitInput2.vigilanceChronicIllnessDiabetesMedication,
            testing: args.visitInput2.vigilanceChronicIllnessDiabetesTesting,
            comment: args.visitInput2.vigilanceChronicIllnessDiabetesComment
          },
          hbp: {
            medication: args.visitInput2.vigilanceChronicIllnessHbpMedication,
            testing: args.visitInput2.vigilanceChronicIllnessHbpTesting,
            comment: args.visitInput2.vigilanceChronicIllnessHbpComment
          },
          dyslipidemia: {
            medication: args.visitInput2.vigilanceChronicIllnessDyslipidemiaMedication,
            testing: args.visitInput2.vigilanceChronicIllnessDyslipidemiaTesting,
            comment: args.visitInput2.vigilanceChronicIllnessDyslipidemiaComment
          },
          cad: {
            medication: args.visitInput2.vigilanceChronicIllnessCadMedication,
            testing: args.visitInput2.vigilanceChronicIllnessCadTesting,
            comment: args.visitInput2.vigilanceChronicIllnessCadComment
          }
        },
        lifestyle: {
          weight: {
            medication: args.visitInput2.vigilanceLifestyleWeightMedication,
            testing: args.visitInput2.vigilanceLifestyleWeightTesting,
            comment: args.visitInput2.vigilanceLifestyleWeightComment
          },
          diet: {
            medication: args.visitInput2.vigilanceLifestyleDietMedication,
            testing: args.visitInput2.vigilanceLifestyleDietTesting,
            comment: args.visitInput2.vigilanceLifestyleDietComment
          },
          smoking: {
            medication: args.visitInput2.vigilanceLifestyleSmokingMedication,
            testing: args.visitInput2.vigilanceLifestyleSmokingTesting,
            comment: args.visitInput2.vigilanceLifestyleSmokingComment
          },
          substanceAbuse: {
            medication: args.visitInput2.vigilanceLifestyleSubstanceAbuseMedication,
            testing: args.visitInput2.vigilanceLifestyleSubstanceAbuseTesting,
            comment: args.visitInput2.vigilanceLifestyleSubstanceAbuseComment
          },
          exercise: {
            medication: args.visitInput2.vigilanceLifestyleExerciseMedication,
            testing: args.visitInput2.vigilanceLifestyleExerciseTesting,
            comment: args.visitInput2.vigilanceLifestyleExerciseComment
          },
          allergies: {
            medication: args.visitInput2.vigilanceLifestyleAllergiesMedication,
            testing: args.visitInput2.vigilanceLifestyleAllergiesTesting,
            comment: args.visitInput2.vigilanceLifestyleAllergiesComment
          },
          asthma: {
            medication: args.visitInput2.vigilanceLifestyleAsthmaMedication,
            testing: args.visitInput2.vigilanceLifestyleAsthmaTesting,
            comment: args.visitInput2.vigilanceLifestyleAsthmaComment
          }
        },
        screening: {
          breast: {
            medication: args.visitInput2.vigilanceScreeningBreastMedication,
            testing: args.visitInput2.vigilanceScreeningBreastTesting,
            comment: args.visitInput2.vigilanceScreeningBreastComment
          },
          prostate: {
            medication: args.visitInput2.vigilanceScreeningProstateMedication,
            testing: args.visitInput2.vigilanceScreeningProstateTesting,
            comment: args.visitInput2.vigilanceScreeningProstateComment
          },
          cervix: {
            medication: args.visitInput2.vigilanceScreeningCervixMedication,
            testing: args.visitInput2.vigilanceScreeningCervixTesting,
            comment: args.visitInput2.vigilanceScreeningCervixComment
          },
          colon: {
            medication: args.visitInput2.vigilanceScreeningColonMedication,
            testing: args.visitInput2.vigilanceScreeningColonTesting,
            comment: args.visitInput2.vigilanceScreeningColonComment
          },
          dental: {
            medication: args.visitInput2.vigilanceScreeningDentalMedication,
            testing: args.visitInput2.vigilanceScreeningDentalTesting,
            comment: args.visitInput2.vigilanceScreeningDentalComment
          }
        },
        vaccines: {
          influenza: {
            medication: args.visitInput2.vigilanceVaccinesInfluenzaMedication,
            testing: args.visitInput2.vigilanceVaccinesInfluenzaTesting,
            comment: args.visitInput2.vigilanceVaccinesInfluenzaComment
          },
          varicella: {
            medication: args.visitInput2.vigilanceVaccinesVaricellaMedication,
            testing: args.visitInput2.vigilanceVaccinesVaricellaTesting,
            comment: args.visitInput2.vigilanceVaccinesVaricellaComment
          },
          hpv: {
            medication: args.visitInput2.vigilanceVaccinesHpvMedication,
            testing: args.visitInput2.vigilanceVaccinesHpvTesting,
            comment: args.visitInput2.vigilanceVaccinesHpvComment
          },
          mmr: {
            medication: args.visitInput2.vigilanceVaccinesMmrMedication,
            testing: args.visitInput2.vigilanceVaccinesMmrTesting,
            comment: args.visitInput2.vigilanceVaccinesMmrComment
          },
          tetanus: {
            medication: args.visitInput2.vigilanceVaccinesTetanusMedication,
            testing: args.visitInput2.vigilanceVaccinesTetanusTesting,
            comment: args.visitInput2.vigilanceVaccinesTetanusComment
          },
          pneumovax: {
            medication: args.visitInput2.vigilanceVaccinesPneumovaxMedication,
            testing: args.visitInput2.vigilanceVaccinesPneumovaxTesting,
            comment: args.visitInput2.vigilanceVaccinesPneumovaxComment
          },
          other: {
            name: args.visitInput2.vigilanceVaccinesOtherName,
            medication: args.visitInput2.vigilanceVaccinesOtherMedication,
            testing: args.visitInput2.vigilanceVaccinesOtherTesting,
            comment: args.visitInput2.vigilanceVaccinesOtherComment
          }
        },
        highlighted: args.visitInput2.vigilanceHighlighted,
      }

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId,vigilance: oldVigilance},
          {'vigilance.$': newVigilance},
          {new: true, useFindAndModify: false}
        )
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
              medication: args.visitInput.vigilanceChronicIllnessDyslipidemiaMedication,
              testing: args.visitInput.vigilanceChronicIllnessDyslipidemiaTesting,
              comment: args.visitInput.vigilanceChronicIllnessDyslipidemiaComment
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
          },
          highlighted: args.visitInput.vigilanceHighlighted,
        };

        const visit = await Visit.findOneAndUpdate(
          {_id:args.visitId},
          {$pull: {vigilance: vigilance}},
          {new: true, useFindAndModify: false}
        )
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
  toggleVisitVigilanceHighlighted: async (args, req) => {
    console.log("Resolver: toggleVisitVigilanceHighlighted...");
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
            medication: args.visitInput.vigilanceChronicIllnessDyslipidemiaMedication,
            testing: args.visitInput.vigilanceChronicIllnessDyslipidemiaTesting,
            comment: args.visitInput.vigilanceChronicIllnessDyslipidemiaComment
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
        },
        highlighted: args.visitInput.vigilanceHighlighted,
      };

      let newHighlighted;
      if (args.visitInput.vigilanceHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.visitInput.vigilanceHighlighted;
      }

      const visit = await Visit.findOneAndUpdate(
        {_id:args.visitId,
          vigilance: vigilance
        },
        {'vigilance.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
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
  completeVisitById: async (args, req) => {
    console.log("Resolver: completeVisitById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const preVisit = await Visit.findById(
          {_id:args.visitId}
        )
        .populate('appointment');
        const appointment = preVisit.appointment;
        const updateAppointment = await Appointment.findOneAndUpdate(
          {_id: appointment._id},
          {inProgress: false},
          {new: true, useFindAndModify: false}
        )
        const visit = await Visit.findById(
          {_id:args.visitId}
        )
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
      // console.log('foo', patient);
      // console.log('consultants',consultants)
      const today = moment();
      const dateTime = moment(appointment.date).format('YYYY-MM-DD')+'T'+appointment.time+'';
      console.log('a',moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD'));
      console.log('c',moment().tz("America/Bogota").format('YYYY-MM-DD'));
      console.log('d...early',moment().tz("America/Bogota").format('YYYY-MM-DD') < moment(appointment.date).format('YYYY-MM-DD'));
      console.log('e...late',moment().tz("America/Bogota").format('YYYY-MM-DD') > moment(appointment.date).format('YYYY-MM-DD'));
      console.log('f...ontime',moment().tz("America/Bogota").format('YYYY-MM-DD') === moment(appointment.date).format('YYYY-MM-DD'));
      const tooEarly = moment().tz("America/Bogota").format('YYYY-MM-DD') < moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD');
      const tooLate = moment().tz("America/Bogota").format('YYYY-MM-DD') > moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD');
      const onSchedule = moment().tz("America/Bogota").format('YYYY-MM-DD') === moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD');

      if (tooEarly === true) {
        console.log('...appointment for this visit is in the future...please wait or create a new appointment...');
        throw new Error('...appointment for this visit is in the future...please wait or create a new appointment...');
      }
      if (tooLate === true) {
        console.log('...appointment for this visit has already gone... please create a new appointment...');
        throw new Error('...appointment for this visit has already gone... please create a new appointment...');
      }

      let date = moment().tz("America/Bogota").format('YYYY-MM-DD');

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
        followUp: args.visitInput.followUp,
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
        {
          visit: result,
          attended: true,
          inProgress: true
        },
        {new: true, useFindAndModify: false}
      )

      for (let index = 0; index < consultants.length; index++) {
        let consultant = consultants[index];

        const updateConsultants = await User.findOneAndUpdate(
          {_id: consultant._id},
          {$addToSet: {visits: result}},
          {new: true, useFindAndModify: false}
        )

      }

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
