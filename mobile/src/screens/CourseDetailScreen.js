import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import LoadingView from '../components/LoadingView';
import LessonListItem from '../components/LessonListItem';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const CourseDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
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

  if (loading) return <LoadingView label="Loading course..." />;
  if (!data) return <LoadingView label="Course not found." />;

  const { course, lessons } = data;
  const completedIds = new Set(myProgress.filter((p) => p.completed).map((p) => p.lesson?._id));

  return (
    <ScreenContainer>
      <View style={[styles.header, { backgroundColor: course.thumbnailColor }]}>
        <Text style={styles.headerIcon}>{course.icon}</Text>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{course.title}</Text>
          <Text style={styles.headerDesc}>{course.description}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lessons</Text>
      {lessons.length === 0 ? (
        <Text style={styles.empty}>No lessons added yet for this course.</Text>
      ) : (
        lessons.map((lesson, index) => (
          <LessonListItem
            key={lesson._id}
            lesson={lesson}
            index={index}
            completed={completedIds.has(lesson._id)}
            onPress={() => navigation.navigate('Lesson', { id: lesson._id })}
          />
        ))
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, borderRadius: 20, marginBottom: 20 },
  headerIcon: { fontSize: 40 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerDesc: { color: '#fff', opacity: 0.9, fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  empty: { color: colors.muted },
});

export default CourseDetailScreen;
