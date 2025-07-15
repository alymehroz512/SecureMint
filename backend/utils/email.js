import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"SecureMint" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your SecureMint OTP for Password Reset',
    html: `
      <div style="font-family: 'Quicksand', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #004030; border-radius: 0px; background: rgba(193, 226, 164, 0.1);">
        <h2 style="text-align: center; color: #004030; margin-bottom: 20px;">SecureMint OTP</h2>
        <p style="font-size: 16px; text-align: center; color: #004030;">Hello User,</p>
        <p style="font-size: 16px; text-align: center; color: #004030;">Use the following OTP to reset your password. It is valid for 5 minutes.</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #000000; background: rgba(193, 226, 164, 0.3); padding: 10px 20px; border: 2px solid #004030; border-radius: 0px; display: inline-block; transition: all 0.3s ease;">${otp}</span>
        </div>
        <p style="font-size: 14px; text-align: center; color: #004030;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 14px; text-align: center; color: #004030; margin-top: 20px; border-top: 1px solid #004030; padding-top: 10px;">© ${new Date().getFullYear()} SecureMint. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};