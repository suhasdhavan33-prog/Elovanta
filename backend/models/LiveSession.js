const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, trim: true, default: 'Tutoring session' },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, default: 30, min: 10, max: 120 },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    dailyRoomName: { type: String, required: true },
    dailyRoomUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveSession', liveSessionSchema);
