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

const { transformAppointment } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});


const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  getAllAppointments: async (args, req) => {
    console.log("Resolver: getAllAppointments...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const appointments = await Appointment.find({})
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return appointments.map(appointment => {
        return transformAppointment(appointment,);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentById: async (args, req) => {
    console.log("Resolver: getAppointmentById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const appointment = await Appointment.findById(args.appointmentId)
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsByField: async (args, req) => {
    console.log("Resolver: getAppointmentsByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Appointment.find(query)
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return patients.map(patient => {
        return transformAppointment(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsByFieldRegex: async (args, req) => {
    console.log("Resolver: getAppointmentsByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Appointment.find(query)
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return patients.map(patient => {
        return transformAppointment(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsByTags: async (args, req) => {
    console.log("Resolver: getAppointmentsByTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tags = args.appointmentInput.tags.split(',');
      const appointments = await Appointment.find({
        'tags': {$all: tags}
      })
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return appointments.map(appointment => {
        return transformAppointment(appointment);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsByPatient: async (args, req) => {
    console.log("Resolver: getAppointmentsByPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const appointments = await Appointment.find({
        patient: args.patientId
      })
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return appointments.map(appointment => {
        return transformAppointment(appointment);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsByConsultants: async (args, req) => {
    console.log("Resolver: getAppointmentsByConsultants...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const consultants = args.consultantIds.split(',');
      const appointments = await Appointment.find({
        consultants: {$all: consultants}
      })
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return appointments.map(appointment => {
        return transformAppointment(appointment);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsToday: async (args, req) => {
    console.log("Resolver: getAppointmentsToday...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let today = moment().format('YYYY-MM-DD')
      // console.log(query);
      const appointments = await Appointment.find({
        date: today
      })
      .sort({time: 1})
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return appointments.map(appointment => {
        return transformAppointment(appointment);
      });
    } catch (err) {
      throw err;
    }
  },
  getAppointmentsImportantNextWeek: async (args, req) => {
    console.log("Resolver: getAppointmentsImportantNextWeek...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let today = moment().format('YYYY-MM-DD')
      let nextWeek = moment(today).add(5, 'days').format('YYYY-MM-DD')
      // console.log(query);
      const patients = await Appointment.find({
        important: true,
        date: { $gte: today, $lte: nextWeek }
      })
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');

      return patients.map(patient => {
        return transformAppointment(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getThisAppointment: async (args, req) => {
    console.log("Resolver: getThisAppointment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Appointment.findById({_id: args.activityId})
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  updateAppointmentAllFields: async (args, req) => {
    console.log("Resolver: updateAppointmentAllFields...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {
          title: args.appointmentInput.title,
          type: args.appointmentInput.type,
          subType: args.appointmentInput.subType,
          date: args.appointmentInput.date,
          time: args.appointmentInput.time,
          checkinTime:args.appointmentInput.checkinTime,
          seenTime: args.appointmentInput.seenTime,
          location: args.appointmentInput.location,
          description: args.appointmentInput.description,
          inProgress: args.appointmentInput.inProgress,
          attended: args.appointmentInput.attended,
          important: args.appointmentInput.important,
        },
        {new: true, useFindAndModify: false})
        .populate('consultants')
        .populate('visit')
        .populate('creator')
        .populate('patient');
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  updateAppointmentSingleField: async (args, req) => {
    console.log("ResolverupdateAppointmentSingleField...");
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
      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        query,
        {new: true, useFindAndModify: false})
        .populate('consultants')
        .populate('visit')
        .populate('creator')
        .populate('patient');
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  updateAppointmentPatient: async (args, req) => {
    console.log("Resolver: updateAppointmentPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preAppointment = await Appointment.findById({
        _id:args.appointmentId
      })
      .populate('patient');
      const originalPatient = preAppointment.patient;
      const patient = await Patient.findById({_id: args.patientId})
      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {patient: patient},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');

      const updateOldPatient = await Patient.findOneAndUpdate(
        {_id:originalPatient._id},
        {$pull: {appointments: appointment}},
        {new: true, useFindAndModify: false}
      )
      console.log('foo',updateOldPatient);
      const updateNewPatient = await Patient.findOneAndUpdate(
        {_id:args.patientId},
        {$addToSet: {appointments: appointment}},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  addAppointmentConsultant: async (args, req) => {
    console.log("Resolver: addAppointmentConsultant...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preAppointment = await Appointment.findById({_id:args.appointmentId})
      const consultant = await User.findById({_id: args.consultantId})
      .populate('appointments');

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
      console.log('consultantAppointments',consultantAppointments);
      const consultantAppointmentsXDate = consultantAppointments.filter(x=>x.date === moment(preAppointment.date).format('YYYY-MM-DD'));
      console.log('consultantAppointmentsXDate',consultantAppointmentsXDate);
      // calculate values of todays appts based on type
      // check is above value added to new appt type/value exceeds daily cap thne throw error

      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {$addToSet: {consultants: consultant}},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');

      const updateUser = await User.findOneAndUpdate(
        {_id:args.consultantId},
        {$addToSet: {appointments: appointment}},
        {new: true, useFindAndModify: false}
      )
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  deleteAppointmentConsultant: async (args, req) => {
    console.log("Resolver: deleteAppointmentConsultant...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const consultant = await User.findById({_id: args.consultantId});
      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {$pull: {consultants: args.consultantId}},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      const updateUser = await User.findOneAndUpdate(
        {_id:args.consultantId},
        {$pull: {appointments: appointment._id}},
        {new: true, useFindAndModify: false}
      )
      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  addAppointmentNotes: async (args, req) => {
    console.log("Resolver: addAppointmentNotes...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const notes = args.appointmentInput.notes;
      const splitNotes = notes.split(",");
      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {$addToSet: { notes: {$each: splitNotes} }},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');

      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  deleteAppointmentNote: async (args, req) => {
    console.log("Resolver: deleteAppointmentNote...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const note = args.appointmentInput.note;
        const appointment = await Appointment.findOneAndUpdate(
          {_id:args.appointmentId},
          {$pull: { notes: note }},
          {new: true, useFindAndModify: false}
        )
        .populate('consultants')
        .populate('visit')
        .populate('creator')
        .populate('patient');
        return {
          ...appointment._doc,
          _id: appointment.id,
          title: appointment.title,
          date: appointment.date
        };
    } catch (err) {
      throw err;
    }
  },
  addAppointmentTags: async (args, req) => {
    console.log("Resolver: addAppointmentTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tags = args.appointmentInput.tags;
      const splitTags = tags.split(",");
      const appointment = await Appointment.findOneAndUpdate(
        {_id:args.appointmentId},
        {$addToSet: { tags: {$each: splitTags} }},
        {new: true, useFindAndModify: false}
      )
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');

      return {
        ...appointment._doc,
        _id: appointment.id,
        title: appointment.title,
        date: appointment.date
      };
    } catch (err) {
      throw err;
    }
  },
  deleteAppointmentTag: async (args, req) => {
    console.log("Resolver: deleteAppointmentTag...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const tag = args.appointmentInput.tag;
        const appointment = await Appointment.findOneAndUpdate(
          {_id:args.appointmentId},
          {$pull: { tags: tag }},
          {new: true, useFindAndModify: false}
        )
        .populate('consultants')
        .populate('visit')
        .populate('creator')
        .populate('patient');
        return {
          ...appointment._doc,
          _id: appointment.id,
          title: appointment.title,
          date: appointment.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteAppointmentById: async (args, req) => {
    console.log("Resolver: deleteAppointmentById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const appointment = await Appointment.findByIdAndRemove({_id:args.appointmentId});
        return {
          ...appointment._doc,
          _id: appointment.id,
          title: appointment.title,
          date: appointment.date
        };
    } catch (err) {
      throw err;
    }
  },
  createAppointment: async (args, req) => {
    console.log("Resolver: createAppointment...");
    try {

      let consultants = [];
      const creator = await User.findById({_id: args.activityId})
      if (creator.role === 'Doctor') {
        consultants.push(creator);
      }
      const patient = await Patient.findById({_id: args.patientId})
      const today = moment();


      if (moment(args.appointmentInput.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
        console.log('...ummm no! Please pick a date today or in the future...');
        throw new Error('...ummm no! Please pick a date today or in the future...');
      }
      const appointmentExists = await Appointment.find({
          date: args.appointmentInput.date,
          title: args.appointmentInput.title
      })
      // console.log('appointmentExists',appointmentExists);
      if (appointmentExists.length > 0) {
        console.log('...an appointment w/ this date & title exists already...check your info and try again...');
        throw new Error('...an appointment w/ this date & title exists already...check your info and try again...')
      }
      // console.log('1:',moment(args.appointmentInput.date));
      const appointment = new Appointment({
        title: args.appointmentInput.title,
        type: args.appointmentInput.type,
        subType: args.appointmentInput.subType,
        date: args.appointmentInput.date,
        time: args.appointmentInput.time,
        checkinTime:0,
        seenTime: 0,
        location: args.appointmentInput.location,
        description: args.appointmentInput.description,
        visit: null,
        patient: patient,
        consultants: consultants,
        inProgress: false,
        attended: false,
        important: args.appointmentInput.important,
        notes: [],
        tags: [],
        reminders: [],
        creator: creator
      });
      const result = await appointment.save();
      // console.log('appointment', appointment);
      const updatePatient = await Patient.findOneAndUpdate(
        {_id: patient._id},
        {$addToSet: {appointments: result}},
        {new: true, useFindAndModify: false}
      )
      // console.log('updatePatient',updatePatient);
      console.log('start');
      for (let index = 0; index < consultants.length; index++) {
        let consultant = consultants[index];
        console.log('loop',index);
        const updateConsultants = await User.findOneAndUpdate(
          {_id: consultant},
          {$addToSet: {appointments: result}},
          {new: true, useFindAndModify: false}
        )
        // console.log('updateConsultants',updateConsultants);
      }
      console.log('end');
      //
      return {
        ...result._doc,
        _id: result.id
      };
    } catch (err) {
      throw err;
    }
  }
};
