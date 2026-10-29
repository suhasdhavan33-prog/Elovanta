import { useEffect, useState } from 'react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';
import Loading from '../components/Loading';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading courses..." />;

  const categories = ['all', ...new Set(courses.map((c) => c.category))];
  const filtered = category === 'all' ? courses : courses.filter((c) => c.category === category);

  return (
    <div className="page-container">
      <h1>Our Courses</h1>
      <div className="filter-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p>No courses yet. Check back soon!</p>
      ) : (
        <div className="course-grid">
          {filtered.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
