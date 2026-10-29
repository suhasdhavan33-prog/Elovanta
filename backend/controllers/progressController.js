const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

const submitLesson = async (req, res) => {
  try {
    const { lessonId, answers } = req.body;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    let score = 0;
    lesson.exercises.forEach((exercise, index) => {
      if (answers && answers[index] === exercise.correctAnswerIndex) {
        score += 1;
      }
    });

    const totalQuestions = lesson.exercises.length;

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, lesson: lesson._id },
      {
        user: req.user._id,
        lesson: lesson._id,
        course: lesson.course,
        completed: true,
        score,
        totalQuestions,
        completedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    const correctAnswers = lesson.exercises.map((exercise) => exercise.correctAnswerIndex);

    res.json({ progress, score, totalQuestions, correctAnswers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('course', 'title category icon')
      .populate('lesson', 'title')
      .sort({ updatedAt: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChildProgress = async (req, res) => {
  try {
    const User = require('../models/User');
    const child = await User.findOne({ _id: req.params.studentId, parent: req.user._id });
    if (!child) {
      return res.status(403).json({ message: 'This student is not linked to your account' });
    }
    const progress = await Progress.find({ user: child._id })
      .populate('course', 'title category icon')
      .populate('lesson', 'title')
      .sort({ updatedAt: -1 });
    res.json({ child: { name: child.name, email: child.email }, progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyChildren = async (req, res) => {
  try {
    const User = require('../models/User');
    const children = await User.find({ parent: req.user._id }).select('name email age');

    const results = await Promise.all(
      children.map(async (child) => {
        const progress = await Progress.find({ user: child._id })
          .populate('course', 'title category icon')
          .populate('lesson', 'title')
          .sort({ updatedAt: -1 });
        return { child, progress };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitLesson, getMyProgress, getChildProgress, getMyChildren };
