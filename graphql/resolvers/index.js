const authResolver = require('./auth');
const staffResolver = require('./staff');
const patientResolver = require('./patient');
const appointmentResolver = require('./appointment');
const visitResolver = require('./visit');
const reminderResolver = require('./reminder');

const rootResolver = {
  ...authResolver,
  ...staffResolver,
  ...patientResolver,
  ...appointmentResolver,
  ...visitResolver,
  ...reminderResolver,
};

module.exports = rootResolver;
