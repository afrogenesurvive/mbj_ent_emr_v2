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

const { transformPatient } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  getAllPatients: async (args, req) => {
    console.log("Resolver: getAllPatients...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patients = await Patient.find({})
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return patients.map(patient => {
        return transformPatient(patient,);
      });
    } catch (err) {
      throw err;
    }
  },
  getPatientById: async (args, req) => {
    console.log("Resolver: getPatientById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findById(args.patientId)
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
          ...patient._doc,
          _id: patient.id,
          name: patient.name
      };
    } catch (err) {
      throw err;
    }
  },
  getPatientsByField: async (args, req) => {
    console.log("Resolver: getPatientsByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Patient.find(query)
      .populate('appointments')
      .populate('reminders');
      return patients.map(patient => {
        return transformPatient(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getPatientsByFieldRegex: async (args, req) => {
    console.log("Resolver: getPatientsByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Patient.find(query)
      .populate('appointments')
      .populate('reminders');
      return patients.map(patient => {
        return transformPatient(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getPatientsByAppointment: async (args, req) => {
    console.log("Resolver: getPatientsByAppointment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patients = await Patient.find({
        appointments: args.appointmentId,
      })
      .populate('appointments')
      .populate('reminders');
      return patients.map(patient => {
        return transformPatient(patient);
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
  getThisPatient: async (args, req) => {
    console.log("Resolver: getThisPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findById({_id: args.activityId})
      .populate('appointments')
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
  verifyPatient: async (args, req) => {
    console.log("Resolver: verifyPatient...");
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    try {
      // const hashedPassword = await bcrypt.hash(args.patientInput.password, 12);
      const challenge = {
        type: args.patientInput.verificationType,
        code: args.patientInput.verificationCode,
      }
      const prePatient = await Patient.findOne({
        'contact.email': args.patientInput.contactEmail,
        username: args.patientInput.username
      });
      const response = {
        type: prePatient.verification.type,
        code: prePatient.verification.code,
      };
      // console.log('challenge', challenge, 'response',response, 'match',challenge.type === response.type && challenge.code === response.code);
      let match = challenge.type === response.type && challenge.code === response.code;
      if (match === false) {
        throw new Error('challenge and response do not match. Check the type and code sent in the verification email and try again');
      }
      if (match === true) {
        console.log("success");;
      }
      const patient = await Patient.findOneAndUpdate({_id: prePatient._id},{
        verification: {
          verified: true,
          type: response.type,
          code: null
        }
      },
      {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username
      };
    } catch (err) {
      throw err;
    }
  },
  patientOnline: async (args, req) => {
    console.log("Resolver: patientOnline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {clientConnected: true},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
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
  patientOffline: async (args, req) => {
    console.log("Resolver: patientOffline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {clientConnected: false},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
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
  requestPasswordReset: async (args) => {
    console.log('Resolver: requestPasswordReset...');
    try {
      const username = args.patientInput.username;
      const email = args.patientInput.email;
      const patientExists = await Patient.findOne({username: args.patientInput.username, 'contact.email': args.patientInput.contactEmail})
      if (!patientExists) {
        console.log('...patient doesnt exist. Check your credentials and try again...');
        throw new Error('...patient doesnt exist. Check your credentials and try again...')
      }

      let verificationCode = '0';
      let rando = Math.floor(Math.random() * 5) + 1;
      verificationCode = moment().format()+patientExists._id+'?000'+rando+'';

      const patient = await Patient.findOneAndUpdate(
        {_id: patientExists._id},
        {verification: {
          verified: false,
          type: 'passwordReset',
          code: verificationCode
        }},
        {new: true, useFindAndModify: false}
      )
      const key = 'Request_MBJ_ENT__emr_v2_Password';
      const encryptor = require('simple-encryptor')(key);
      const encrypted = encryptor.encrypt(verificationCode);
      const resetUrl = 'localhost:3000/passwordReset/'+patientExists._id+'@'+encrypted+'';
      const patientEmail = patient.contact.email;
      // console.log('resetUrl',resetUrl);

      let sendStatus = null;

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: patientEmail,
        from: 'michael.grandison@gmail.com',
        subject: 'Password Reset',
        text: `
          Hello ${patient.username} use this url to reset your password...
          ${resetUrl} ...
        `,
        html: `
        <strong>
        Hello ${patient.username} use this url to reset your password...
        <a target="_blank">
        ${resetUrl}
        </a> ...
        </strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          sendStatus = 'Email Sent!';
          console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          console.log('sendStatus',sendStatus);
        });

      return {
          ...patient._doc,
          _id: patient.id,
          name: patient.name
      };
    } catch (err) {
      throw err;
    }
  },
  resetPatientPassword: async (args) => {
    console.log('Resolver: resetPatientPassword...');
    try {

      let verificationChallengeCode = 0;
      const key = 'Request_MBJ_ENT__emr_v2_Password';
      const decryptor = require('simple-encryptor')(key);
      verificationChallengeCode = decryptor.decrypt(args.patientInput.verificationCode);

      // console.log('verificationChallengeCode',verificationChallengeCode);
      const prePatient = await Patient.findById({_id: args.patientId});
      const verificationResponse = prePatient.verification;

      if (verificationResponse.type !== 'passwordReset') {
        console.log('...umm no... reset request doesnt match our records... are you hacking??');
        throw new Error('...umm no... reset request doesnt match our records... are you hacking??')
      }

      if (verificationResponse.code !== verificationChallengeCode) {
        console.log('...there was an error with password reset verification... contact tech support or request a new reset email...');
        throw new Error('...there was an error with password reset verification... contact tech support or request a new reset email...')
      }
      else {
        console.log('...password reset verification success... resetting password...');
      }
      const password = args.patientInput.password;
      const hashedPassword = await bcrypt.hash(password, 12);
      const patient = await Patient.findOneAndUpdate(
        {_id: args.patientId},
        { $set:
          {password: hashedPassword,
            verification: {
              verified: true,
              type: null,
              code: null
          }}
        },
        {new: true, useFindAndModify: false}
      )
      return {
          ...patient._doc,
          _id: patient.id,
          name: patient.name
      };
    } catch (err) {
      throw err;
    }
  },
  updatePatientAllFields: async (args, req) => {
    console.log("Resolver: updatePatientAllFields...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let dob = moment(args.patientInput.dob).format('YYYY-MM-DD');
      let dob2 = new Date(args.patientInput.dob);
      let ageDifMs = new Date() - dob2.getTime();
      let ageDate = new Date(ageDifMs);
      let age =  Math.abs(ageDate.getUTCFullYear() - 1970);

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {
          name: args.patientInput.name,
          title: args.patientInput.title,
          role: args.patientInput.role,
          username: args.patientInput.username,
          dob: dob,
          age: age,
          gender: args.patientInput.gender,
          contact: {
            email: args.patientInput.contactEmail,
            phone: args.patientInput.contactPhone,
            phone2: args.patientInput.contactPhone2
          },
          expiryDate: args.patientInput.expiryDate,
          referral: {
            date: args.patientInput.referralDate,
            reason: args.patientInput.referralReason,
            physician: {
              name: args.patientInput.referralPhysicianName,
              email: args.patientInput.referralPhysicianEmail,
              phone: args.patientInput.referralPhysicianPhone
            }
          },
          attendingPhysician: args.patientInput.attendingPhysician,
          occupation: {
            role: args.patientInput.occupationRole,
            employer: {
              name: args.patientInput.occupationEmployerName,
              phone: args.patientInput.occupationEmployerPhone,
              email: args.patientInput.occupationEmployerEmail,
              address: args.patientInput.occupationEmployerAddress
            }
          },
          insurance: {
            company: args.patientInput.insuranceCompany,
            policyNumber: args.patientInput.insurancePolicyNumber,
            description: args.patientInput.insuranceDescription,
            expiryDate: args.patientInput.insuranceExpiryDate,
            subscriber: {
              company: args.patientInput.insuranceSubscriberCompany,
              description: args.patientInput.insuranceSubscriberDescription
            }
          },
        },
        {new: true, useFindAndModify: false})
        .populate('appointments')
        .populate('visits')
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
  updatePatientSingleField: async (args, req) => {
    console.log("ResolverupdatePatientSingleField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let query =  '';
      const resolverField = args.field;
      const resolverQuery = args.query;
      query = {[resolverField]:resolverQuery};
      if (args.field === 'dob') {
        let dob = moment(args.query).format('YYYY-MM-DD');
        let dob2 = new Date(args.query);
        let ageDifMs = new Date() - dob2.getTime();
        let ageDate = new Date(ageDifMs);
        let age =  Math.abs(ageDate.getUTCFullYear() - 1970);
        query = {
          dob: dob,
          age: age
        }
      }
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        query,
        {new: true, useFindAndModify: false})
        .populate('appointments')
        .populate('visits')
        .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientAddress: async (args, req) => {
    console.log("Resolver: addPatientAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const address = {
        number: args.patientInput.addressNumber,
        street: args.patientInput.addressStreet,
        town: args.patientInput.addressTown,
        city: args.patientInput.addressCity,
        parish: args.patientInput.addressParish,
        country: args.patientInput.addressCountry,
        postalCode: args.patientInput.addressPostalCode,
        primary: false
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {addresses: address}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientAddress: async (args, req) => {
    console.log("Resolver: deletePatientAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const activityUser = await User.findById({_id: args.activityId});
      // if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
      //   throw new Error("Yaah.. No! Only the owner or Admin can delete a User Address");
      // };
        const address = {
          number: args.patientInput.addressNumber,
          street: args.patientInput.addressStreet,
          town: args.patientInput.addressTown,
          city: args.patientInput.addressCity,
          country: args.patientInput.addressCountry,
          postalCode: args.patientInput.addressPostalCode,
          primary: args.patientInput.addressPrimary
        };
        const patient = await Patient.findOneAndUpdate(
          {_id:args.patientId},
          {$pull: { 'addresses': address }},
          {new: true, useFindAndModify: false}
        )
        .populate('wishlist')
        .populate('liked')
        .populate('cart')
        .populate('reviews')
        .populate('orders')
        .populate('affiliate.referrer');

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
  setPatientAddressPrimary: async (args, req) => {
    console.log("Resolver: setPatientAddressPrimary...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const nerfAllAddresses = await Patient.findOneAndUpdate(
        {_id: args.patientId},
        // {_id: args.patientId, 'addresses.type':args.patientInput.addressType},
        {$set: {'addresses.$[elem].primary': false}},
        {
          arrayFilters: [ { "elem.type": args.patientInput.addressType } ],
          new: true,
          useFindAndModify: false
        }
      )
      const address = {
        number: args.patientInput.addressNumber,
        street: args.patientInput.addressStreet,
        town: args.patientInput.addressTown,
        city: args.patientInput.addressCity,
        parish: args.patientInput.addressParish,
        country: args.patientInput.addressCountry,
        postalCode: args.patientInput.addressPostalCode,
        primary: false,
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId,
          addresses: address
        },
        {'addresses.$.primary': true},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        email: patient.contact.email,
        name: patient.name,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientNextOfKin: async (args, req) => {
    console.log("Resolver: addPatientNextOfKin...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const nextOfKin = {
        name: args.patientInput.nextOfKinName,
        relation: args.patientInput.nextOfKinRelation,
        contact:{
          email: args.patientInput.nextOfKinContactEmail,
          phone1: args.patientInput.nextOfKinContactPhone1,
          phone2: args.patientInput.nextOfKinContactPhone2
        }
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {nextOfKin: nextOfKin}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientNextOfKin: async (args, req) => {
    console.log("Resolver: deletePatientNextOfKin...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const nextOfKin = {
        name: args.patientInput.nextOfKinName,
        relation: args.patientInput.nextOfKinRelation,
        contact:{
          email: args.patientInput.nextOfKinContactEmail,
          phone1: args.patientInput.nextOfKinContactPhone1,
          phone2: args.patientInput.nextOfKinContactPhone2
        }
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$pull: {nextOfKin: nextOfKin}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientAllergy: async (args, req) => {
    console.log("Resolver: addPatientAllergy...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const allergy = {
        type: args.patientInput.allergyType,
        title: args.patientInput.allergyTitle,
        description: args.patientInput.allergyDescription,
        attachments: [args.patientInput.allergyAttachment],
      };
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {allergies: allergy}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientAllergy: async (args, req) => {
    console.log("Resolver: deletePatientAllergy...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    console.log(args.patientInput.allergyAttachments.split(','));
    try {
      const allergy = {
        type: args.patientInput.allergyType,
        title: args.patientInput.allergyTitle,
        description: args.patientInput.allergyDescription,
        attachments: args.patientInput.allergyAttachments.split(','),
      };
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$pull: {allergies: allergy}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientAllergyAttachment: async (args, req) => {
    console.log("Resolver: addPatientAllergies...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const allergy = {
        type: args.patientInput.allergyType,
        title: args.patientInput.allergyTitle,
        description: args.patientInput.allergyDescription,
      };
      const newAttachment = args.patientInput.allergyAttachment;

      const patient = await Patient.findOneAndUpdate(
        {
          _id:args.patientId,
          'allergies.type': allergy.type,
          'allergies.title': allergy.title,
          'allergies.description': allergy.description,
        },
        {$addToSet: {'allergies.$.attachments': newAttachment}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('visits')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientImage: async (args, req) => {
    console.log("Resolver: addPatientImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const image = {
        name: args.patientInput.imageName,
        type: args.patientInput.imageType,
        path: args.patientInput.imagePath
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {images: image}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientImage: async (args, req) => {
    console.log("Resolver: deletePatientImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const image = {
        name: args.patientInput.imageName,
        type: args.patientInput.imageType,
        path: args.patientInput.imagePath
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$pull: {images: image}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientFile: async (args, req) => {
    console.log("Resolver: addPatientFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const file = {
        name: args.patientInput.fileName,
        type: args.patientInput.fileType,
        path: args.patientInput.filePath
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {files: file}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientFile: async (args, req) => {
    console.log("Resolver: deletePatientFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const file = {
        name: args.patientInput.fileName,
        type: args.patientInput.fileType,
        path: args.patientInput.filePath
      };

      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$pull: {files: file}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...patient._doc,
        _id: patient.id,
        name: patient.name,
        username: patient.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addPatientNotes: async (args, req) => {
    console.log("Resolver: addPatientNotes...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const notes = args.patientInput.notes;
      const splitNotes = notes.split(",");
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: { notes: {$each: splitNotes} }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
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
  deletePatientNote: async (args, req) => {
    console.log("Resolver: deletePatientNote...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const note = args.patientInput.note;
        const patient = await Patient.findOneAndUpdate(
          {_id:args.patientId},
          {$pull: { notes: note }},
          {new: true, useFindAndModify: false}
        )
        .populate('appointments')
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
  addPatientTags: async (args, req) => {
    console.log("Resolver: addPatientTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tags = args.patientInput.tags;
      const splitTags = tags.split(",");
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: { tags: {$each: splitTags} }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
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
  deletePatientTag: async (args, req) => {
    console.log("Resolver: deletePatientTag...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const tag = args.patientInput.tag;
        const patient = await Patient.findOneAndUpdate(
          {_id:args.patientId},
          {$pull: { tags: tag }},
          {new: true, useFindAndModify: false}
        )
        .populate('appointments')
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
  addPatientReminder: async (args, req) => {
    console.log("Resolver: addPatientReminder...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminder = await Reminder.findById({_id: args.reminderId})
      const patient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: { reminders: reminder }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');

      return {
        ...patient._doc,
        _id: patient.id,
        email: patient.contact.email,
        name: patient.name,
      };
    } catch (err) {
      throw err;
    }
  },
  deletePatientById: async (args, req) => {
    console.log("Resolver: deletePatientById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const patient = await Patient.findByIdAndRemove({_id:args.patientId});
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
  createPatient: async (args, req) => {
    console.log("Resolver: createPatient...");
    try {

      const staff = await User.findById({_id:args.activityId})
      const active = args.patientInput.active;

      const existingPatient = await Patient.findOne({
        username: args.patientInput.username,
        name: args.patientInput.name,
        dob: args.patientInput.dob,
        gender: args.patientInput.gender
      });
      if (existingPatient) {
        throw new Error('Patient w/ that name,username,dob,gender exists already...check your data and call support in this error persists');
      }

      const today = moment();
      let age = 0;
      let dob = moment(args.patientInput.dob).format('YYYY-MM-DD');
      let dob2 = new Date(args.patientInput.dob);
      let ageDifMs = new Date() - dob2.getTime();
      let ageDate = new Date(ageDifMs);
      age =  Math.abs(ageDate.getUTCFullYear() - 1970);
      // console.log('dob',dob,'age',age);
      let regNo = 0;
      const patientAmt = await Patient.find({});
      regNo = args.patientInput.name.substr(0,2)+moment().utc()+'?'+moment(dob).utc()+'?000'+(patientAmt.length+1)+'';

      let password = "inactive";

      const patient = new Patient({
        active: active,
        title: args.patientInput.title,
        password: password,
        name: args.patientInput.name,
        role: args.patientInput.role,
        username: args.patientInput.username,
        registration: {
          number: regNo,
          date: moment().format('YYYY-MM-DD')
        },
        dob: args.patientInput.dob,
        age: age,
        gender: args.patientInput.gender,
        contact: {
          email: args.patientInput.contactEmail,
          phone: args.patientInput.contactPhone,
          phone2: args.patientInput.contactPhone2
        },
        addresses: [{
          number: args.patientInput.addressNumber,
          street: args.patientInput.addressStreet,
          town: args.patientInput.addressTown,
          city: args.patientInput.addressCity,
          parish: args.patientInput.addressParish,
          country: args.patientInput.addressCountry,
          postalCode: args.patientInput.addressPostalCode,
          primary: true
        }],
        clientConnected: false,
        loggedIn:false,
        verification: {
          verified: true,
          type: "inactive",
          code: ""
        },
        expiryDate: 0,
        referral: {
          date: args.patientInput.referralDate,
          reason: args.patientInput.referralReason,
          physician: {
            name: args.patientInput.referralPhysicianName,
            email: args.patientInput.referralPhysicianEmail,
            phone: args.patientInput.referralPhysicianPhone
          }
        },
        attendingPhysician: args.patientInput.attendingPhysician,
        occupation: {
          role: args.patientInput.occupationRole,
          employer: {
            name: args.patientInput.occupationEmployerName,
            phone: args.patientInput.occupationEmployerPhone,
            email: args.patientInput.occupationEmployerEmail,
            address: args.patientInput.occupationEmployerAddress
          }
        },
        insurance: {
          company: args.patientInput.insuranceCompany,
          policyNumber: args.patientInput.insurancePolicyNumber,
          description: args.patientInput.insuranceDescription,
          expiryDate: args.patientInput.insuranceExpiryDate,
          subscriber: {
            company: args.patientInput.insuranceSubscriberCompany,
            description: args.patientInput.insuranceSubscriberDescription
          }
        },
        nextOfKin: [],
        allergies: [],
        medication: [],
        images: [],
        files: [],
        notes: [],
        tags: [],
        appointments: [],
        visits: [],
        reminders: [],
        activity: [{
          date: today,
          request: "initial activity... patient created... by"+staff.username+""
        }]
      });
      const result = await patient.save();

      // let sendStatus = null;
      // sgMail.setApiKey(process.env.SENDGRID_A);
      // const msg = {
      //   to: result.contact.email,
      //   from: 'michael.grandison@gmail.com',
      //   subject: 'Signup Verification',
      //   text: `
      //     Thank you ${result.username}
      //     for signing up... use this code to verify your account at login...
      //     ${result.verification.code}...
      //   `,
      //   html: `
      //   <strong>
      //   Thanks for signing up... use this code to verify your account at login...
      //   ${result.verification.code}...
      //   </strong>`,
      // };
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     // console.log('Email Sent!');
      //     sendStatus = 'Email Sent!';
      //     console.log('sendStatus',sendStatus);
      //   })
      //   .catch(error => {
      //     // console.error(error.toString());
      //     const {message, code, response} = error;
      //     const {headers, body} = response;
      //     sendStatus = error.toString()+response;
      //     console.log('sendStatus',sendStatus);
      //   });
      //   console.log('verification: ',sendStatus);

      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};
