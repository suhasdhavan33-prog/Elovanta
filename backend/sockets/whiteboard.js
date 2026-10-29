const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LiveSession = require('../models/LiveSession');

const boardState = new Map();

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Not authorized'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('Not authorized'));
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Not authorized'));
  }
};

const attachWhiteboard = (io) => {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    socket.on('join-session', async (sessionId) => {
      try {
        const session = await LiveSession.findById(sessionId);
        if (!session) return;

        const isParticipant =
          session.tutor.equals(socket.user._id) || session.student.equals(socket.user._id);
        if (!isParticipant) return;

        socket.join(sessionId);
        socket.emit('board-state', boardState.get(sessionId) || []);
      } catch (err) {
        // Invalid session id or lookup failure — silently ignore the join.
      }
    });

    socket.on('draw', ({ sessionId, segment }) => {
      if (!sessionId || !segment || !socket.rooms.has(sessionId)) return;
      const strokes = boardState.get(sessionId) || [];
      strokes.push(segment);
      boardState.set(sessionId, strokes);
      socket.to(sessionId).emit('draw', segment);
    });

    socket.on('clear-board', (sessionId) => {
      if (!sessionId || !socket.rooms.has(sessionId)) return;
      boardState.set(sessionId, []);
      io.to(sessionId).emit('clear-board');
    });
  });
};

module.exports = attachWhiteboard;
