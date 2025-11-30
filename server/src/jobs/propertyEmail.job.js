const Subscribe = require("../models/Subscribe");

module.exports = (agenda) => {
  agenda.define("send-new-property-email", async (job, done) => {
    try {
      const { property } = job.attrs.data;
      const subscribers = await Subscribe.find();

      const delay = 5000; // 5 seconds
      subscribers.forEach((sub, i) => {
        agenda.schedule(
          new Date(Date.now() + i * delay),
          "send-email-to-subscriber",
          {
            email: sub.email,
            property,
          }
        );
      });

      done();
    } catch (error) {
      console.error("Agenda Job Error:", error);
      done(error);
    }
  });
};
