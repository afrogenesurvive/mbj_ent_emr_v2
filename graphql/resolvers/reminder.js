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

const { transformReminder } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


// You might need this
// const foo = await mongoose.model('modelName').findOneAndUpdate({_id: args.staff/patientId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});

const sgMail = require('@sendgrid/mail');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  getAllReminders: async (args, req) => {
    console.log("Resolver: getAllReminders...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminders = await Reminder.find({})
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return reminders.map(reminder => {
        return transformReminder(reminder,);
      });
    } catch (err) {
      throw err;
    }
  },
  getReminderById: async (args, req) => {
    console.log("Resolver: getReminderById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminder = await Reminder.findById(args.reminderId)
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return {
        ...reminder._doc,
        _id: reminder.id,
        title: reminder.title,
      };
    } catch (err) {
      throw err;
    }
  },
  getRemindersByField: async (args, req) => {
    console.log("Resolver: getRemindersByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Reminder.find(query)
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return patients.map(patient => {
        return transformReminder(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getRemindersByFieldRegex: async (args, req) => {
    console.log("Resolver: getRemindersByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const patients = await Reminder.find(query)
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return patients.map(patient => {
        return transformReminder(patient);
      });
    } catch (err) {
      throw err;
    }
  },
  getRemindersByCreator: async (args, req) => {
    console.log("Resolver: getRemindersByCreator...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminders = await Reminder.find({creator: args.creatorId})
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return reminders.map(reminder => {
        return transformReminder(reminder);
      });
    } catch (err) {
      throw err;
    }
  },
  getRemindersByAppointment: async (args, req) => {
    console.log("Resolver: getRemindersByAppointment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reminders = await Reminder.find({appointment: args.appointmentId})
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return reminders.map(reminder => {
        return transformReminder(reminder);
      });
    } catch (err) {
      throw err;
    }
  },
  getRemindersByRecipientsStaff: async (args, req) => {
    console.log("Resolver: getRemindersByRecipientsStaff...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const staff = args.staffIds.split(',');
      const reminders = await Reminder.find({
        staffRecipients: {$all: staff}
      })
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return reminders.map(reminder => {
        return transformReminder(reminder);
      });
    } catch (err) {
      throw err;
    }
  },
  getRemindersByRecipientsPatient: async (args, req) => {
    console.log("Resolver: getRemindersByRecipientsPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patients = args.patientIds.split(',');
      const reminders = await Reminder.find({
        patientRecipients: {$all: patients}
      })
      .populate('appointment')
      .populate('staffRecipients')
      .populate('patientRecipients');
      return reminders.map(reminder => {
        return transformReminder(reminder);
      });
    } catch (err) {
      throw err;
    }
  },
  updateReminderAllFields: async (args, req) => {
    console.log("Resolver: updateReminderAllFields...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const reminder = await Reminder.findOneAndUpdate(
        {_id:args.reminderId},
        {

        },
        {new: true, useFindAndModify: false})
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
      return {
        ...reminder._doc,
        _id: reminder.id,
        title: reminder.title,
      };
    } catch (err) {
      throw err;
    }
  },
  updateReminderSingleField: async (args, req) => {
    console.log("ResolverupdateReminderSingleField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let query =  '';
      const resolverField = args.field;
      if (resolverField === 'triggerUnit' || resolverField === 'triggerValue') {
        console.log('...umm no!!! use updateReminderTrigger instead...');
        throw new Error('...umm no!!! use updateReminderTrigger instead...')
      }
      if (resolverField === 'type') {
        console.log('...umm no!!! create a new Reminder instead...');
        throw new Error('...umm no!!! create a new Reminder instead...')
      }
      const resolverQuery = args.query;
      query = {[resolverField]:resolverQuery};
      const reminder = await Reminder.findOneAndUpdate(
        {_id:args.reminderId},
        query,
        {new: true, useFindAndModify: false})
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
      return {
        ...reminder._doc,
        _id: reminder.id,
        title: reminder.title
      };
    } catch (err) {
      throw err;
    }
  },
  addReminderRecipientPatient: async (args, req) => {
    console.log("Resolver: addReminderRecipientPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const patient = await Patient.findById({_id: args.patientId})

        const reminder = await Reminder.findOneAndUpdate(
          {_id:args.reminderId},
          {$addToSet: {patientRecipients: patient}},
          {new: true, useFindAndModify: false}
        )
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
        return {
          ...reminder._doc,
          _id: reminder.id,
          title: reminder.title,
        };
    } catch (err) {
      throw err;
    }
  },
  deleteReminderRecipientPatient: async (args, req) => {
    console.log("Resolver: deleteReminderRecipientPatient...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const reminder = await Reminder.findOneAndUpdate(
          {_id:args.reminderId},
          {$pull: {patientRecipients: args.patientId}},
          {new: true, useFindAndModify: false}
        );
        return {
          ...reminder._doc,
          _id: reminder.id,
          title: reminder.title,
        };
    } catch (err) {
      throw err;
    }
  },
  addReminderRecipientStaff: async (args, req) => {
    console.log("Resolver: addReminderRecipientStaff...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const staff = await User.findById({_id: args.staffId})

        const reminder = await Reminder.findOneAndUpdate(
          {_id:args.reminderId},
          {$addToSet: {staffRecipients: staff}},
          {new: true, useFindAndModify: false}
        )
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
        return {
          ...reminder._doc,
          _id: reminder.id,
          title: reminder.title,
        };
    } catch (err) {
      throw err;
    }
  },
  deleteReminderRecipientStaff: async (args, req) => {
    console.log("Resolver: deleteReminderRecipientStaff...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const reminder = await Reminder.findOneAndUpdate(
          {_id:args.reminderId},
          {$pull: {staffRecipients: args.staffId}},
          {new: true, useFindAndModify: false}
        )
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
        return {
          ...reminder._doc,
          _id: reminder.id,
          title: reminder.title,
        };
    } catch (err) {
      throw err;
    }
  },
  updateReminderTrigger: async (args, req) => {
    console.log("Resolver: updateReminderTrigger...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        preReminder = await Reminder.findById({_id: args.reminderId})
        .populate('appointment')
        .populate('staffRecipients')
        .populate('patientRecipients');
        const appointment = preReminder.appointment;
        const trigger = {
          unit: args.reminderInput.triggerUnit,
          value: args.reminderInput.triggerValue
        }

        let sendDate;
        let sendTime;
        if (preReminder.type === 'Reminder') {
          console.log('Reminder');
          const dateTime = moment(appointment.date).add(1,'d').format('YYYY-MM-DD')+'T'+appointment.time+'';
          start = moment(dateTime);
          sendDate = moment(start).subtract(trigger.value, trigger.unit);
          console.log('dateTime',dateTime,'start',start,'moment(start)',moment(start));
          console.log('sendDate',sendDate);
        }
        if (preReminder.type === 'FollowUp') {
          console.log('FollowUp');
          const dateTime = moment(appointment.date).add(1,'d').format('YYYY-MM-DD')+'T'+appointment.time+'';
          start = moment(dateTime);
          sendDate = moment(start).add(trigger.value, trigger.unit);
          console.log('dateTime',dateTime,'start',start,'moment(start)',moment(start));
          console.log('sendDate',sendDate);
        }
        console.log('sendDate',moment(sendDate).format().split('T')[1].substr(0,5));
        sendTime = moment(sendDate).format().split('T')[1].substr(0,5);
        const tooLate = sendDate < moment();

        console.log('appointment.date');
        console.log('oldTrigger',preReminder.trigger);
        console.log('oldSendDate',preReminder.sendDate);
        console.log('oldSendTime',preReminder.sendTime);
        console.log('newTrigger',trigger);
        console.log('newSendDate',sendDate);
        console.log('newSendTime',sendTime);

        console.log('tooLate',tooLate);
        if (tooLate === true) {
          console.log('...the Send Date of this Reminder is in the past!!! Check the date of the Appointment...');
          throw new Error('...the Send Date of this Reminder is in the past!!! Check the date of the Appointment...');
        }


        // const reminder = await Reminder.findOneAndUpdate(
        //   {_id:args.reminderId},
        //   {
        //     'trigger.unit': trigger.unit,
        //     'trigger.value': trigger.value
        //   },
        //   {new: true, useFindAndModify: false}
        // )
        // .populate('appointment')
        // .populate('staffRecipients')
        // .populate('patientRecipients');
        // return {
        //   ...reminder._doc,
        //   _id: reminder.id,
        //   title: reminder.title,
        // };
    } catch (err) {
      throw err;
    }
  },
  deleteReminderById: async (args, req) => {
    console.log("Resolver: deleteReminderById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const reminder = await Reminder.findByIdAndRemove({_id:args.reminderId});
        return {
          ...reminder._doc,
          _id: reminder.id,
          title: reminder.title,
        };
    } catch (err) {
      throw err;
    }
  },
  createReminder: async (args, req) => {
    console.log("Resolver: createReminder...");
    try {
      const creator = await User.findById({_id: args.activityId});
      const appointment = await Appointment.findById({_id: args.appointmentId})
      .populate('consultants')
      .populate('visit')
      .populate('creator')
      .populate('patient');
      const preConsultants = appointment.consultants;

      const patient = appointment.patient;
      // console.log('patient',patient);
      // console.log('consultants',consultants);
      // console.log('appointment',appointment);
      // console.log('appointmentdate',appointment.date);
      // console.log('appointmentdate2',moment(appointment.date));
      const today = moment();
      let triggerUnit = args.reminderInput.triggerUnit;
      let triggerValue = args.reminderInput.triggerValue;
      // console.log('trigger',triggerUnit,triggerValue);
      let staffRecipients = [];
      let patientRecipients = [];
      console.log('start');
      for (let index = 0; index < preConsultants.length; index++) {
        let consultant = preConsultants[index];
        console.log('loop',index);
        staffRecipients.push(consultant);
        // const getConsultant = await User.findById({_id: consultant})
      }
      console.log('end');

      patientRecipients.push(patient);
      console.log('staffRecipients',staffRecipients);
      let sendDate;
      let sendTime;
      if (args.reminderInput.type === 'Reminder') {
        console.log('Reminder');
        const dateTime = moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD')+'T'+appointment.time+'';
        start = moment(dateTime);
        sendDate = moment(start).subtract(triggerValue, triggerUnit);
        console.log('dateTime',dateTime,'start',start,'moment(start)',moment(start));
        console.log('sendDate',sendDate);
      }
      if (args.reminderInput.type === 'FollowUp') {
        console.log('FollowUp');
        const dateTime = moment(appointment.date).tz("America/Bogota").format('YYYY-MM-DD')+'T'+appointment.time+'';
        start = moment(dateTime);
        sendDate = moment(start).tz("America/Bogota").add(triggerValue, triggerUnit);
        console.log('dateTime',dateTime,'start',start,'moment(start)',moment(start));
        console.log('sendDate',sendDate);
      }
      console.log('sendDate',moment(sendDate).tz("America/Bogota").format().split('T')[1].substr(0,5));
      sendTime = moment(sendDate).tz("America/Bogota").format().split('T')[1].substr(0,5);
      const tooLate = sendDate < moment();
      console.log('tooLate',tooLate);
      if (tooLate === true) {
        console.log('...the Send Date of this Reminder is in the past!!! Check the date of the Appointment...');
        throw new Error('...the Send Date of this Reminder is in the past!!! Check the date of the Appointment...');
      }

      const similarReminder = await Reminder.find({
        appointment: appointment._id,
        'trigger.unit': triggerUnit,
        'trigger.value': triggerValue
      })
      if (similarReminder.length > 0) {
        console.log('...similar reminder exists for this appointment!! change trigger and/or appointment...');
        throw new Error('...similar reminder exists for this appointment!! change trigger and/or appointment...')
      }

      const reminder = new Reminder({
        createDate: moment().tz("America/Bogota").format('YYYY-MM-DD'),
        sendDate: sendDate.format('YYYY-MM-DD'),
        sendTime: sendTime,
        creator: creator,
        type: args.reminderInput.type,
        subType: args.reminderInput.subType,
        title: args.reminderInput.title,
        trigger:{
          unit: triggerUnit,
          value: triggerValue
        },
        appointment: appointment,
        staffRecipients: staffRecipients,
        patientRecipients: patientRecipients,
        body: args.reminderInput.body,
        delivery:{
          type: args.reminderInput.deliveryType,
          params: args.reminderInput.deliveryParams,
          sent: false,
        }
      });
      console.log('reminder', reminder);

      const result = await reminder.save();

      const updateAppointment = await Appointment.findOneAndUpdate(
        {_id: appointment._id},
        {$addToSet: {reminders: result}},
        {new: true, useFindAndModify: false}
      )
      console.log('updateAppointment',updateAppointment._id,updateAppointment.reminders);

      console.log('start update staff');
      for (let index = 0; index < staffRecipients.length; index++) {
        let staff = staffRecipients[index];
        console.log('loop',index);

        const updateStaff = await User.findOneAndUpdate(
          {_id: staff._id},
          {$addToSet: {reminders: result}},
          {new: true, useFindAndModify: false}
        )
        console.log('updateStaff',updateStaff._id,updateStaff.reminders);
      }
      console.log('end update staff');
      console.log('start update patient');
      for (let index = 0; index < patientRecipients.length; index++) {
        let patient = patientRecipients[index];
        console.log('loop',index);

        const updatePatient = await Patient.findOneAndUpdate(
          {_id: patient._id},
          {$addToSet: {reminders: result}},
          {new: true, useFindAndModify: false}
        )
        console.log('updatePatient',updatePatient._id,updatePatient.reminders);
      }
      console.log('end update patient');
      // console.log('start');
      // for (let index = 0; index < array.length; index++) {
      //   let consultant = array[index];
      //   console.log('loop',index);
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
