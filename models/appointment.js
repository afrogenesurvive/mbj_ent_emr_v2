const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  title: {type: String,required: true},
  type: {type: String},
  subType: {type: String},
  date: {type: Date,required: true},
  time: {type: String},
  checkinTime: {type: String},
  seenTime: {type: String},
  location: {type: String,required: false},
  description: {type: String,required: false},
  visit: {type: Schema.Types.ObjectId,ref: 'Visit'},
  patient: {type: Schema.Types.ObjectId,ref: 'Patient'},
  consultants: [{type: Schema.Types.ObjectId,ref: 'User'}],
  inProgress: {type: Boolean},
  attended: {type: Boolean},
  important: {type: Boolean},
  notes: [{type:String}],
  tags: [{type:String}]
},
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
