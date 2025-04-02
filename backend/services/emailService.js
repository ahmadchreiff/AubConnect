const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
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

const sendPasswordResetCode = async (email, resetCode) => {
  const mailOptions = {
    from: `AUBConnect <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Code",
    html: `Your reset code is: <strong>${resetCode}</strong>`
  };
  
  await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendVerificationEmail, 
  sendPasswordResetCode 
};
