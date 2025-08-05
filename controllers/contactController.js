import nodemailer from 'nodemailer';
import ContactModel from '../models/ContactModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Gmail (or any SMTP) transporter using .env variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Handle contact-us submissions and forward them via e-mail.
 * POST /api/contact
 */
export const submitContact = async (req, res) => {
  try {
    const contact = new ContactModel(req.body);

    const mailOptions = {
      from: `Conference Website <${process.env.MAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Contact Inquiry — ${contact.subject || 'No subject'} (${contact.name})`,
      html: `
        <h2 style="margin-bottom:16px;">New Contact Inquiry</h2>
        <ul style="line-height:1.6;">
          <li><strong>Name:</strong> ${contact.name}</li>
          <li><strong>Email:</strong> ${contact.email}</li>
          <li><strong>Organization:</strong> ${contact.organization || '—'}</li>
          <li><strong>Inquiry Type:</strong> ${contact.inquiryType || '—'}</li>
          <li><strong>Subject:</strong> ${contact.subject}</li>
        </ul>
        <h3>Message</h3>
        <p style="white-space:pre-line;">${contact.message}</p>
        <p style="color:#4F46E5;margin-top:24px;">This message was sent from the Contact Us form.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact inquiry sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send contact inquiry', error });
  }
};
