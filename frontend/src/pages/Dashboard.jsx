import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/progress/me')
      .then((res) => setProgress(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading your progress..." />;

  const totalCompleted = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const totalPossible = progress.reduce((sum, p) => sum + p.totalQuestions, 0);

  return (
    <div className="page-container">
      <h1>My Progress 🏆</h1>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{totalCompleted}</span>
          <span className="stat-label">Lessons Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {totalScore}/{totalPossible}
          </span>
          <span className="stat-label">Questions Correct</span>
        </div>
      </div>

      <h2>Lesson History</h2>
      {progress.length === 0 ? (
        <p>
          You haven't completed any lessons yet. <Link to="/courses">Browse courses</Link> to get
          started!
        </p>
      ) : (
        <table className="progress-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Lesson</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.course?.icon} {p.course?.title}
                </td>
                <td>{p.lesson?.title}</td>
                <td>
                  {p.score}/{p.totalQuestions}
                </td>
                <td>{new Date(p.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/progress/children')
      .then((res) => setChildren(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading your children's progress..." />;

  return (
    <div className="page-container">
      <h1>Your Children's Progress 👨‍👩‍👧</h1>
      {children.length === 0 ? (
        <p>
          No student accounts are linked to you yet. Ask your child to add your email as their
          "Parent's Email" when signing up.
        </p>
      ) : (
        children.map(({ child, progress }) => {
          const totalCompleted = progress.filter((p) => p.completed).length;
          const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
          const totalPossible = progress.reduce((sum, p) => sum + p.totalQuestions, 0);
          return (
            <div key={child._id} className="child-card">
              <h2>{child.name}</h2>
              <p>
                {totalCompleted} lessons completed · {totalScore}/{totalPossible} questions correct
              </p>
              {progress.length > 0 && (
                <table className="progress-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Lesson</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.map((p) => (
                      <tr key={p._id}>
                        <td>
                          {p.course?.icon} {p.course?.title}
                        </td>
                        <td>{p.lesson?.title}</td>
                        <td>
                          {p.score}/{p.totalQuestions}
                        </td>
                        <td>{new Date(p.completedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'parent') return <ParentDashboard />;
  return <StudentDashboard />;
};

export default Dashboard;
