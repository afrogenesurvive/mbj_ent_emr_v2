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

const { transformUser } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  cronTest: async (args) => {
    console.log("Resolver: cronTest...",args);
    // try {
    //   return
    // } catch (err) {
    //   throw err;
    // }
  },
  testEmail: async () => {
    console.log("Resolver: test email...");
    try {
      let sendStatus = null;

      const DOMAIN = process.env.MAILGUN_B;
      const mg = mailgun({apiKey: process.env.MAILGUN_A, domain: DOMAIN});
      const data = {
      	from: 'Excited User <me@samples.mailgun.org>',
      	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
      	subject: 'Hello',
      	text: 'Testing some Mailgun awesomness!'
      };
      mg.messages().send(data, function (error, body) {
      	console.log(body);
      });

      // sgMail.setApiKey(process.env.SENDGRID_A);
      // const msg = {
      //   to: 'michael.grandison@gmail.com',
      //   from: 'african.genetic.survival@gmail.com',
      //   subject: 'Its yah Booiii!!!',
      //   text: 'and easy to do anywhere, even with Node.js',
      //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      // };
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     // console.log('Email Sent!');
      //     sendStatus = 'Email Sent!';
      //     // console.log('sendStatus',sendStatus);
      //   })
      //   .catch(error => {
      //     // console.error(error.toString());
      //     const {message, code, response} = error;
      //     const {headers, body} = response;
      //     sendStatus = error.toString()+response;
      //     // console.log('sendStatus',sendStatus);
      //   });

      // return users.map(user => {
      //   return transformUser(user,);
      // });

      return sendStatus;
    } catch (err) {
      throw err;
    }
  },
  getAllUsers: async (args, req) => {
    console.log("Resolver: getAllUsers...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const users = await User.find({})
      .populate('appointments')
      .populate('reminders');
      return users.map(user => {
        return transformUser(user,);
      });
    } catch (err) {
      throw err;
    }
  },
  getUserById: async (args, req) => {
    console.log("Resolver: getUserById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById(args.userId)
      .populate('appointments')
      .populate('reminders');
      return {
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  getUsersByField: async (args, req) => {
    console.log("Resolver: getUsersByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)
      .populate('appointments')
      .populate('reminders');
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByFieldRegex: async (args, req) => {
    console.log("Resolver: getUsersByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)
      .populate('appointments')
      .populate('reminders');
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByAppointment: async (args, req) => {
    console.log("Resolver: getUsersByAppointment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const users = await User.find({
        appointments: args.appointmentId,
      })
      .populate('appointments')
      .populate('reminders');
      return users.map(user => {
        return transformUser(user);
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
  getThisUser: async (args, req) => {
    console.log("Resolver: getThisUser...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.activityId})
      .populate('appointments')
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email ,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  verifyUser: async (args, req) => {
    console.log("Resolver: verifyUser...");
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    try {
      // const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const challenge = {
        type: args.userInput.verificationType,
        code: args.userInput.verificationCode,
      }
      const preUser = await User.findOne({'contact.email': args.userInput.contactEmail});
      const response = {
        type: preUser.verification.type,
        code: preUser.verification.code,
      };
      console.log('challenge', challenge, 'response',response, 'match',challenge.type === response.type && challenge.code === response.code);
      if (challenge.type !== response.type && challenge.code !== response.code) {
        throw new Error('challenge and response do not match. Check the type and code sent in the verification email and try again');
      }
      if (challenge.type === response.type && challenge.code === response.code) {
        console.log("success");;
      }
      const user = await User.findOneAndUpdate({_id: preUser._id},{
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
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username
      };
    } catch (err) {
      throw err;
    }
  },
  userOnline: async (args, req) => {
    console.log("Resolver: userOnline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {clientConnected: true},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email ,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  userOffline: async (args, req) => {
    console.log("Resolver: userOffline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {clientConnected: false},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email ,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args, req) => {
    console.log("Resolver: createUser...");
    try {
      const existingUserName = await User.findOne({ username: args.userInput.username});
      if (existingUserName) {
        throw new Error('User w/ that username exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const today = moment();
      let age = 0;
      let dob = moment(args.userInput.dob).format('YYYY-MM-DD');
      let dob2 = new Date(args.userInput.dob);
      let ageDifMs = new Date() - dob2.getTime();
      let ageDate = new Date(ageDifMs);
      age =  Math.abs(ageDate.getUTCFullYear() - 1970);
      // console.log('dob',dob,'age',age);
      let regNo = 0;
      const userAmt = await User.find({});
      regNo = args.userInput.name.substr(0,2)+moment().utc()+'?'+moment(dob).utc()+'?000'+(userAmt+1)+'';
      const regNoExists = await User.find({registrationNumber: regNo});
      console.log(`
          1: ${userAmt},
          2: ${regNo},
          3: ${regNoExists}
        `);
      if (regNoExists) {
        throw new Error('...umm no! Regno Already exists..');
        console.log('...umm no! Regno Already exists..');
      }
      let rando = Math.floor(Math.random() * 5) + 1;
      let verfCode = moment().format()+'?'+args.userInput.username+'?'+rando+'';
      const key = 'MBJ_ENT_emr_v2_Signup';
      const encryptor = require('simple-encryptor')(key);
      const encrypted = encryptor.encrypt(verfCode);
      // console.log('rando',rando,'verfCode',verfCode,'encrypted',encrypted);
      verfCode = encrypted;
      console.log('verfCode',verfCode);
      const user = new User({
        password: hashedPassword,
        name: args.userInput.name,
        role: args.userInput.role,
        type: args.userInput.type,
        username: args.userInput.username,
        registrationNumber: regNo,
        dob: args.userInput.dob,
        age: age,
        gender: args.userInput.gender,
        contact: {
          email: args.userInput.contactEmail,
          phone: args.userInput.contactPhone,
          phone2: args.userInput.contactPhone2
        },
        addresses: [{
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
          primary: true
        }],
        clientConnected: false,
        loggedIn:false,
        verification: {
          verified: false,
          type: "email",
          code: verfCode
        },
        attendance: [],
        leave: [],
        images: [],
        files: [],
        notes: [],
        appointments: [],
        reminders: [],
        activity: [{
          date: today,
          request: "initial activity... profile created..."
        }]
      });
      // const result = await user.save();


      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};
