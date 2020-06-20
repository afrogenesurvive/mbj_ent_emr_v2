const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    createDate: {type: Date},
    sendDate: {type: Date},
    sendTime: {type: String},
    creator: {type: Schema.Types.ObjectId,ref: 'User'},
    type: {type:String, enum: ['Reminder', 'FollowUp']},
    subType: {type: String},
    title: {type: String},
    trigger: {
      unit: {type: String},
      value: {type: Number}
    },
    appointment: {type: Schema.Types.ObjectId,ref: 'Appointment'},
    recipients: [{type: Schema.Types.ObjectId,ref: 'User'}],
    body: {type: String},
    delivery: {
      type: {type:String, enum: ['Email', 'SMS', 'All']},
      params: {type:String},
      sent: {type: Boolean}
    }
},
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
