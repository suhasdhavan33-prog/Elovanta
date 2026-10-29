import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', email: '', password: '' };

const TutorManager = () => {
  const [tutors, setTutors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTutors = async () => {
    const { data } = await api.get('/auth/tutors');
    setTutors(data);
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/tutors', form);
      setForm(emptyForm);
      setMessage('Tutor account created!');
      setTimeout(() => setMessage(''), 3000);
      await loadTutors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create that tutor account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="tutor-manager">
      <h2>Tutors</h2>
      <p className="info-note">
        Tutors host live video classes with students. Accounts are created here, not through
        public sign-up.
      </p>
      {message && <div className="admin-flash">{message}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        <label>
          Full Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Temporary Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Tutor Account'}
        </button>
      </form>

      <ul className="admin-list">
        {tutors.map((tutor) => (
          <li key={tutor._id}>
            <span className="admin-list-title">{tutor.name}</span>
            <span className="tutor-email">{tutor.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TutorManager;
