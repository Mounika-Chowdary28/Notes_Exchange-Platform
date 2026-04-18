const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  authorName: { type: String },
  quality: { type: Number, default: 0 },
  fileUrl: { type: String },
  stats: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);