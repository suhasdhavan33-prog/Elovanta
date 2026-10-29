const express = require('express');
const {
  submitLesson,
  getMyProgress,
  getChildProgress,
  getMyChildren,
} = require('../controllers/progressController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/submit', protect, requireRole('student'), submitLesson);
router.get('/me', protect, getMyProgress);
router.get('/children', protect, requireRole('parent'), getMyChildren);
router.get('/child/:studentId', protect, requireRole('parent'), getChildProgress);

module.exports = router;
