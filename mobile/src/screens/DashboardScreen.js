import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import LoadingView from '../components/LoadingView';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { colors } from '../theme/colors';

const StatCard = ({ value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProgressRow = ({ p }) => (
  <View style={styles.row}>
    <Text style={styles.rowTitle}>
      {p.course?.icon} {p.course?.title}
    </Text>
    <Text style={styles.rowSub}>{p.lesson?.title}</Text>
    <Text style={styles.rowScore}>
      {p.score}/{p.totalQuestions} · {new Date(p.completedAt).toLocaleDateString()}
    </Text>
  </View>
);

const StudentDashboard = () => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/progress/me')
      .then((res) => setProgress(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading your progress..." />;

  const totalCompleted = progress.filter((p) => p.completed).length;
  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const totalPossible = progress.reduce((sum, p) => sum + p.totalQuestions, 0);

  return (
    <>
      <Text style={styles.title}>My Progress 🏆</Text>
      <View style={styles.statsRow}>
        <StatCard value={totalCompleted} label="Lessons Completed" />
        <StatCard value={`${totalScore}/${totalPossible}`} label="Questions Correct" />
      </View>
      <Text style={styles.sectionTitle}>Lesson History</Text>
      {progress.length === 0 ? (
        <Text style={styles.empty}>You haven't completed any lessons yet.</Text>
      ) : (
        progress.map((p) => <ProgressRow key={p._id} p={p} />)
      )}
    </>
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

  if (loading) return <LoadingView label="Loading your children's progress..." />;

  return (
    <>
      <Text style={styles.title}>Your Children's Progress 👨‍👩‍👧</Text>
      {children.length === 0 ? (
        <Text style={styles.empty}>
          No student accounts are linked to you yet. Ask your child to add your email as their
          "Parent's Email" when signing up.
        </Text>
      ) : (
        children.map(({ child, progress }) => {
          const totalCompleted = progress.filter((p) => p.completed).length;
          const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
          const totalPossible = progress.reduce((sum, p) => sum + p.totalQuestions, 0);
          return (
            <View key={child._id} style={styles.childCard}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childSummary}>
                {totalCompleted} lessons completed · {totalScore}/{totalPossible} correct
              </Text>
              {progress.map((p) => (
                <ProgressRow key={p._id} p={p} />
              ))}
            </View>
          );
        })
      )}
    </>
  );
};

const DashboardScreen = () => {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer>
      {user.role === 'parent' ? <ParentDashboard /> : <StudentDashboard />}
      <Pressable style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Logout ({user.name.split(' ')[0]})</Text>
      </Pressable>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.primaryDark, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primaryDark },
  statLabel: { fontSize: 12, color: colors.muted, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 },
  empty: { color: colors.muted },
  row: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 10 },
  rowTitle: { fontWeight: '700', color: colors.text },
  rowSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
  rowScore: { color: colors.primaryDark, fontWeight: '700', fontSize: 12, marginTop: 6 },
  childCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 18 },
  childName: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 },
  childSummary: { color: colors.muted, marginBottom: 12 },
  logout: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#f0eefc',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutText: { color: colors.primaryDark, fontWeight: '700' },
});

export default DashboardScreen;
