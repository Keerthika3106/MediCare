const cron = require('node-cron');
const MedicineIntake = require('../models/MedicineIntake');
const User = require('../models/User');
const { sendMedicineReminder, sendMissedMedicineAlert } = require('../utils/sms');

// Check for medicine reminders every minute
const startMedicineReminderJob = (io) => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes before
      const missedTime = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes after scheduled time

      // Find medicines due for reminder (15 minutes before scheduled time)
      const upcomingIntakes = await MedicineIntake.find({
        scheduledTime: {
          $gte: reminderTime,
          $lte: new Date(reminderTime.getTime() + 60 * 1000) // 1 minute window
        },
        status: 'pending',
        reminderSent: false
      }).populate('patientId', 'name phone email');

      // Send reminders
      for (const intake of upcomingIntakes) {
        if (intake.patientId.phone) {
          const confirmationUrl = `${process.env.CLIENT_URL}/confirm-medicine/${intake.smsToken}`;
          await sendMedicineReminder(intake.patientId, intake, confirmationUrl);
          
          intake.reminderSent = true;
          intake.alertsSent.push({
            type: 'reminder',
            recipient: intake.patientId._id
          });
          await intake.save();

          // Emit real-time update
          io.emit('medicineReminderSent', {
            intake,
            patientId: intake.patientId._id
          });
        }
      }

      // Find missed medicines (15 minutes after scheduled time)
      const missedIntakes = await MedicineIntake.find({
        scheduledTime: {
          $lte: missedTime
        },
        status: 'pending'
      }).populate('patientId', 'name phone email caretakerId familyMembers');

      // Send missed medicine alerts
      for (const intake of missedIntakes) {
        // Update status to missed
        intake.status = 'missed';
        await intake.save();

        const patient = await User.findById(intake.patientId._id)
          .populate('caretakerId', 'name phone')
          .populate('familyMembers', 'name phone');

        // Send alerts to caretaker
        if (patient.caretakerId && patient.caretakerId.phone) {
          await sendMissedMedicineAlert(patient.caretakerId, patient, intake);
          intake.alertsSent.push({
            type: 'caretaker',
            recipient: patient.caretakerId._id
          });
        }

        // Send alerts to family members
        if (patient.familyMembers && patient.familyMembers.length > 0) {
          for (const family of patient.familyMembers) {
            if (family.phone) {
              await sendMissedMedicineAlert(family, patient, intake);
              intake.alertsSent.push({
                type: 'family',
                recipient: family._id
              });
            }
          }
        }

        await intake.save();

        // Emit real-time update
        io.emit('medicineMissed', {
          intake,
          patientId: intake.patientId._id
        });
      }

    } catch (error) {
      console.error('Medicine reminder job error:', error);
    }
  });

  console.log('Medicine reminder job started');
};

module.exports = { startMedicineReminderJob };