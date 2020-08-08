const authResolver = require('./auth');
const userResolver = require('./user');
const patientResolver = require('./patient');
const appointmentResolver = require('./appointment');
const visitResolver = require('./visit');
const reminderResolver = require('./reminder');
// const queueResolver = require('./queue');

const rootResolver = {
  ...authResolver,
  ...userResolver,
  ...patientResolver,
  ...appointmentResolver,
  ...visitResolver,
  ...reminderResolver,
  // ...queueResolver,
};

module.exports = rootResolver;
