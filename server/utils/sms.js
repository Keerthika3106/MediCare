const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS function
const sendSMS = async (to, body) => {
  try {
    // Skip SMS in development if Twilio credentials are not set
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log(`SMS would be sent to ${to}: ${body}`);
      return { success: true, message: 'SMS simulation (no Twilio credentials)' };
    }

    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    console.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send medicine reminder SMS
const sendMedicineReminder = async (patient, medicine, confirmationUrl) => {
  const body = `💊 Medicine Reminder: Time to take ${medicine.medicineName} ${medicine.dosage}. Click to confirm: ${confirmationUrl}`;
  return await sendSMS(patient.phone, body);
};

// Send missed medicine alert
const sendMissedMedicineAlert = async (recipient, patient, medicine) => {
  const body = `⚠️ ALERT: ${patient.name} missed ${medicine.medicineName} ${medicine.dosage} scheduled at ${medicine.scheduledTime.toLocaleTimeString()}.`;
  return await sendSMS(recipient.phone, body);
};

// Send appointment reminder
const sendAppointmentReminder = async (patient, appointment) => {
  const body = `📅 Appointment Reminder: You have an appointment with Dr. ${appointment.doctorId.name} tomorrow at ${appointment.time}. Please confirm or reschedule if needed.`;
  return await sendSMS(patient.phone, body);
};

module.exports = {
  sendSMS,
  sendMedicineReminder,
  sendMissedMedicineAlert,
  sendAppointmentReminder
};