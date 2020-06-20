const DataLoader = require('dataloader');
const Staff = require('../../models/staff');
const Patient = require('../../models/patient');
const Appointment = require('../../models/appointment');
const Visit = require('../../models/visit');
const Reminder = require('../../models/reminder');
const { dateToString } = require('../../helpers/date');

const staffLoader = new DataLoader(staffIds => {
  return staffs(staffIds);
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


const staff = async staffIds => {
  try {
    const staff = await Staff.find({ _id: { $in: staffIds } });
    staffs.sort((a, b) => {
      return (
        userIds.indexOf(a._id.toString()) - staffIds.indexOf(b._id.toString())
      );
    });
    return staff.map(singleStaff => {
      return transformStaff(singleStaff);
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
      return transformPatient(appointment);
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
      return transformPatient(visit);
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
      return transformPatient(reminder);
    });
  } catch (err) {
    throw err;
  }
};


const singleStaff = async staffId => {
  try {
    const staff = await staffLoader.load(staffId.toString());
    return staff;
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


const transformStaff = staff => {
  return {
    ...staff._doc,
    _id: staff.id,
    name: staff.name,
    email: staff.email,
  };
};
const transformPatient = patient => {
  return {
    ...patient._doc,
    _id: patient.id,
    name: patient.name,
    email: patient.email,
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



exports.transformStaff = transformStaff;
exports.transformPatient = transformPatient;
exports.transformAppointment = transformAppointment;
exports.transformVisit = transformVisit;
exports.transformReminder = transformReminder;
