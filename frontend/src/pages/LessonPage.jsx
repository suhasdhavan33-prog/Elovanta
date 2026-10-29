import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import ExerciseQuiz from '../components/ExerciseQuiz';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';
import { useAuth } from '../context/AuthContext';

const LessonPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/lessons/${id}`)
      .then((res) => setLesson(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (answers) => {
    setError('');
    try {
      const { data } = await api.post('/progress/submit', { lessonId: id, answers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit answers.');
    }
  };

  if (loading) return <Loading label="Loading lesson..." />;
  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div className="page-container lesson-page">
      <Link to={`/courses/${lesson.course}`} className="back-link">
        ← Back to course
      </Link>
      <h1>{lesson.title}</h1>

      <div className="lesson-content-box">
        <p>{lesson.content}</p>
        {lesson.audioText && <SpeakButton text={lesson.audioText} />}
      </div>

      {error && <div className="form-error">{error}</div>}

      {lesson.exercises?.length > 0 ? (
        user?.role === 'student' ? (
          <ExerciseQuiz exercises={lesson.exercises} onSubmit={handleSubmit} result={result} />
        ) : (
          <p className="info-note">Log in as a student to take the quiz for this lesson.</p>
        )
      ) : (
        <p className="info-note">This lesson has no quiz yet.</p>
      )}
    </div>
  );
};

export default LessonPage;
