// utils/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,  
      subject: 'Your OTP Code - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Account</h2>
          <p>Your One-Time Password (OTP) for account verification is:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };
    await transporter.verify();
    console.log("Server is ready to take our messages");

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
};