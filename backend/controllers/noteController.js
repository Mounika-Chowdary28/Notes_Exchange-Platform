const Note = require('../models/Note');
const Vote = require('../models/Vote');

// @desc    Get all notes with search and filtering
// @route   GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const { subjectCode, semester, branch, search } = req.query;
    let query = {};

    if (subjectCode) query.subjectCode = subjectCode;
    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query).populate('uploadedBy', 'name').sort({ createdAt: -1 }).lean();
    
    // If user is logged in, attach their vote status
    if (req.user) {
      const votes = await Vote.find({ userId: req.user._id, noteId: { $in: notes.map(n => n._id) } });
      const voteMap = votes.reduce((acc, v) => {
        acc[v.noteId.toString()] = v.voteType;
        return acc;
      }, {});
      
      notes.forEach(n => {
        n.userVote = voteMap[n._id.toString()] || null;
      });
    }

    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email').lean();
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    
    // Increment view count
    await Note.findByIdAndUpdate(req.params.id, { $inc: { 'stats.views': 1 } });
    note.stats.views += 1;

    // If user is logged in, attach their vote status
    if (req.user) {
      const vote = await Vote.findOne({ userId: req.user._id, noteId: note._id });
      note.userVote = vote ? vote.voteType : null;
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Upload a new note
// @route   POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { 
      title, subject, subjectCode, semester, branch, description,
      unit, tags, noteType, difficulty, examFocused, importantExam,
      labViva, handwritten, ocrIndexed, fileType, pyqBased
    } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const note = await Note.create({
      title,
      subject,
      subjectCode,
      semester,
      branch,
      description,
      unit,
      tags: tags ? JSON.parse(tags) : [],
      noteType,
      difficulty,
      examFocused: examFocused === 'true',
      importantExam: importantExam === 'true',
      labViva: labViva === 'true',
      handwritten: handwritten === 'true',
      ocrIndexed: ocrIndexed === 'true',
      pyqBased: pyqBased === 'true' || ['pyq', 'mid_term', 'end_sem'].includes(noteType),
      fileType,
      authorName: req.user.name,
      uploadedBy: req.user._id,
      fileUrl: req.file.path // Cloudinary returns the full URL in path
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Vote on a note
// @route   POST /api/notes/:id/vote
exports.voteNote = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const noteId = req.params.id;
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ success: false, error: 'Invalid vote type' });
    }

    // Check if user already voted
    let vote = await Vote.findOne({ userId, noteId });

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Atomic update logic
    if (vote) {
      if (vote.voteType === voteType) {
        // Toggle off: Remove vote and decrement
        await Vote.deleteOne({ _id: vote._id });
        const update = voteType === 'upvote' ? { 'stats.upvotes': -1 } : { 'stats.downvotes': -1 };
        const updatedNote = await Note.findByIdAndUpdate(noteId, { $inc: update }, { returnDocument: 'after' });
        
        return res.json({ 
          success: true, 
          data: { stats: updatedNote.stats, userVote: null } 
        });
      } else {
        // Change type: Update vote and adjust both counts
        vote.voteType = voteType;
        await vote.save();
        
        const update = voteType === 'upvote' 
          ? { 'stats.upvotes': 1, 'stats.downvotes': -1 } 
          : { 'stats.downvotes': 1, 'stats.upvotes': -1 };
          
        const updatedNote = await Note.findByIdAndUpdate(noteId, { $inc: update }, { returnDocument: 'after' });
        
        return res.json({ 
          success: true, 
          data: { stats: updatedNote.stats, userVote: voteType } 
        });
      }
    } else {
      // New vote: Create and increment
      await Vote.create({ userId, noteId, voteType });
      const update = voteType === 'upvote' ? { 'stats.upvotes': 1 } : { 'stats.downvotes': 1 };
      const updatedNote = await Note.findByIdAndUpdate(noteId, { $inc: update }, { returnDocument: 'after' });
      
      return res.json({ 
        success: true, 
        data: { stats: updatedNote.stats, userVote: voteType } 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Only uploader or admin can delete
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this note' });
    }

    await Note.deleteOne({ _id: note._id });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // Only uploader or admin can update
    if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this note' });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Verify a note (Admin only)
// @route   PUT /api/notes/:id/verify
exports.verifyNote = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to verify notes' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    note.verifiedFaculty = true;
    await note.save();

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Download note (increment counter)
// @route   POST /api/notes/:id/download
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    note.stats.downloads += 1;
    await note.save();

    res.json({ success: true, data: { fileUrl: note.fileUrl } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get system-wide stats (Admin only)
// @route   GET /api/notes/stats
exports.getSystemStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const totalNotes = await Note.countDocuments();
    const unverifiedNotes = await Note.countDocuments({ verifiedFaculty: false });
    const totalDownloads = await Note.aggregate([
      { $group: { _id: null, total: { $sum: "$stats.downloads" } } }
    ]);
    const totalViews = await Note.aggregate([
      { $group: { _id: null, total: { $sum: "$stats.views" } } }
    ]);

    const User = require('../models/User');
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalNotes,
        unverifiedNotes,
        totalUsers,
        totalDownloads: totalDownloads[0]?.total || 0,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};