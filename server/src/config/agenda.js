const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
});

// TODO: Import the function first then call it with agenda instance. This is not a good practice but works for now.
require("../jobs/propertyEmail.job")(agenda);
require("../jobs/sendEmailToSubscriber.job")(agenda);

(async function() {
  await agenda.start();
})();

module.exports = agenda;
