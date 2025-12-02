const { SMTPServer } = require("smtp-server");

// Fake SMTP server
const server = new SMTPServer({
  onData(stream, session, callback) {
    let mailData = "";
    // Collect chunks of email as they arrive// Collect chunks of email as they arrive
    stream.on("data", (chunk) => {
      mailData += chunk;
    });
    // When the full email has arrived
    stream.on("end", () => {
      console.log("\n===== EMAIL RECEIVED =====");
      console.log(mailData); // Print full email content
      console.log("===== END EMAIL =====\n");
      callback(); // Tell the server we're done
    });
  },

  disabledCommands: ["AUTH"], // No login required
});

server.listen(1025, () => {
  console.log("Fake SMTP server running on http://localhost:1025");
});
