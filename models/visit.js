const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const visitSchema = new Schema({
  date: {type: Date},
  time: {type: String},
  title: {type: String},
  type: {type: String},
  subType: {type: String},
  patient: {type: Schema.Types.ObjectId,ref: 'Patient'},
  consultants: [{type: Schema.Types.ObjectId,ref: 'User'}],
  appointment: {type: Schema.Types.ObjectId,ref: 'Appointment'},
  complaints: [{
      title: {type:String},
      description: {type:String},
      anamnesis: {type:String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }],
  surveys: [{
      title: {type:String},
      description: {type:String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }],
  systematicInquiry: [{
      title: {type:String},
      description: {type:String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }],
  vitals:[{
      pr: {type: Number},
      bp1: {type: Number},
      bp2: {type: Number},
      rr: {type: Number},
      temp: {type: Number},
      sp02: {type: Number},
      heightUnit: {type: String},
      heightValue: {type: Number},
      weightUnit: {type: String},
      weightValue: {type: Number},
      bmi: {type: Number},
      urine:{
        type: {type: String},
        value: {type: String},
      },
      highlighted: {type: Boolean},
    }],
  examination: [{
    general: {type: String},
    area: {type:String},
    type: {type:String,},
    measure: {type:String},
    value: {type:String},
    description: {type:String},
    followUp: {type:Boolean},
    attachments:[{type: String}],
    highlighted: {type: Boolean},
    _id: false
  }],
  investigation: [{
      type: {type: String},
      title: {type: String},
      description: {type: String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }],
  diagnosis: [{
      type: {type: String},
      title: {type: String},
      description: {type: String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }],
  treatment: [{
      type: {type: String},
      title: {type: String},
      description: {type: String},
      dose: {type: String},
      frequency: {type: String},
      attachments:[{type: String}],
      highlighted: {type: Boolean},
        _id: false
    }
  ],
  billing:[{
    title: {type: String},
    type: {type: String},
    description: String,
    amount: {type: Number},
    paid: {type: Boolean},
    attachments:[{type: String}],
    notes: {type: String},
    highlighted: {type: Boolean},
    _id: false
  }],
  vigilance:[{
    chronicIllness: {
      diabetes: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      hbp: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      dyslipidemia: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      cad: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      }
    },
    lifestyle: {
      weight: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      diet: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      smoking: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      substanceAbuse: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      exercise: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      allergies: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      asthma: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      }
    },
    screening: {
      breast: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      prostate: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      cervix: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      colon: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      dental: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      }
    },
    vaccines: {
      influenza: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      varicella: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      hpv: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      mmr: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      tetanus: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      pneumovax: {
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      },
      other: {
        name: {type: String},
        medication: {type: Boolean},
        testing: {type: Boolean},
        comment: {type: String}
      }
    },
    highlighted: {type: Boolean},
    _id: false
  }],
  images: [{
    name: {type:String},
    type: {type: String},
    path: {type: String},
    highlighted: {type: Boolean},
    _id : false
  }],
  files: [{
    name: {type:String},
    type: {type: String},
    path: {type: String},
    highlighted: {type: Boolean},
    _id : false
  }],
},
  { timestamps: true }
);

module.exports = mongoose.model('Visit', visitSchema);
