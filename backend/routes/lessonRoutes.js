const express = require('express');
const {
  getLessonForLearner,
  getLessonForAdmin,
  createLesson,
  updateLesson,
  deleteLesson,
} = require('../controllers/lessonController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', getLessonForLearner);
router.get('/:id/admin', protect, requireRole('admin'), getLessonForAdmin);
router.post('/', protect, requireRole('admin'), createLesson);
router.put('/:id', protect, requireRole('admin'), updateLesson);
router.delete('/:id', protect, requireRole('admin'), deleteLesson);

module.exports = router;
