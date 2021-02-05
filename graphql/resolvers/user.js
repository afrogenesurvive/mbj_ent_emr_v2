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
  // testPuppeteer: async () => {
  //   console.log("Resolver: testPuppeteer...");
  //
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  //     await page.goto('https://example.org/', { waitUntil: 'networkidle0' });
  //
  //     const data = await page.evaluate(() => document.querySelector('body').innerHTML);
  //     // const data = await page.evaluate(() => document.querySelector('*').outerHTML);
  //
  //     // const data = await page.evaluate(
  //     //   () =>  Array.from(document.querySelectorAll('*'))
  //     //               .map(elem => elem.tagName)
  //     // );
  //
  //   console.log('data',data);
  //
  //     await browser.close();
  //
  //   try {
  //     return JSON.stringify(data);
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  testEmail: async () => {
    console.log("Resolver: test email...");
    try {
      let sendStatus = null;

      // const mailjet = require ('node-mailjet')
      // .connect(process.env.MAILJET_A, process.env.MAILGUN_B)
      // const request = mailjet
      // .post("send", {'version': 'v3.1'})
      // .request({
      //   "Messages":[
      //     {
      //       "From": {
      //         "Email": "african.genetic.survival@gmail.com",
      //         "Name": "Michael"
      //       },
      //       "To": [
      //         {
      //           "Email": "african.genetic.survival@gmail.com",
      //           "Name": "Michael"
      //         }
      //       ],
      //       "Subject": "Greetings from Mailjet.",
      //       "TextPart": "My first Mailjet email",
      //       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      //       "CustomID": "AppGettingStartedTest"
      //     }
      //   ]
      // })
      // request
      //   .then((result) => {
      //     console.log(result.body)
      //   })
      //   .catch((err) => {
      //     console.log(err.statusCode)
      //   })


      // const DOMAIN = process.env.MAILGUN_B;
      // const mg = mailgun({apiKey: process.env.MAILGUN_A, domain: DOMAIN});
      // const data = {
      // 	from: 'Excited User <me@samples.mailgun.org>',
      // 	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
      // 	subject: 'Hello',
      // 	text: 'Testing some Mailgun awesomness!'
      // };
      // mg.messages().send(data, function (error, body) {
      // 	console.log(body);
      // });

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: 'african.genetic.survival@gmail.com',
        from: 'michael.grandison@gmail.com',
        subject: 'it was yah Booiii!!!',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email Sent!');
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  checkConsultantAppointments: async (args, req) => {
    console.log("Resolver: checkConsultantAppointments...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const date = args.date;
      console.log(date);
      const consultant = await User.findById({_id: args.consultantId})
      .populate('appointments');

      if (date === '') {
        console.log('invalid date...');
        throw new Error('invalid date...')
      }
      if (!consultant) {
        console.log('consultant not found! check the reference and try again...');
        throw new Error('consultant not found! check the reference and try again...')
      }
      if (consultant.role === 'Staff' || consultant.role === 'Admin') {
        console.log('consultant not found! check the reference and try again...');
        throw new Error('consultant not found! check the reference and try again...')
      }
      // if (consultant && consultant.role !== 'Nurse') {
      //   console.log('consultant not found! check the reference and try again...');
      //   throw new Error('consultant not found! check the reference and try again...')
      // }

      const consultantAppointments = consultant.appointments.map(x=> x = {
        date: moment(x.date).format('YYYY-MM-DD'),
        time: x.time,
        dateTime: moment(x.date).format('YYYY-MM-DD')+'T'+x.time+'-05:00',
        type: x.type
      });
      console.log('consultantAppointments',consultantAppointments.length ,consultantAppointments[consultantAppointments.length-1]);
      const consultantAppointmentsXDate = consultantAppointments.filter(x=>x.date === date);
      console.log('consultantAppointmentsXDate',consultantAppointmentsXDate);
      // calculate values of todays appts based on type
      // check is above value added to new appt type/value exceeds daily cap thne throw error
      let appointmentCount = consultantAppointmentsXDate.length;

      return appointmentCount;
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
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
      const preUser = await User.findOne({
        'contact.email': args.userInput.contactEmail,
        username: args.userInput.username
      });
      console.log(preUser);
      if (!preUser) {
        console.log('User not found! Check your details & try again!');
        throw new Error('User not found! Check your details & try again!')
      }

      const response = {
        type: preUser.verification.type,
        code: preUser.verification.code,
      };

      // console.log('challenge', challenge, 'response',response, 'match',challenge.type === response.type && challenge.code === response.code);
      let match = challenge.type === response.type && challenge.code === response.code;
      if (match === false) {
        throw new Error('challenge and response do not match. Check the type and code sent in the verification email and try again');
      }
      if (match === true) {
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
  requestPasswordReset: async (args) => {
    console.log('Resolver: requestPasswordReset...');
    try {
      const username = args.userInput.username;
      const email = args.userInput.email;
      const userExists = await User.findOne({username: args.userInput.username, 'contact.email': args.userInput.contactEmail});
      if (!userExists) {
        console.log('...user doesnt exist. Check your credentials and try again...');
        throw new Error('...user doesnt exist. Check your credentials and try again...')
      }

      let verificationCode = '0';
      let rando = Math.floor(Math.random() * 5) + 1;
      verificationCode = moment().format()+userExists._id+'?000'+rando+'';


      const key = 'Request_MBJ_ENT__emr_v2_Password';
      const encryptor = require('simple-encryptor')(key);
      const encrypted = encryptor.encrypt(verificationCode);
      const resetUrl = 'http://ec2-3-129-19-78.us-east-2.compute.amazonaws.com/passwordReset/'+userExists._id+'@'+encrypted+'';
      // const resetUrl = 'localhost:3000/passwordReset/'+userExists._id+'@'+encrypted+'';
      const user = await User.findOneAndUpdate(
        {_id: userExists._id},
        {verification: {
          verified: false,
          type: 'passwordReset',
          code: verificationCode
        }},
        {new: true, useFindAndModify: false}
      )
      const userEmail = user.contact.email;
      console.log('resetUrl',resetUrl);

      // let sendStatus = null;
      // sgMail.setApiKey(process.env.SENDGRID_A);
      // const msg = {
      //   to: userEmail,
      //   from: 'michael.grandison@gmail.com',
      //   subject: 'Password Reset',
      //   text: `
      //     Hello ${user.username} use this url to reset your password...
      //     ${resetUrl} ...
      //   `,
      //   html: `
      //   <strong>
      //   Hello ${user.username} use this url to reset your password...
      //   <a target="_blank">
      //   ${resetUrl}
      //   </a> ...
      //   </strong>`,
      // };
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     sendStatus = 'Email Sent!';
      //     console.log('sendStatus',sendStatus);
      //   })
      //   .catch(error => {
      //     const {message, code, response} = error;
      //     const {headers, body} = response;
      //     sendStatus = error.toString()+response;
      //     console.log('sendStatus',sendStatus);
      //   });

      return {
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  resetUserPassword: async (args) => {
    console.log('Resolver: resetUserPassword...');
    try {

      let verificationChallengeCode = 0;
      const key = 'Request_MBJ_ENT__emr_v2_Password';
      const decryptor = require('simple-encryptor')(key);
      verificationChallengeCode = decryptor.decrypt(args.userInput.verificationCode);


      const preUser = await User.findById({_id: args.userId});
      const verificationResponse = preUser.verification;
      console.log('challenge',verificationChallengeCode);
      console.log('response',verificationResponse.code);
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
      const password = args.userInput.password;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.findOneAndUpdate(
        {_id: args.userId},
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
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  updateUserAllFields: async (args, req) => {
    console.log("Resolver: updateUserAllFields...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let dob = moment(args.userInput.dob).format('YYYY-MM-DD');
      let dob2 = new Date(args.userInput.dob);
      let ageDifMs = new Date() - dob2.getTime();
      let ageDate = new Date(ageDifMs);
      let age =  Math.abs(ageDate.getUTCFullYear() - 1970);

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {
          name: args.userInput.name,
          title: args.userInput.title,
          type: args.userInput.type,
          username: args.userInput.username,
          dob: dob,
          age: age,
          gender: args.userInput.gender,
          contact: {
            email: args.userInput.contactEmail,
            phone: args.userInput.contactPhone,
            phone2: args.userInput.contactPhone2
          },
          bio: args.userInput.bio
        },
        {new: true, useFindAndModify: false})
        .populate('appointments')
        .populate({
           path: 'appointments',
           populate: {
             path: 'patient',
             model: 'Patient'
           }
        })
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
             path: 'patient',
             model: 'Patient'
           }
        })
        .populate({
           path: 'visits',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
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
  updateUserSingleField: async (args, req) => {
    console.log("ResolverupdateUserSingleField...");
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
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        query,
        {new: true, useFindAndModify: false})
        .populate('appointments')
        .populate({
           path: 'appointments',
           populate: {
             path: 'patient',
             model: 'Patient'
           }
        })
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
             path: 'patient',
             model: 'Patient'
           }
        })
        .populate({
           path: 'visits',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
        .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserAddress: async (args, req) => {
    console.log("Resolver: addUserAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const address = {
        number: args.userInput.addressNumber,
        street: args.userInput.addressStreet,
        town: args.userInput.addressTown,
        city: args.userInput.addressCity,
        parish: args.userInput.addressParish,
        country: args.userInput.addressCountry,
        postalCode: args.userInput.addressPostalCode,
        primary: false
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: {addresses: address}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserAddress: async (args, req) => {
    console.log("Resolver: deleteUserAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const activityUser = await User.findById({_id: args.activityId});
      // if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
      //   throw new Error("Yaah.. No! Only the owner or Admin can delete a User Address");
      // };
        const address = {
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
          primary: args.userInput.addressPrimary
        };
        const user = await User.findOneAndUpdate(
          {_id:args.userId},
          {$pull: { 'addresses': address }},
          {new: true, useFindAndModify: false}
        )
        .populate('appointments')
        .populate({
           path: 'appointments',
           populate: {
             path: 'patient',
             model: 'Patient'
           }
        })
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
             path: 'patient',
             model: 'Patient'
           }
        })
        .populate({
           path: 'visits',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
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
  setUserAddressPrimary: async (args, req) => {
    console.log("Resolver: setUserAddressPrimary...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const nerfAllAddresses = await User.findOneAndUpdate(
        {_id: args.userId},
        // {_id: args.userId, 'addresses.type':args.userInput.addressType},
        {$set: {'addresses.$[elem].primary': false}},
        {
          arrayFilters: [ { "elem.type": args.userInput.addressType } ],
          new: true,
          useFindAndModify: false
        }
      )
      // console.log('nerfAllAddresses', nerfAllAddresses);
      const address = {
        number: args.userInput.addressNumber,
        street: args.userInput.addressStreet,
        town: args.userInput.addressTown,
        city: args.userInput.addressCity,
        parish: args.userInput.addressParish,
        country: args.userInput.addressCountry,
        postalCode: args.userInput.addressPostalCode,
        primary: false,
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          addresses: address
        },
        {'addresses.$.primary': true},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserAttendance: async (args, req) => {
    console.log("Resolver: addUserAttendance...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const attendance = {
        date: args.userInput.attendanceDate,
        status: args.userInput.attendanceStatus,
        description: args.userInput.attendanceDescription,
        highlighted: false
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: {attendance: attendance}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserAttendance: async (args, req) => {
    console.log("Resolver: deleteUserAttendance...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const attendance = {
        date: args.userInput.attendanceDate,
        status: args.userInput.attendanceStatus,
        description: args.userInput.attendanceDescription,
        highlighted: args.userInput.attendanceHighlighted
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$pull: {attendance: attendance}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  toggleUserAttendanceHighlighted: async (args, req) => {
    console.log("Resolver: toggleUserAttendanceHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const attendance = {
        date: args.userInput.attendanceDate,
        status: args.userInput.attendanceStatus,
        description: args.userInput.attendanceDescription,
        highlighted: args.userInput.attendanceHighlighted
      };

      let newHighlighted;
      if (args.userInput.attendanceHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.userInput.attendanceHighlighted;
      }

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          attendance: attendance
        },
        {'attendance.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserLeave: async (args, req) => {
    console.log("Resolver: addUserLeave...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const leave = {
        type: args.userInput.leaveType,
        startDate: args.userInput.leaveStartDate,
        endDate: args.userInput.leaveEndDate,
        description: args.userInput.leaveDescription,
        highlighted: false
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: {leave: leave}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserLeave: async (args, req) => {
    console.log("Resolver: deleteUserLeave...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const leave = {
        type: args.userInput.leaveType,
        startDate: args.userInput.leaveStartDate,
        endDate: args.userInput.leaveEndDate,
        description: args.userInput.leaveDescription,
        highlighted: args.userInput.leaveHighlighted
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$pull: {leave: leave}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  toggleUserLeaveHighlighted: async (args, req) => {
    console.log("Resolver: toggleUserLeaveHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const leave = {
        type: args.userInput.leaveType,
        startDate: args.userInput.leaveStartDate,
        endDate: args.userInput.leaveEndDate,
        description: args.userInput.leaveDescription,
        highlighted: args.userInput.leaveHighlighted
      };

      let newHighlighted;
      if (args.userInput.leaveHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.userInput.leaveHighlighted;
      }

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          leave: leave
        },
        {'leave.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserImage: async (args, req) => {
    console.log("Resolver: addUserImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const image = {
        name: args.userInput.imageName,
        type: args.userInput.imageType,
        path: args.userInput.imagePath,
        highlighted: false
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: {images: image}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserImage: async (args, req) => {
    console.log("Resolver: deleteUserImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const image = {
        name: args.userInput.imageName,
        type: args.userInput.imageType,
        path: args.userInput.imagePath,
        highlighted: args.userInput.imageHighlighted
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$pull: {images: image}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  toggleUserImageHighlighted: async (args, req) => {
    console.log("Resolver: toggleUserImageHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const image = {
        name: args.userInput.imageName,
        type: args.userInput.imageType,
        path: args.userInput.imagePath,
        highlighted: args.userInput.imageHighlighted,
      }

      let newHighlighted;
      if (args.userInput.imageHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.userInput.imageHighlighted;
      }

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          images: image
        },
        {'images.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserFile: async (args, req) => {
    console.log("Resolver: addUserFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const file = {
        name: args.userInput.fileName,
        type: args.userInput.fileType,
        path: args.userInput.filePath,
        highlighted: false
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: {files: file}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserFile: async (args, req) => {
    console.log("Resolver: deleteUserFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const file = {
        name: args.userInput.fileName,
        type: args.userInput.fileType,
        path: args.userInput.filePath,
        highlighted: args.userInput.fileHighlighted
      };

      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$pull: {files: file}},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  toggleUserFileHighlighted: async (args, req) => {
    console.log("Resolver: toggleUserFileHighlighted...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const file = {
        name: args.userInput.fileName,
        type: args.userInput.fileType,
        path: args.userInput.filePath,
        highlighted: args.userInput.fileHighlighted,
      }

      let newHighlighted;
      if (args.userInput.fileHighlighted === null) {
        newHighlighted = false;
      } else {
        newHighlighted = !args.userInput.fileHighlighted;
      }

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          files: file
        },
        {'files.$.highlighted': newHighlighted},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');
      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserNotes: async (args, req) => {
    console.log("Resolver: addUserNotes...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const notes = args.userInput.notes;
      const splitNotes = notes.split(",");
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: { notes: {$each: splitNotes} }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
  deleteUserNote: async (args, req) => {
    console.log("Resolver: deleteUserNote...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const note = args.userInput.note;
        const user = await User.findOneAndUpdate(
          {_id:args.userId},
          {$pull: { notes: note }},
          {new: true, useFindAndModify: false}
        )
        .populate('appointments')
        .populate({
           path: 'appointments',
           populate: {
             path: 'patient',
             model: 'Patient'
           }
        })
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
             path: 'patient',
             model: 'Patient'
           }
        })
        .populate({
           path: 'visits',
           populate: {
             path: 'consultants',
             model: 'User'
           }
        })
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
  deleteUserById: async (args, req) => {
    console.log("Resolver: deleteUserById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const user = await User.findByIdAndRemove({_id:args.userId});
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
  addUserActivity: async (args, req) => {
    console.log("Resolver: addUserActivity...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activity = {
        date: args.userInput.activityDate,
        request: args.userInput.activityRequest
      }
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: { activity: activity }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
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
  addUserReminder: async (args, req) => {
    console.log("Resolver: addUserReminder...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminder = await Reminder.findById({_id: args.reminderId})
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: { reminders: reminder }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');

      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserAppointment: async (args, req) => {
    console.log("Resolver: addUserAppointment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const appointment = await Appointment.findById({_id: args.appointmentId})
      const user = await User.findOneAndUpdate(
        {_id:args.userId},
        {$addToSet: { appointments: appointment }},
        {new: true, useFindAndModify: false}
      )
      .populate('appointments')
      .populate({
         path: 'appointments',
         populate: {
           path: 'patient',
           model: 'Patient'
         }
      })
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
           path: 'patient',
           model: 'Patient'
         }
      })
      .populate({
         path: 'visits',
         populate: {
           path: 'consultants',
           model: 'User'
         }
      })
      .populate('reminders');

      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args, req) => {
    console.log("Resolver: createUser...");
    try {
      const existingUserName = await User.findOne({ username: args.userInput.username, email: args.userInput.email });
      if (existingUserName) {
        throw new Error('User w/ that username & email exists already.');
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
      regNo = args.userInput.name.substr(0,2)+moment().utc()+'?'+moment(dob).utc()+'?000'+(userAmt.length+1)+'';
      // const regNoExists = await User.find({registrationNumber: regNo});
      // console.log('1', regNo);
      // console.log('2', regNoExists);
      // if (regNoExists) {
      //   throw new Error('...umm no! Regno Already exists..');
      //   console.log('...umm no! Regno Already exists..');
      // }
      let rando = Math.floor(Math.random() * 5) + 1;
      let verfCode = moment().format()+'?'+args.userInput.username+'?'+rando+'';
      const key = 'MBJ_ENT_emr_v2_Signup';
      const encryptor = require('simple-encryptor')(key);
      const encrypted = encryptor.encrypt(verfCode);
      // console.log('rando',rando,'verfCode',verfCode,'encrypted',encrypted);
      verfCode = encrypted;
      console.log('verfCode',verfCode);
      const user = new User({
        title: args.userInput.title,
        password: hashedPassword,
        name: args.userInput.name,
        role: args.userInput.role,
        type: args.userInput.type,
        username: args.userInput.username,
        registrationNumber: regNo,
        employmentDate: '',
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
          parish: args.userInput.addressParish,
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
        visits: [],
        reminders: [],
        activity: [{
          date: today,
          request: "initial activity... profile created..."
        }]
      });
      const result = await user.save();

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
