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

  getAllQueues: async (args, req) => {
    console.log("Resolver: getAllQueues...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const queues = await Queue.find({})
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return queues.map(queue => {
        return transformQueue(queue,);
      });
    } catch (err) {
      throw err;
    }
  },
  getQueueById: async (args, req) => {
    console.log("Resolver: getQueueById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const queue = await Queue.findById(args.queueId)
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  getQueueByField: async (args, req) => {
    console.log("Resolver: getQueueByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const queue = await Queue.findById(query)
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  getQueueToday: async (args, req) => {
    console.log("Resolver: getQueueToday...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = moment().format('YYYY-MM-DD')
      const queue = await Queue.findOne({date: today})
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  addQueueSlot: async (args, req) => {
    console.log("Resolver: addQueueSlot...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findById({_id: args.patientId});
      const consultant = await User.findById({_id: args.consultantId});
      const time = moment().format('h:mm:ss a')
      let number;
      const allSlots = await Queue.findById({_id: args.queueId});
      number = allSlots.slots.length + 1;
      let slotPatients = allSlots.slots.map(x=>x.patient);

      const slot = {
        number: number,
        time: time,
        patient: patient,
        consultant: consultant,
        seen: false,
        seenTime: ''
      }
      // console.log('1:',number);
      // console.log('a:',allSlots);
      // console.log('2:',slot);
      // console.log('3:',time);
      // console.log('4:',slotPatients);
      const slotPatientExists = slotPatients.includes(patient._id)

      if (consultant.role === 'Staff' || consultant.role === 'Admin') {
        console.log('...check the consultant id! Doctors and Nurses only...');
        throw new Error('...check the consultant id! Doctors and Nurses only...')
      }
      if (slotPatientExists) {
        console.log('...a slot for this patient already exists...');
        throw new Error('...a slot for this patient already exists...')
      }

      const queue = await Queue.findOneAndUpdate(
        {_id: args.queueId},
        {$addToSet: {slots: slot}},
        {new: true, useFindAndModify: false}
      )
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  queueSlotSeen: async (args, req) => {
    console.log("Resolver: queueSlotSeen...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const time = moment().format('h:mm:ss a');
      const queue = await Queue.findOneAndUpdate(
        {_id: args.queueId, 'slots.number': args.queueInput.slotNumber},
        {
          // {$inc: {currentSlot: 1}},
          'slots.$.seen': true,
          'slots.$.seenTime': time
        },
        {new: true, useFindAndModify: false}
      )
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  queueSlotUnseen: async (args, req) => {
    console.log("Resolver: queueSlotUnseen...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const time = moment().format('h:mm:ss a');
      const queue = await Queue.findOneAndUpdate(
        {_id: args.queueId, 'slots.number': args.queueInput.slotNumber},
        {
          // {$inc: {currentSlot: 1}},
          'slots.$.seen': false,
          'slots.$.seenTime': ''
        },
        {new: true, useFindAndModify: false}
      )
      .populate({
        path: 'slots',
        populate: {
          path: 'consultant',
          model: 'User'
        }
      })
      .populate({
        path: 'slots',
        populate: {
          path: 'patient',
          model: 'Patient'
        }
      })
      .populate('creator');
      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  queueSlotChange: async (args, req) => {
    console.log("Resolver: queueSlotChange...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const patient = await Patient.findById({_id: args.patientId});

      // const queue = await Queue.findOneAndUpdate(
      //   {_id: args.queueId, 'slots.patient': patient._id},
      //   {},
      //   {new: true, useFindAndModify: false}
      // )
      // .populate('slot.consultant')
      // .populate('slot.patient')
      // .populate('creator');


      return {
        ...queue._doc,
        _id: queue.id,
        date: queue.date
      };
    } catch (err) {
      throw err;
    }
  },
  //
  deleteQueueById: async (args, req) => {
    console.log("Resolver: deleteQueueById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const queue = await Queue.findByIdAndRemove({_id:args.queueId});
        return {
          ...queue._doc,
          _id: queue.id,
          date: queue.date
        };
    } catch (err) {
      throw err;
    }
  },
  deleteQueueSlot: async (args, req) => {
    console.log("Resolver: deleteQueueSlot...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const preQueue = await Queue.findById({_id:args.queueId})
        const thisSlot = preQueue.slots.filter(x=> x.number === args.queueInput.slotNumber)[0]
        const greaterSlots = preQueue.slots.filter(x=> x.number > args.queueInput.slotNumber)

        console.log('start');
        for (let index = 0; index < greaterSlots.length; index++) {
          let greaterSlot = greaterSlots[index];
          // console.log('loop',index);
          const updateQueue = await Queue.findOneAndUpdate(
            {
              _id:args.queueId,
              'slots.number': greaterSlot.number,
            },
            {$inc: {'slots.$.number': -1}},
            {new: true, useFindAndModify: false}
          )
        }
        console.log('end');

        const queue = await Queue.findOneAndUpdate(
          {_id: args.queueId},
          {$pull: {slots: thisSlot}},
          {new: true, useFindAndModify: false}
        )
        .populate({
          path: 'slots',
          populate: {
            path: 'consultant',
            model: 'User'
          }
        })
        .populate({
          path: 'slots',
          populate: {
            path: 'patient',
            model: 'Patient'
          }
        })
        .populate('creator');
        return {
          ...queue._doc,
          _id: queue.id,
          date: queue.date
        };
    } catch (err) {
      throw err;
    }
  },
  createQueue: async (args, req) => {
    console.log("Resolver: createQueue...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const creator = await User.findById({_id: args.activityId});
      const today = moment().format('YYYY-MM-DD');
      // const today = '2020-08-02';
      const queueExists =  await Queue.find({date: today})
      if (queueExists.length > 0) {
        console.log('...ahem! 1 Queue per day please...',queueExists.length);
        throw new Error('...ahem! 1 Queue per day please...')
      }

      const queue = new Queue({
        date: today,
        currentSlot: 0,
        slots: [],
        creator: creator
      });
      const result = await queue.save();

      // console.log('start');
      // for (let index = 0; index < consultants.length; index++) {
      //   let consultant = consultants[index];
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
