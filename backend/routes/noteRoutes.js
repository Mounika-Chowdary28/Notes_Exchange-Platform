const express = require('express');
const router = express.Router();
const { getNotes, getNoteById } = require('../controllers/noteController');

router.get('/', getNotes);
router.get('/:id', getNoteById);

module.exports = router;