const Agenda = require("agenda");
const propertyEmailJob = require("../jobs/propertyEmail.job");
const sendEmailToSubscriber = require("../jobs/sendEmailToSubscriber.job");

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
});

propertyEmailJob(agenda);
sendEmailToSubscriber(agenda);

(async function () {
  await agenda.start();
})();

module.exports = agenda;
