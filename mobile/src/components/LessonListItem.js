import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const LessonListItem = ({ lesson, index, completed, onPress }) => (
  <Pressable onPress={onPress} style={[styles.item, completed && styles.done]}>
    <View style={styles.number}>
      <Text style={styles.numberText}>{index + 1}</Text>
    </View>
    <Text style={styles.title}>{lesson.title}</Text>
    {completed && <Text style={styles.check}>✅</Text>}
  </Pressable>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  done: { borderLeftWidth: 5, borderLeftColor: colors.success },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { color: '#fff', fontWeight: '700' },
  title: { flex: 1, fontWeight: '600', color: colors.text },
  check: { fontSize: 16 },
});

export default LessonListItem;
