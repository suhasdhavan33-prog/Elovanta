const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['phonics', 'sounds', 'reading', 'vocabulary', 'grammar'],
      required: true,
    },
    minAge: { type: Number, required: true, default: 4 },
    maxAge: { type: Number, required: true, default: 14 },
    thumbnailColor: { type: String, default: '#6C63FF' },
    icon: { type: String, default: '📘' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
