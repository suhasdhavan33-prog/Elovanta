import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loading from '../components/Loading';
import TutorManager from '../components/TutorManager';

const emptyCourse = {
  title: '',
  description: '',
  category: 'phonics',
  minAge: 4,
  maxAge: 14,
  icon: '📘',
  thumbnailColor: '#FF7A1A',
  order: 0,
};

const emptyLesson = {
  title: '',
  content: '',
  audioText: '',
  order: 0,
  exercises: [],
};

const emptyExercise = { question: '', options: ['', ''], correctAnswerIndex: 0 };

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    const { data } = await api.get('/courses');
    setCourses(data);
  };

  useEffect(() => {
    loadCourses().finally(() => setLoading(false));
  }, []);

  const loadLessons = async (courseId) => {
    const { data } = await api.get(`/courses/${courseId}`);
    setLessons(data.lessons);
  };

  const selectCourse = async (courseId) => {
    setSelectedCourseId(courseId);
    setEditingLessonId(null);
    setLessonForm(emptyLesson);
    await loadLessons(courseId);
  };

  const flash = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: name.includes('Age') || name === 'order' ? Number(value) : value });
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    if (editingCourseId) {
      await api.put(`/courses/${editingCourseId}`, courseForm);
      flash('Course updated!');
    } else {
      await api.post('/courses', courseForm);
      flash('Course created!');
    }
    setCourseForm(emptyCourse);
    setEditingCourseId(null);
    await loadCourses();
  };

  const editCourse = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      minAge: course.minAge,
      maxAge: course.maxAge,
      icon: course.icon,
      thumbnailColor: course.thumbnailColor,
      order: course.order,
    });
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and all of its lessons?')) return;
    await api.delete(`/courses/${courseId}`);
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setLessons([]);
    }
    flash('Course deleted.');
    await loadCourses();
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm({ ...lessonForm, [name]: name === 'order' ? Number(value) : value });
  };

  const addExercise = () => {
    setLessonForm({ ...lessonForm, exercises: [...lessonForm.exercises, { ...emptyExercise }] });
  };

  const updateExercise = (index, field, value) => {
    const exercises = lessonForm.exercises.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    setLessonForm({ ...lessonForm, exercises });
  };

  const updateExerciseOption = (exIndex, optIndex, value) => {
    const exercises = lessonForm.exercises.map((ex, i) => {
      if (i !== exIndex) return ex;
      const options = ex.options.map((opt, j) => (j === optIndex ? value : opt));
      return { ...ex, options };
    });
    setLessonForm({ ...lessonForm, exercises });
  };

  const addOption = (exIndex) => {
    const exercises = lessonForm.exercises.map((ex, i) =>
      i === exIndex ? { ...ex, options: [...ex.options, ''] } : ex
    );
    setLessonForm({ ...lessonForm, exercises });
  };

  const removeExercise = (index) => {
    setLessonForm({ ...lessonForm, exercises: lessonForm.exercises.filter((_, i) => i !== index) });
  };

  const submitLesson = async (e) => {
    e.preventDefault();
    const payload = { ...lessonForm, course: selectedCourseId };
    if (editingLessonId) {
      await api.put(`/lessons/${editingLessonId}`, payload);
      flash('Lesson updated!');
    } else {
      await api.post('/lessons', payload);
      flash('Lesson created!');
    }
    setLessonForm(emptyLesson);
    setEditingLessonId(null);
    await loadLessons(selectedCourseId);
  };

  const editLesson = async (lessonId) => {
    const { data } = await api.get(`/lessons/${lessonId}/admin`);
    setEditingLessonId(lessonId);
    setLessonForm({
      title: data.title,
      content: data.content,
      audioText: data.audioText || '',
      order: data.order,
      exercises: data.exercises,
    });
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    await api.delete(`/lessons/${lessonId}`);
    flash('Lesson deleted.');
    await loadLessons(selectedCourseId);
  };

  if (loading) return <Loading label="Loading admin panel..." />;

  return (
    <div className="page-container admin-page">
      <h1>Admin Panel 🛠️</h1>
      {message && <div className="admin-flash">{message}</div>}

      <div className="admin-grid">
        <section>
          <h2>{editingCourseId ? 'Edit Course' : 'Add a Course'}</h2>
          <form className="admin-form" onSubmit={submitCourse}>
            <label>
              Title
              <input name="title" value={courseForm.title} onChange={handleCourseChange} required />
            </label>
            <label>
              Description
              <textarea name="description" value={courseForm.description} onChange={handleCourseChange} required />
            </label>
            <label>
              Category
              <select name="category" value={courseForm.category} onChange={handleCourseChange}>
                <option value="phonics">Phonics</option>
                <option value="sounds">Sounds</option>
                <option value="reading">Reading</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                Min Age
                <input type="number" name="minAge" value={courseForm.minAge} onChange={handleCourseChange} />
              </label>
              <label>
                Max Age
                <input type="number" name="maxAge" value={courseForm.maxAge} onChange={handleCourseChange} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Icon (emoji)
                <input name="icon" value={courseForm.icon} onChange={handleCourseChange} />
              </label>
              <label>
                Color
                <input type="color" name="thumbnailColor" value={courseForm.thumbnailColor} onChange={handleCourseChange} />
              </label>
            </div>
            <button className="btn-primary" type="submit">
              {editingCourseId ? 'Save Changes' : 'Create Course'}
            </button>
            {editingCourseId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseForm(emptyCourse);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <h2>All Courses</h2>
          <ul className="admin-list">
            {courses.map((course) => (
              <li key={course._id} className={selectedCourseId === course._id ? 'active' : ''}>
                <button className="admin-list-title" onClick={() => selectCourse(course._id)}>
                  {course.icon} {course.title}
                </button>
                <div className="admin-list-actions">
                  <button onClick={() => editCourse(course)}>Edit</button>
                  <button className="danger" onClick={() => deleteCourse(course._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          {!selectedCourseId ? (
            <p>Select a course on the left to manage its lessons.</p>
          ) : (
            <>
              <h2>{editingLessonId ? 'Edit Lesson' : 'Add a Lesson'}</h2>
              <form className="admin-form" onSubmit={submitLesson}>
                <label>
                  Title
                  <input name="title" value={lessonForm.title} onChange={handleLessonChange} required />
                </label>
                <label>
                  Content
                  <textarea name="content" value={lessonForm.content} onChange={handleLessonChange} required />
                </label>
                <label>
                  Audio text (read aloud via text-to-speech)
                  <input name="audioText" value={lessonForm.audioText} onChange={handleLessonChange} />
                </label>
                <label>
                  Order
                  <input type="number" name="order" value={lessonForm.order} onChange={handleLessonChange} />
                </label>

                <h3>Quiz Questions</h3>
                {lessonForm.exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className="exercise-editor">
                    <input
                      placeholder="Question"
                      value={exercise.question}
                      onChange={(e) => updateExercise(exIndex, 'question', e.target.value)}
                      required
                    />
                    {exercise.options.map((option, optIndex) => (
                      <div key={optIndex} className="option-row">
                        <input
                          type="radio"
                          name={`correct-${exIndex}`}
                          checked={exercise.correctAnswerIndex === optIndex}
                          onChange={() => updateExercise(exIndex, 'correctAnswerIndex', optIndex)}
                        />
                        <input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => updateExerciseOption(exIndex, optIndex, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(exIndex)}>
                      + Add Option
                    </button>
                    <button type="button" className="danger" onClick={() => removeExercise(exIndex)}>
                      Remove Question
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addExercise}>
                  + Add Question
                </button>

                <button className="btn-primary" type="submit">
                  {editingLessonId ? 'Save Lesson' : 'Create Lesson'}
                </button>
                {editingLessonId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm(emptyLesson);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>

              <h2>Lessons in this course</h2>
              <ul className="admin-list">
                {lessons.map((lesson) => (
                  <li key={lesson._id}>
                    <span className="admin-list-title">{lesson.title}</span>
                    <div className="admin-list-actions">
                      <button onClick={() => editLesson(lesson._id)}>Edit</button>
                      <button className="danger" onClick={() => deleteLesson(lesson._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <TutorManager />
    </div>
  );
};

export default AdminPanel;
