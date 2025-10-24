const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

/**
 * Sends an agent email using Mailtrap + EJS templates
 * @param {string} to - Receiver email address
 * @param {string} subject - Email subject
 * @param {string} templateName - Name of EJS template (without .ejs extension)
 * @param {object} data - Dynamic data for template rendering
 */
const sendEmail = async (to, subject, templateName, data = {}) => {
  try {
    // ✅ Configure Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Path to the EJS template file
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "emails",
      `${templateName}.ejs`
    );

    // ✅ Render the EJS template with dynamic data
    const html = await ejs.renderFile(templatePath, data);

    // ✅ Send the email
    const info = await transporter.sendMail({
      from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Agent email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send agent email:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
