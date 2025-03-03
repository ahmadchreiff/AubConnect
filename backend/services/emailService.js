const nodemailer = require("nodemailer");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  host: "smtp.gmail.com", // Gmail's SMTP server
  port: 465, // Port for secure SMTP
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your App Password (not your regular Gmail password)
  },
});

// Function to send a verification email
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email address
    to: email, // Recipient email address
    subject: "Email Verification Code", // Email subject
    text: `Your verification code is: ${verificationCode}`, // Plain text body
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

module.exports = { sendVerificationEmail };