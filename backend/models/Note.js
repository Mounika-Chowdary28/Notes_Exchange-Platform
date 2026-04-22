const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  subjectCode: { type: String, uppercase: true },
  semester: { type: Number },
  branch: { type: String },
  unit: { type: String, default: 'Unit 1' },
  fileType: { type: String },
  fileUrl: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  noteType: { type: String, default: 'full_notes' },
  difficulty: { type: String, default: 'medium' },
  verifiedFaculty: { type: Boolean, default: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String }, // For mock/anonymous or external authors
  stats: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  reportCount: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  versionLabel: { type: String, default: 'v1' },
  versions: [{
    v: { type: Number },
    label: { type: String },
    at: { type: Date, default: Date.now }
  }],
  ocrIndexed: { type: Boolean, default: false },
  bookmarkCountBase: { type: Number, default: 0 },
  pyqBased: { type: Boolean, default: false },
  bestForExams: { type: Boolean, default: false },
  examFocused: { type: Boolean, default: false },
  importantExam: { type: Boolean, default: false },
  labViva: { type: Boolean, default: false },
  handwritten: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);