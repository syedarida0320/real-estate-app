const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

// Reusable Local SMTP Transport
function getLocalTransport() {
  return nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

// Function to send email using a separate transport
exports.sendEmailWithTransport = async (to, subject, templateName, data) => {
  try {
    // Create a new transport for each email
    const transporter = getLocalTransport();

    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "emails",
      templateName
    );

    const html = await ejs.renderFile(templatePath, {
      ...data,
      BASE_URL: process.env.BASE_URL,
      FRONTEND_URL: process.env.FRONTEND_URL,
    });

    await transporter.sendMail({
      from: `"Real Estate App" <test@local.com>`,
      to,
      subject,
      html,
    });

    console.log("Email sent to:", to);
    transporter.close(); // Close the transport after sending
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

exports.testingMail = async () => {
  try {
    const transporter = getLocalTransport();

    await transporter.sendMail({
      from: "test@local.com",
      to: "receiver@local.com",
      subject: "Local SMTP Test",
      text: "This is a test email from localhost SMTP",
    });
    console.log("Test mail sent to terminal!");
  } catch (error) {
    console.log("error => ", error);
  }
};
