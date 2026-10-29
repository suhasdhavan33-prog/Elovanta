import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import LoadingView from '../components/LoadingView';
import SpeakButton from '../components/SpeakButton';
import ExerciseQuiz from '../components/ExerciseQuiz';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const LessonScreen = ({ route }) => {
  const { id } = route.params;
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

  if (loading) return <LoadingView label="Loading lesson..." />;
  if (!lesson) return <LoadingView label="Lesson not found." />;

  return (
    <ScreenContainer>
      <Text style={styles.title}>{lesson.title}</Text>

      <View style={styles.contentBox}>
        <Text style={styles.contentText}>{lesson.content}</Text>
        {lesson.audioText ? <SpeakButton text={lesson.audioText} /> : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {lesson.exercises?.length > 0 ? (
        user?.role === 'student' ? (
          <ExerciseQuiz exercises={lesson.exercises} onSubmit={handleSubmit} result={result} />
        ) : (
          <Text style={styles.note}>Log in as a student to take the quiz for this lesson.</Text>
        )
      ) : (
        <Text style={styles.note}>This lesson has no quiz yet.</Text>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.primaryDark, marginBottom: 14 },
  contentBox: { backgroundColor: colors.surface, borderRadius: 20, padding: 18 },
  contentText: { fontSize: 16, lineHeight: 24, color: colors.text },
  error: {
    backgroundColor: '#fdeceb',
    color: colors.danger,
    padding: 10,
    borderRadius: 10,
    fontWeight: '600',
    marginTop: 14,
  },
  note: { backgroundColor: '#fff8e1', color: '#8a6d00', borderRadius: 12, padding: 14, marginTop: 18 },
});

export default LessonScreen;
