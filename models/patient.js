const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  active: {type: Boolean, required: true},
  password: {type: String},
  title: {type: String},
  name: {type: String,required: true},
  lastName: {type: String,required: true},
  role: {type: String},
  username: {type: String,required: true},
  registration: {
    date: {type: Date},
    number: {type: String},
  },
  dob:{type: Date},
  age: {type:Number},
  gender: {type: String},
  contact: {
    phone: {type: String},
    phone2: {type: String},
    email: {type: String,required: true},
  },
  addresses: [{
    number: {type:Number},
    street: {type: String},
    town: {type: String},
    city: {type:String},
    parish: {type: String},
    country: {type:String},
    postalCode: {type:String},
    primary: {type: Boolean},
    _id : false
  }],
  loggedIn: {type: Boolean},
  clientConnected: {type: Boolean},
  verification:{
    verified:{type: Boolean},
    type:{type: String},
    code:{type: String}
  },
  expiryDate: {type: Date},
  referral: {
    date: {type: Date},
    reason: {type: String},
    physician: {
      name: {type: String},
      email: {type: String},
      phone: {type: String}
    }
  },
  attendingPhysician: {type: String},
  occupation: {
    role: {type: String},
    employer: {
      name: {type: String},
      phone: {type: String},
      email: {type: String},
      address: {type: String}
    }
  },
  insurance: {
    company: {type: String},
    policyNumber: {type: String},
    description: {type: String},
    expiryDate: {type: Date},
    subscriber: {
      company: {type: String},
      description: {type: String}
    }
  },
  nextOfKin: [{
    name: {type: String},
    relation: {type: String},
    contact: {
      email: {type: String},
      phone1: {type: String},
      phone2: {type: String}
    },
    _id: false
  }],
  allergies: [{
    type: {type:String,enum: ['Food','Drug']},
    title: {type:String},
    description: {type:String},
    attachments: [{type: String}],
      _id: false
  }],
  medication: [{
    title: {type: String},
    type: {type: String},
    description: {type: String},
    attachments: [{type: String}],
      _id: false
  }],
  images: [{
    name: {type:String},
    type: {type: String},
    path: {type: String},
    _id : false
  }],
  files: [{
    name: {type:String},
    type: {type: String},
    path: {type: String},
    _id : false
  }],
  notes: [{type: String}],
  tags: [{type: String}],
  appointments: [{type: Schema.Types.ObjectId,ref: 'Appointment'}],
  visits: [{type: Schema.Types.ObjectId,ref: 'Visit'}],
  reminders: [{type: Schema.Types.ObjectId,ref: 'Reminder'}],
  activity:[{
    date: {type: Date},
    request: {type: String},
    _id : false
  }]
},
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
