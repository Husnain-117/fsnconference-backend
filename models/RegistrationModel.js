// Model for registration data (for structure, not DB)
class RegistrationModel {
  constructor({
    fullName,
    email,
    phone,
    organization,
    department,
    designation,
    cityCountry,
    category,
    participationMode,
    culturalVisit,
    totalFee,
    transactionId,
    paymentDate,
    bankName,
    confirmAccuracy,
    agreeConduct
  }) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.organization = organization;
    this.department = department;
    this.designation = designation;
    this.cityCountry = cityCountry;
    this.category = category;
    this.participationMode = participationMode;
    this.culturalVisit = culturalVisit;
    this.totalFee = totalFee;
    this.transactionId = transactionId;
    this.paymentDate = paymentDate;
    this.bankName = bankName;
    this.confirmAccuracy = confirmAccuracy;
    this.agreeConduct = agreeConduct;
  }
}

export default RegistrationModel;
