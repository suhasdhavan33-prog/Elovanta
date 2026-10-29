const express = require('express');
const {
  createSession,
  getMySessions,
  getJoinInfo,
  cancelSession,
} = require('../controllers/sessionController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, requireRole('tutor'), createSession);
router.get('/me', protect, getMySessions);
router.get('/:id/join', protect, getJoinInfo);
router.patch('/:id/cancel', protect, cancelSession);

module.exports = router;
