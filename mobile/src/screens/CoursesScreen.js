import { useEffect, useState } from 'react';
import { Text, FlatList, Pressable, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import LoadingView from '../components/LoadingView';
import CourseCard from '../components/CourseCard';
import api from '../api/axios';
import { colors } from '../theme/colors';

const CoursesScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api
      .get('/courses')
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingView label="Loading courses..." />;

  const categories = ['all', ...new Set(courses.map((c) => c.category))];
  const filtered = category === 'all' ? courses : courses.filter((c) => c.category === category);

  return (
    <ScreenContainer scroll={false}>
      <Text style={styles.title}>Our Courses</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(c) => c}
        style={styles.filterRow}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setCategory(item)}
            style={[styles.chip, category === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        )}
      />
      <FlatList
        data={filtered}
        keyExtractor={(c) => c._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => navigation.navigate('CourseDetail', { id: item._id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No courses yet. Check back soon!</Text>}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark, padding: 20, paddingBottom: 10 },
  filterRow: { paddingHorizontal: 20, marginBottom: 10, flexGrow: 0 },
  chip: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primaryDark, fontWeight: '600', textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
});

export default CoursesScreen;
