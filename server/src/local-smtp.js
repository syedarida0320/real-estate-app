const { SMTPServer } = require("smtp-server");

// Fake SMTP server
const server = new SMTPServer({
  onData(stream, session, callback) {
    let mailData = "";

    stream.on("data", (chunk) => {
      mailData += chunk;
    });

    stream.on("end", () => {
      console.log("\n===== EMAIL RECEIVED =====");
      console.log(mailData);
      console.log("===== END EMAIL =====\n");
      callback();
    });
  },

  disabledCommands: ["AUTH"], // No login required
});

server.listen(1025, () => {
  console.log("Fake SMTP server running on http://localhost:1025");
});
