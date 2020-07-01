const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const Staff = require('../../models/staff');
const Patient = require('../../models/Patient');
const Appointment = require('../../models/Appointment');
const Visit = require('../../models/Visit');
const Reminder = require('../../models/Reminder');
const util = require('util');
const mongoose = require('mongoose');
const moment = require('moment');

const { transformStaff } = require('./merge');
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

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: 'michael.grandison@gmail.com',
        from: 'african.genetic.survival@gmail.com',
        subject: 'Its yah Booiii!!!',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail
        .send(msg)
        .then(() => {
          // console.log('Email Sent!');
          sendStatus = 'Email Sent!';
          // console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          // console.error(error.toString());
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          // console.log('sendStatus',sendStatus);
        });

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
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)


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
      let fieldType = null;
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)


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
  createStaff: async (args, req) => {
    console.log("Resolver: createStaff...");
    try {
      const existingUserName = await Staff.findOne({ username: args.staffInput.username});
      if (existingUserName) {
        throw new Error('Staff w/ that username exists already.');
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
        dob: args.userInput.dob,
        age: age,
        contact: {
          email: args.userInput.contactEmail,
          phone: args.userInput.contactPhone
        },
        addresses: [{
          type: args.userInput.addressType,
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
          primary: true
        }],
        bio: args.userInput.bio,
        interests: [],
        points: 0,
        clientConnected: false,
        loggedIn:false,
        verification: {
          verified: false,
          type: "email",
          code: verfCode
        },
        activity: [{
          date: today,
          request: "initial activity... profile created..."
        }],
        liked: [],
        wishlist: [],
        cart: [],
        reviews: [],
        orders: [],
        paymentInfo: []
      });

      const result = await user.save();


      let sendStatus = null;

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: result.contact.email,
        from: 'african.genetic.survival@gmail.com',
        subject: 'Signup Verification',
        text: `
          Thanks for signing up... use this code to verify your account at login...
          ${result.verification.code}...
        `,
        html: `
        <strong>
        Thanks for signing up... use this code to verify your account at login...
        ${result.verification.code}...
        </strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          // console.log('Email Sent!');
          sendStatus = 'Email Sent!';
          console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          // console.error(error.toString());
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          console.log('sendStatus',sendStatus);
        });
        console.log('verification: ',sendStatus);

      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};
