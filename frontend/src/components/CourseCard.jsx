import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <Link to={`/courses/${course._id}`} className="course-card" style={{ borderTopColor: course.thumbnailColor }}>
    <div className="course-icon" style={{ background: course.thumbnailColor }}>
      {course.icon}
    </div>
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <div className="course-meta">
      <span className="tag">{course.category}</span>
      <span className="tag tag-age">
        Ages {course.minAge}-{course.maxAge}
      </span>
    </div>
  </Link>
);

export default CourseCard;
