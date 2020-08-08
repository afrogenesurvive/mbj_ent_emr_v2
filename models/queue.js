const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const queueSchema = new Schema({
  date: {type: Date,required: true},
  slot: [{
    number: {type: Number},
    time: {type: String},
    patient: {type: Schema.Types.ObjectId,ref: 'Patient'},
    consultant: {type: Schema.Types.ObjectId,ref: 'User'},
    seen: {type: Boolean}
  }],
  creator: {type: Schema.Types.ObjectId,ref: 'User'}
},
  { timestamps: true }
);

module.exports = mongoose.model('Queue', queueSchema);
