import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const emptyForm = { studentEmail: '', topic: '', scheduledAt: '', durationMinutes: 30 };

const canJoinNow = (session) => {
  if (session.status !== 'scheduled') return false;
  const start = new Date(session.scheduledAt).getTime();
  const end = start + session.durationMinutes * 60 * 1000;
  const now = Date.now();
  return now >= start - 15 * 60 * 1000 && now <= end + 15 * 60 * 1000;
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
};

const SessionRecordings = ({ sessionId }) => {
  const [recordings, setRecordings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/sessions/${sessionId}/recordings`)
      .then((res) => setRecordings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load recordings.'));
  }, [sessionId]);

  if (error) return <div className="form-error">{error}</div>;
  if (!recordings) return <p className="recordings-loading">Loading recordings...</p>;
  if (recordings.length === 0) return <p className="recordings-empty">No recordings yet for this session.</p>;

  return (
    <div className="recordings-list">
      {recordings.map((r) => (
        <div key={r.id} className="recording-item">
          <video controls src={r.downloadUrl} className="recording-player" />
          <div className="recording-meta">
            {r.startedAt && <span>{new Date(r.startedAt).toLocaleString()}</span>}
            {r.durationSeconds && <span>· {formatDuration(r.durationSeconds)}</span>}
            <a href={r.downloadUrl} download className="recording-download">
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

const SessionRow = ({ session, isTutor, onCancel }) => {
  const other = isTutor ? session.student : session.tutor;
  const joinable = canJoinNow(session);
  const [showRecordings, setShowRecordings] = useState(false);

  return (
    <div className="session-row">
      <div className="session-main">
        <div>
          <p className="session-topic">{session.topic}</p>
          <p className="session-meta">
            with {other?.name} · {new Date(session.scheduledAt).toLocaleString()} ·{' '}
            {session.durationMinutes} min
          </p>
          <span className={`tag session-status status-${session.status}`}>{session.status}</span>
        </div>
        <div className="session-actions">
          {session.status === 'scheduled' && (
            <>
              {joinable ? (
                <Link className="btn-primary" to={`/sessions/${session._id}/room`}>
                  Join
                </Link>
              ) : (
                <button className="btn-secondary" disabled>
                  Not yet
                </button>
              )}
              <button className="btn-cancel" onClick={() => onCancel(session._id)}>
                Cancel
              </button>
            </>
          )}
          {session.status !== 'cancelled' && (
            <button className="btn-recordings" onClick={() => setShowRecordings((v) => !v)}>
              🎬 {showRecordings ? 'Hide' : 'Recordings'}
            </button>
          )}
        </div>
      </div>
      {showRecordings && <SessionRecordings sessionId={session._id} />}
    </div>
  );
};

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSessions = async () => {
    const { data } = await api.get('/sessions/me');
    setSessions(data);
  };

  useEffect(() => {
    loadSessions().finally(() => setLoading(false));
  }, []);

  const isTutor = user?.role === 'tutor';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/sessions', {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      setForm(emptyForm);
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not schedule that session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Cancel this session?')) return;
    await api.patch(`/sessions/${sessionId}/cancel`);
    await loadSessions();
  };

  if (loading) return <Loading label="Loading sessions..." />;

  if (!isTutor && user?.role !== 'student') {
    return (
      <div className="page-container">
        <h1>Live Classes</h1>
        <p className="info-note">
          Live classes are scheduled between tutors and students. {user?.role === 'parent' && 'Ask your child to check their own account for upcoming sessions.'}
        </p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Live Classes 🎥</h1>
      <p className="info-note">
        Sessions are recorded automatically and saved for both the tutor and student to watch
        again afterward. Recordings appear under each session a few minutes after it ends.
      </p>

      {isTutor && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Schedule a Session</h2>
          {error && <div className="form-error">{error}</div>}
          <label>
            Student's Email
            <input
              name="studentEmail"
              type="email"
              value={form.studentEmail}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Topic
            <input name="topic" value={form.topic} onChange={handleChange} placeholder="e.g. Phonics practice" />
          </label>
          <div className="form-row">
            <label>
              Date & Time
              <input
                name="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Duration (minutes)
              <input
                name="durationMinutes"
                type="number"
                min="10"
                max="120"
                value={form.durationMinutes}
                onChange={handleChange}
              />
            </label>
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Scheduling...' : 'Schedule Session'}
          </button>
        </form>
      )}

      <h2>{isTutor ? 'Your Sessions' : 'Your Upcoming Classes'}</h2>
      {sessions.length === 0 ? (
        <p>No live classes scheduled yet.</p>
      ) : (
        <div className="session-list">
          {sessions.map((session) => (
            <SessionRow key={session._id} session={session} isTutor={isTutor} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sessions;
