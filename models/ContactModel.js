// Model for Contact Us form data (for structure, not DB)
// Keeping symmetry with RegistrationModel so backend controller can validate
// This is **not** a Mongoose schema – it is a simple JS class used to shape
// the request payload before persisting / sending elsewhere.

class ContactModel {
  constructor({ name, email, organization, subject, message, inquiryType }) {
    this.name = name;
    this.email = email;
    this.organization = organization;
    this.subject = subject;
    this.message = message;
    this.inquiryType = inquiryType;
  }
}

export default ContactModel;
