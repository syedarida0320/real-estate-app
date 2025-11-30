const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
});

require("../jobs/propertyEmail.job")(agenda);
require("../jobs/sendEmailToSubscriber.job")(agenda);

(async function() {
  await agenda.start();
})();

module.exports = agenda;
