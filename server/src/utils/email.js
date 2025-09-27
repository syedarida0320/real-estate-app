// utils/email.js
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendEmail = async (to, subject, templateName, data = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Render EJS template into HTML
    const templatePath = path.join(__dirname, "..", "views", "emails", `${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, data);

    const info = await transporter.sendMail({
      from: `"Real Estate App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, // ✅ send HTML instead of text
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };
