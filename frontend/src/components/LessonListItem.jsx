import { Link } from 'react-router-dom';

const LessonListItem = ({ lesson, index, completed }) => (
  <Link to={`/lessons/${lesson._id}`} className={`lesson-item ${completed ? 'lesson-done' : ''}`}>
    <span className="lesson-number">{index + 1}</span>
    <span className="lesson-title">{lesson.title}</span>
    {completed && <span className="lesson-check">✅</span>}
  </Link>
);

export default LessonListItem;
