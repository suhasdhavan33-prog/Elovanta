const mongoose = require('mongoose');
const LiveSession = require('../models/LiveSession');
const User = require('../models/User');
const {
  createRoom,
  deleteRoom,
  createMeetingToken,
  listRecordings,
  getRecordingAccessLink,
} = require('../config/daily');

const GRACE_SECONDS = 15 * 60;

const createSession = async (req, res) => {
  try {
    const { studentEmail, topic, scheduledAt, durationMinutes } = req.body;

    if (!studentEmail || !scheduledAt) {
      return res.status(400).json({ message: 'studentEmail and scheduledAt are required' });
    }

    const student = await User.findOne({ email: studentEmail.toLowerCase(), role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'No student account found with that email' });
    }

    const duration = durationMinutes || 30;
    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: 'Invalid scheduledAt date' });
    }

    const expUnixSeconds = Math.floor(scheduledDate.getTime() / 1000) + duration * 60 + GRACE_SECONDS;
    const roomName = new mongoose.Types.ObjectId().toHexString();

    const room = await createRoom(roomName, expUnixSeconds);

    const session = await LiveSession.create({
      tutor: req.user._id,
      student: student._id,
      topic: topic || 'Tutoring session',
      scheduledAt: scheduledDate,
      durationMinutes: duration,
      dailyRoomName: room.name,
      dailyRoomUrl: room.url,
    });

    const populated = await session.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getMySessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find({
      $or: [{ tutor: req.user._id }, { student: req.user._id }],
    })
      .populate('tutor', 'name email')
      .populate('student', 'name email')
      .sort({ scheduledAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJoinInfo = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isTutor = session.tutor.equals(req.user._id);
    const isStudent = session.student.equals(req.user._id);
    if (!isTutor && !isStudent) {
      return res.status(403).json({ message: 'You are not part of this session' });
    }
    if (session.status === 'cancelled') {
      return res.status(410).json({ message: 'This session was cancelled' });
    }

    const expUnixSeconds =
      Math.floor(session.scheduledAt.getTime() / 1000) + session.durationMinutes * 60 + GRACE_SECONDS;

    const token = await createMeetingToken(session.dailyRoomName, {
      userName: req.user.name,
      isOwner: isTutor,
      expUnixSeconds,
    });

    res.json({ roomUrl: session.dailyRoomUrl, token, isTutor, session });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getRecordings = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isParticipant = session.tutor.equals(req.user._id) || session.student.equals(req.user._id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not part of this session' });
    }

    const recordings = await listRecordings(session.dailyRoomName);
    const finished = recordings.filter((r) => r.status === 'finished');

    const withLinks = await Promise.all(
      finished.map(async (r) => ({
        id: r.id,
        startedAt: r.start_ts ? new Date(r.start_ts * 1000) : null,
        durationSeconds: r.duration,
        downloadUrl: await getRecordingAccessLink(r.id),
      }))
    );

    res.json(withLinks);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const cancelSession = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const isParticipant = session.tutor.equals(req.user._id) || session.student.equals(req.user._id);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not part of this session' });
    }

    session.status = 'cancelled';
    await session.save();
    await deleteRoom(session.dailyRoomName);

    res.json({ message: 'Session cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSession, getMySessions, getJoinInfo, getRecordings, cancelSession };
