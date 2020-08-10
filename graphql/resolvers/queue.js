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
const moment = require('moment');
const mailgun = require("mailgun-js");
const puppeteer = require('puppeteer');

const { transformQueue } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
//   getAllQueues
// getQueueById
// getQueuesByField
// getQueueSlotByPatient
// getQueueByCreator
// createQueue
// addQueueSlot
// queueSlotSseen
// deleteQueSlot

  // getAllAppointments: async (args, req) => {
  //   console.log("Resolver: getAllAppointments...");
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }
  //   try {
  //     const appointments = await Appointment.find({})
  //     .populate('consultants')
  //     .populate('visit')
  //     .populate('creator')
  //     .populate('patient');
  //     return appointments.map(appointment => {
  //       return transformAppointment(appointment,);
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  // getAppointmentById: async (args, req) => {
  //   console.log("Resolver: getAppointmentById...");
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }
  //   try {
  //     const appointment = await Appointment.findById(args.appointmentId)
  //     .populate('consultants')
  //     .populate('visit')
  //     .populate('creator')
  //     .populate('patient');
  //     return {
  //       ...appointment._doc,
  //       _id: appointment.id,
  //       title: appointment.title,
  //       date: appointment.date
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  //
  // deleteAppointmentById: async (args, req) => {
  //   console.log("Resolver: deleteAppointmentById...");
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }
  //   try {
  //       const appointment = await Appointment.findByIdAndRemove({_id:args.appointmentId});
  //       return {
  //         ...appointment._doc,
  //         _id: appointment.id,
  //         title: appointment.title,
  //         date: appointment.date
  //       };
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  // createAppointment: async (args, req) => {
  //   console.log("Resolver: createAppointment...");
  //   try {
  //
  //     let consultants = [];
  //     const creator = await User.findById({_id: args.activityId})
  //     if (creator.role === 'Doctor') {
  //       consultants.push(creator);
  //     }
  //     const patient = await Patient.findById({_id: args.patientId})
  //     const today = moment();
  //     // console.log(today);
  //
  //     if (moment(args.appointmentInput.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
  //       console.log('...ummm no! Please pick a date today or in the future...');
  //       throw new Error('...ummm no! Please pick a date today or in the future...');
  //     }
  //     const appointmentExists = await Appointment.find({
  //         date: args.appointmentInput.date,
  //         title: args.appointmentInput.title
  //     })
  //     // console.log('appointmentExists',appointmentExists);
  //     if (appointmentExists.length > 0) {
  //       console.log('...an appointment w/ this date & title exists already...check your info and try again...');
  //       throw new Error('...an appointment w/ this date & title exists already...check your info and try again...')
  //     }
  //     // console.log('1:',moment(args.appointmentInput.date));
  //     const appointment = new Appointment({
  //       title: args.appointmentInput.title,
  //       type: args.appointmentInput.type,
  //       subType: args.appointmentInput.subType,
  //       date: args.appointmentInput.date,
  //       time: args.appointmentInput.time,
  //       checkinTime:0,
  //       seenTime: 0,
  //       location: args.appointmentInput.location,
  //       description: args.appointmentInput.description,
  //       visit: null,
  //       patient: patient,
  //       consultants: consultants,
  //       inProgress: false,
  //       attended: false,
  //       important: args.appointmentInput.important,
  //       notes: [],
  //       tags: [],
  //       reminders: [],
  //       creator: creator
  //     });
  //     const result = await appointment.save();
  //     // console.log('appointment', appointment);
  //     const updatePatient = await Patient.findOneAndUpdate(
  //       {_id: patient._id},
  //       {$addToSet: {appointments: result}},
  //       {new: true, useFindAndModify: false}
  //     )
  //     // console.log('updatePatient',updatePatient);
  //     console.log('start');
  //     for (let index = 0; index < consultants.length; index++) {
  //       let consultant = consultants[index];
  //       console.log('loop',index);
  //       const updateConsultants = await User.findOneAndUpdate(
  //         {_id: consultant},
  //         {$addToSet: {appointments: result}},
  //         {new: true, useFindAndModify: false}
  //       )
  //       // console.log('updateConsultants',updateConsultants);
  //     }
  //     console.log('end');
  //     //
  //     return {
  //       ...result._doc,
  //       _id: result.id
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // }
};
