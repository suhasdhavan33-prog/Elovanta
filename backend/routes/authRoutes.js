const express = require('express');
const { register, login, getMe, createTutor, getTutors } = require('../controllers/authController');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/tutors', protect, requireRole('admin'), createTutor);
router.get('/tutors', protect, requireRole('admin'), getTutors);

module.exports = router;
