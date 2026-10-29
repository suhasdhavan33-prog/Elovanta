import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const CourseCard = ({ course, onPress }) => (
  <Pressable onPress={onPress} style={[styles.card, { borderTopColor: course.thumbnailColor }]}>
    <View style={[styles.icon, { backgroundColor: course.thumbnailColor }]}>
      <Text style={styles.iconText}>{course.icon}</Text>
    </View>
    <Text style={styles.title}>{course.title}</Text>
    <Text style={styles.description}>{course.description}</Text>
    <View style={styles.metaRow}>
      <Text style={styles.tag}>{course.category}</Text>
      <Text style={[styles.tag, styles.tagAge]}>
        Ages {course.minAge}-{course.maxAge}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderTopWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  tag: {
    backgroundColor: '#fff1e2',
    color: colors.primaryDark,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  tagAge: { backgroundColor: '#ffead5', color: '#b85c00' },
});

export default CourseCard;
