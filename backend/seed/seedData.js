require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const LiveSession = require('../models/LiveSession');

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Lesson.deleteMany({}),
    Progress.deleteMany({}),
    LiveSession.deleteMany({}),
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Admin Teacher',
    email: 'admin@elovanta.com',
    password: 'admin123',
    role: 'admin',
  });

  const parent = await User.create({
    name: 'Sample Parent',
    email: 'parent@elovanta.com',
    password: 'parent123',
    role: 'parent',
  });

  const student = await User.create({
    name: 'Sample Student',
    email: 'student@elovanta.com',
    password: 'student123',
    role: 'student',
    age: 6,
    parent: parent._id,
  });

  const tutor = await User.create({
    name: 'Sample Tutor',
    email: 'tutor@elovanta.com',
    password: 'tutor123',
    role: 'tutor',
  });

  console.log('Creating courses and lessons...');

  const phonicsCourse = await Course.create({
    title: 'Letter Sounds for Beginners',
    description: 'Learn the sounds each letter makes with fun examples.',
    category: 'phonics',
    minAge: 4,
    maxAge: 7,
    icon: '🔤',
    thumbnailColor: '#FF7A1A',
    order: 1,
  });

  const soundsCourse = await Course.create({
    title: 'Blending Sounds Into Words',
    description: 'Practice blending letter sounds to read simple words.',
    category: 'sounds',
    minAge: 5,
    maxAge: 9,
    icon: '🔊',
    thumbnailColor: '#FFA94D',
    order: 2,
  });

  const readingCourse = await Course.create({
    title: 'Reading Short Stories',
    description: 'Build reading confidence with short, fun stories.',
    category: 'reading',
    minAge: 8,
    maxAge: 14,
    icon: '📖',
    thumbnailColor: '#A83800',
    order: 3,
  });

  await Lesson.create([
    {
      course: phonicsCourse._id,
      title: "The Letter A says 'ah'",
      content:
        "The letter A makes the sound 'ah', like in Apple and Ant. Say it out loud: ah, ah, ah! Listen to the word and tap the speaker button to hear it.",
      audioText: 'A says ah, like Apple and Ant.',
      order: 1,
      exercises: [
        {
          question: "Which word starts with the 'ah' sound?",
          options: ['Apple', 'Ball', 'Cat'],
          correctAnswerIndex: 0,
        },
        {
          question: 'What sound does the letter A make?',
          options: ['ee', 'ah', 'oo'],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      course: phonicsCourse._id,
      title: "The Letter B says 'buh'",
      content:
        "The letter B makes the sound 'buh', like in Ball and Bear. Say it out loud: buh, buh, buh!",
      audioText: 'B says buh, like Ball and Bear.',
      order: 2,
      exercises: [
        {
          question: "Which word starts with the 'buh' sound?",
          options: ['Sun', 'Ball', 'Dog'],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      course: soundsCourse._id,
      title: "Blend it: C-A-T",
      content:
        "Let's blend three sounds together: /k/ /a/ /t/. Say each sound quickly one after another: k-a-t... cat! Tap the speaker to hear the whole word.",
      audioText: 'k a t, cat.',
      order: 1,
      exercises: [
        {
          question: 'What word do /k/ /a/ /t/ make when blended?',
          options: ['Cap', 'Cat', 'Cut'],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      course: readingCourse._id,
      title: 'The Little Red Hen',
      content:
        'Once there was a little red hen who found some wheat seeds. "Who will help me plant these seeds?" she asked. "Not I," said the duck. "Not I," said the cat...',
      audioText: 'Once there was a little red hen who found some wheat seeds.',
      order: 1,
      exercises: [
        {
          question: 'What did the little red hen find?',
          options: ['Wheat seeds', 'A toy', 'Some water'],
          correctAnswerIndex: 0,
        },
        {
          question: 'Who agreed to help the hen plant seeds?',
          options: ['The duck', 'The cat', 'No one at first'],
          correctAnswerIndex: 2,
        },
      ],
    },
  ]);

  console.log('Seed complete!');
  console.log('Admin login: admin@elovanta.com / admin123');
  console.log('Parent login: parent@elovanta.com / parent123');
  console.log('Student login: student@elovanta.com / student123');
  console.log('Tutor login: tutor@elovanta.com / tutor123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
