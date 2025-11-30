const { sendEmailWithTransport } = require("../utils/mailer");

module.exports = (agenda) => {
  agenda.define("send-email-to-subscriber", async (job, done) => {
    try {
      const { email, property } = job.attrs.data;

      // Each email gets its own transport channel
      await sendEmailWithTransport(
        email,
        `New Property Added: ${property.title}`,
        "newProperty.ejs",
        { property }
      );
      done();
    } catch (error) {
      console.error("Failed to send email to:", job.attrs.data.email, error);
      done(error);
    }
  });
};
