const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password, role, age, parentEmail } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    let parentId = null;
    if (role === 'student' && parentEmail) {
      const parentUser = await User.findOne({ email: parentEmail.toLowerCase(), role: 'parent' });
      if (parentUser) parentId = parentUser._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: ['student', 'parent'].includes(role) ? role : 'student',
      age,
      parent: parentId,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTutor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const tutor = await User.create({ name, email, password, role: 'tutor' });

    res.status(201).json({
      _id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      role: tutor.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).select('name email createdAt');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe, createTutor, getTutors };
