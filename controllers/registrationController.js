import nodemailer from 'nodemailer';
import RegistrationModel from '../models/RegistrationModel.js';
import dotenv from 'dotenv';
dotenv.config();

// Set up transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const registerUser = async (req, res) => {
  try {
    const registration = new RegistrationModel(req.body);
    // Format the email content
    const mailOptions = {
      from: `Conference Registration <${process.env.MAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL, // The email address to receive the registration
      subject: `New Registration from ${registration.fullName}`,
      html: `
        <h2>New Registration Received</h2>
        <ul>
          <li><strong>Full Name:</strong> ${registration.fullName}</li>
          <li><strong>Email:</strong> ${registration.email}</li>
          <li><strong>Phone:</strong> ${registration.phone}</li>
          <li><strong>City & Country:</strong> ${registration.cityCountry}</li>
          <li><strong>Organization:</strong> ${registration.organization}</li>
          <li><strong>Department:</strong> ${registration.department}</li>
          <li><strong>Designation:</strong> ${registration.designation}</li>
          <li><strong>Category:</strong> ${registration.category}</li>
          <li><strong>Participation Mode:</strong> ${registration.participationMode}</li>
          <li><strong>Cultural Visit:</strong> ${registration.culturalVisit}</li>
          <li><strong>Total Fee Paid:</strong> ${registration.totalFee}</li>
          <li><strong>Transaction ID:</strong> ${registration.transactionId}</li>
          <li><strong>Payment Date:</strong> ${registration.paymentDate}</li>
          <li><strong>Bank Name:</strong> ${registration.bankName}</li>
          <li><strong>Confirmed Accuracy:</strong> ${registration.confirmAccuracy ? 'Yes' : 'No'}</li>
          <li><strong>Agreed to Code of Conduct:</strong> ${registration.agreeConduct ? 'Yes' : 'No'}</li>
        </ul>
        <p style="color: #4F46E5;">This registration was submitted via the conference website.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Registration email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send registration email', error });
  }
};
