const DataLoader = require('dataloader');
const User = require('../../models/user');
const Patient = require('../../models/patient');
const Appointment = require('../../models/appointment');
const Visit = require('../../models/visit');
const Reminder = require('../../models/reminder');
const Queue = require('../../models/queue');
const { dateToString } = require('../../helpers/date');

const userLoader = new DataLoader(userIds => {
  return users(userIds);
});
const patientLoader = new DataLoader(patientIds => {
  return patients(patientIds);
});
const appointmentLoader = new DataLoader(appointmentIds => {
  return appointments(appointmentIds);
});
const visitLoader = new DataLoader(visitIds => {
  return visits(visitIds);
});
const reminderLoader = new DataLoader(reminderIds => {
  return reminders(reminderIds);
});
const queueLoader = new DataLoader(queueIds => {
  return queues(queueIds);
});


const user = async userIds => {
  try {
    const user = await User.find({ _id: { $in: userIds } });
    users.sort((a, b) => {
      return (
        userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
      );
    });
    return user.map(singleUser => {
      return transformUser(singleUser);
    });
  } catch (err) {
    throw err;
  }
};
const patients = async patientIds => {
  try {
    const patients = await Patient.find({ _id: { $in: patientIds } });
    patients.sort((a, b) => {
      return (
        patientIds.indexOf(a._id.toString()) - patientIds.indexOf(b._id.toString())
      );
    });
    return patients.map(patient => {
      return transformPatient(patient);
    });
  } catch (err) {
    throw err;
  }
};
const appointments = async appointmentIds => {
  try {
    const appointments = await Appointment.find({ _id: { $in: appointmentIds } });
    appointments.sort((a, b) => {
      return (
        appointmentIds.indexOf(a._id.toString()) - appointmentIds.indexOf(b._id.toString())
      );
    });
    return appointments.map(appointment => {
      return transformAppointment(appointment);
    });
  } catch (err) {
    throw err;
  }
};
const visits = async visitIds => {
  try {
    const visits = await Visit.find({ _id: { $in: visitIds } });
    visits.sort((a, b) => {
      return (
        visitIds.indexOf(a._id.toString()) - visitIds.indexOf(b._id.toString())
      );
    });
    return visits.map(visit => {
      return transformVisit(visit);
    });
  } catch (err) {
    throw err;
  }
};
const reminders = async reminderIds => {
  try {
    const reminders = await Reminder.find({ _id: { $in: reminderIds } });
    reminders.sort((a, b) => {
      return (
        reminderIds.indexOf(a._id.toString()) - reminderIds.indexOf(b._id.toString())
      );
    });
    return reminders.map(reminder => {
      return transformReminder(reminder);
    });
  } catch (err) {
    throw err;
  }
};
const queues = async queueIds => {
  try {
    const queues = await Queue.find({ _id: { $in: queueIds } });
    queues.sort((a, b) => {
      return (
        queueIds.indexOf(a._id.toString()) - queueIds.indexOf(b._id.toString())
      );
    });
    return queues.map(queue => {
      return transformQueue(queue);
    });
  } catch (err) {
    throw err;
  }
};


const singleUser = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return user;
  } catch (err) {
    throw err;
  }
};
const singlePatient = async patientId => {
  try {
    const patient = await patientLoader.load(patientId.toString());
    return patient;
  } catch (err) {
    throw err;
  }
};
const singleAppointment = async appointmentId => {
  try {
    const appointment = await appointmentLoader.load(appointmentId.toString());
    return appointment;
  } catch (err) {
    throw err;
  }
};
const singleVisit = async visitId => {
  try {
    const visit = await visitLoader.load(visitId.toString());
    return visit;
  } catch (err) {
    throw err;
  }
};
const singleReminder = async reminderId => {
  try {
    const reminder = await reminderLoader.load(reminderId.toString());
    return reminder;
  } catch (err) {
    throw err;
  }
};
const singleQueue = async queueId => {
  try {
    const queue = await queueLoader.load(queueId.toString());
    return queue;
  } catch (err) {
    throw err;
  }
};


const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    name: user.name,
  };
};
const transformPatient = patient => {
  return {
    ...patient._doc,
    _id: patient.id,
    name: patient.name,
  };
};
const transformAppointment = appointment => {
  return {
    ...appointment._doc,
    _id: appointment.id,
    title: appointment.title,
    type: appointment.type,
  };
};
const transformVisit = visit => {
  return {
    ...visit._doc,
    _id: visit.id,
    date: visit.date,
    type: visit.type,
  };
};
const transformReminder = reminder => {
  return {
    ...reminder._doc,
    _id: reminder.id,
    sendDate: reminder.sendDate,
    sendTime: reminder.sendTime,
  };
};
const transformQueue = queue => {
  return {
    ...queue._doc,
    _id: queue.id,
    date: queue.date,
  };
};



exports.transformUser = transformUser;
exports.transformPatient = transformPatient;
exports.transformAppointment = transformAppointment;
exports.transformVisit = transformVisit;
exports.transformReminder = transformReminder;
exports.transformQueue = transformQueue;
