import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import LessonListItem from '../components/LessonListItem';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [myProgress, setMyProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const courseRes = await api.get(`/courses/${id}`);
      setData(courseRes.data);
      if (user?.role === 'student') {
        const progressRes = await api.get('/progress/me');
        setMyProgress(progressRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  if (loading) return <Loading label="Loading course..." />;
  if (!data) return <p>Course not found.</p>;

  const { course, lessons } = data;
  const completedLessonIds = new Set(
    myProgress.filter((p) => p.completed).map((p) => p.lesson?._id)
  );

  return (
    <div className="page-container">
      <div className="course-header" style={{ background: course.thumbnailColor }}>
        <span className="course-header-icon">{course.icon}</span>
        <div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </div>

      <h2>Lessons</h2>
      {lessons.length === 0 ? (
        <p>No lessons added yet for this course.</p>
      ) : (
        <div className="lesson-list">
          {lessons.map((lesson, index) => (
            <LessonListItem
              key={lesson._id}
              lesson={lesson}
              index={index}
              completed={completedLessonIds.has(lesson._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
