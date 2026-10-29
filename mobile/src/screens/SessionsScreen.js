import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Linking, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import LoadingView from '../components/LoadingView';
import PrimaryButton from '../components/PrimaryButton';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const emptyForm = { studentEmail: '', topic: '', scheduledAt: '', durationMinutes: '30' };

const canJoinNow = (session) => {
  if (session.status !== 'scheduled') return false;
  const start = new Date(session.scheduledAt).getTime();
  const end = start + session.durationMinutes * 60 * 1000;
  const now = Date.now();
  return now >= start - 15 * 60 * 1000 && now <= end + 15 * 60 * 1000;
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  return `${Math.round(seconds / 60)} min`;
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

  if (error) return <Text style={styles.recordingsError}>{error}</Text>;
  if (!recordings) return <Text style={styles.recordingsNote}>Loading recordings...</Text>;
  if (recordings.length === 0) {
    return <Text style={styles.recordingsNote}>No recordings yet for this session.</Text>;
  }

  return (
    <View style={styles.recordingsList}>
      {recordings.map((r) => (
        <Pressable
          key={r.id}
          style={styles.recordingItem}
          onPress={() => Linking.openURL(r.downloadUrl)}
        >
          <Text style={styles.recordingLabel}>▶️ Play recording</Text>
          <Text style={styles.recordingMeta}>
            {r.startedAt ? new Date(r.startedAt).toLocaleString() : ''}
            {r.durationSeconds ? ` · ${formatDuration(r.durationSeconds)}` : ''}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const SessionRow = ({ session, isTutor, onJoin, onCancel }) => {
  const other = isTutor ? session.student : session.tutor;
  const joinable = canJoinNow(session);
  const [showRecordings, setShowRecordings] = useState(false);

  return (
    <View style={styles.row}>
      <Text style={styles.topic}>{session.topic}</Text>
      <Text style={styles.meta}>
        with {other?.name} · {new Date(session.scheduledAt).toLocaleString()} ·{' '}
        {session.durationMinutes} min
      </Text>
      <Text style={[styles.statusPill, styles[`status_${session.status}`]]}>{session.status}</Text>
      <View style={styles.actions}>
        {session.status === 'scheduled' && (
          <>
            <Pressable
              disabled={!joinable}
              onPress={() => onJoin(session._id)}
              style={[styles.joinBtn, !joinable && styles.joinBtnDisabled]}
            >
              <Text style={styles.joinBtnText}>{joinable ? 'Join' : 'Not yet'}</Text>
            </Pressable>
            <Pressable onPress={() => onCancel(session._id)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </>
        )}
        {session.status !== 'cancelled' && (
          <Pressable onPress={() => setShowRecordings((v) => !v)} style={styles.recordingsBtn}>
            <Text style={styles.recordingsBtnText}>
              🎬 {showRecordings ? 'Hide' : 'Recordings'}
            </Text>
          </Pressable>
        )}
      </View>
      {showRecordings && <SessionRecordings sessionId={session._id} />}
    </View>
  );
};

const SessionsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isTutor = user?.role === 'tutor';

  const loadSessions = async () => {
    const { data } = await api.get('/sessions/me');
    setSessions(data);
  };

  useEffect(() => {
    loadSessions().finally(() => setLoading(false));
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const scheduledDate = new Date(form.scheduledAt);
      if (Number.isNaN(scheduledDate.getTime())) {
        throw new Error('Enter the date and time like 2026-11-01 15:00');
      }
      await api.post('/sessions', {
        studentEmail: form.studentEmail,
        topic: form.topic,
        durationMinutes: Number(form.durationMinutes) || 30,
        scheduledAt: scheduledDate.toISOString(),
      });
      setForm(emptyForm);
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not schedule that session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (sessionId) => {
    await api.patch(`/sessions/${sessionId}/cancel`);
    await loadSessions();
  };

  const handleJoin = (sessionId) => {
    navigation.navigate('LiveClassRoom', { id: sessionId });
  };

  if (loading) return <LoadingView label="Loading sessions..." />;

  if (!isTutor && user?.role !== 'student') {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Live Classes</Text>
        <Text style={styles.note}>
          Live classes are scheduled between tutors and students.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Live Classes 🎥</Text>
      <Text style={styles.note}>
        Sessions are recorded automatically and saved for both the tutor and student to watch
        again afterward.
      </Text>

      {isTutor && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Schedule a Session</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Student's Email</Text>
          <TextInput
            style={styles.input}
            value={form.studentEmail}
            onChangeText={set('studentEmail')}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Topic</Text>
          <TextInput
            style={styles.input}
            value={form.topic}
            onChangeText={set('topic')}
            placeholder="e.g. Phonics practice"
          />

          <Text style={styles.label}>Date & Time (YYYY-MM-DD HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={form.scheduledAt}
            onChangeText={set('scheduledAt')}
            placeholder="2026-11-01 15:00"
          />

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={form.durationMinutes}
            onChangeText={set('durationMinutes')}
            keyboardType="number-pad"
          />

          <View style={styles.submitRow}>
            <PrimaryButton title="Schedule Session" onPress={handleSubmit} loading={submitting} />
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>{isTutor ? 'Your Sessions' : 'Your Upcoming Classes'}</Text>
      {sessions.length === 0 ? (
        <Text style={styles.note}>No live classes scheduled yet.</Text>
      ) : (
        sessions.map((session) => (
          <SessionRow
            key={session._id}
            session={session}
            isTutor={isTutor}
            onJoin={handleJoin}
            onCancel={handleCancel}
          />
        ))
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark, marginBottom: 16 },
  note: { color: colors.muted },
  form: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 24 },
  formTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 },
  label: { fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  submitRow: { marginTop: 14 },
  error: {
    backgroundColor: '#fdeceb',
    color: colors.danger,
    padding: 10,
    borderRadius: 10,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 },
  row: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10 },
  topic: { fontWeight: '700', color: colors.text },
  meta: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  status_scheduled: { backgroundColor: '#ffead5', color: '#b85c00' },
  status_completed: { backgroundColor: '#fff1e2', color: colors.primaryDark },
  status_cancelled: { backgroundColor: '#fdeceb', color: colors.danger },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  joinBtn: { backgroundColor: colors.secondary, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16 },
  joinBtnDisabled: { backgroundColor: colors.border },
  joinBtnText: { color: '#fff', fontWeight: '700' },
  cancelBtn: { backgroundColor: '#fdeceb', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16 },
  cancelBtnText: { color: colors.danger, fontWeight: '700' },
  recordingsBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  recordingsBtnText: { color: colors.primaryDark, fontWeight: '700', fontSize: 12.5 },
  recordingsList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  recordingItem: { backgroundColor: '#fff1e2', borderRadius: 10, padding: 10 },
  recordingLabel: { fontWeight: '700', color: colors.primaryDark },
  recordingMeta: { color: colors.muted, fontSize: 11.5, marginTop: 2 },
  recordingsNote: { color: colors.muted, fontSize: 12.5, marginTop: 10 },
  recordingsError: { color: colors.danger, fontSize: 12.5, marginTop: 10 },
});

export default SessionsScreen;
