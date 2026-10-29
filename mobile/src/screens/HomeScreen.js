import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import Logo from '../components/Logo';
import { colors } from '../theme/colors';

const FEATURES = [
  ['🔤', 'Phonics', 'Master letter sounds with playful examples and audio practice.'],
  ['🔊', 'Sounds & Blending', 'Blend sounds together to build confidence reading new words.'],
  ['📖', 'Reading', 'Enjoy short stories designed to grow vocabulary and comprehension.'],
  ['🏆', 'Track Progress', 'See exactly how a child is improving over time.'],
];

const HomeScreen = ({ navigation }) => (
  <ScreenContainer>
    <View style={styles.header}>
      <Logo size={48} />
    </View>
    <Text style={styles.eyebrow}>Welcome to Elovanta</Text>
    <Text style={styles.title}>Learn English the Fun Way! 🎈</Text>
    <Text style={styles.subtitle}>
      Friendly online tutoring for kids aged 4 to 14 — phonics, letter sounds, blending, and
      reading, taught through fun, interactive lessons.
    </Text>

    <View style={styles.actions}>
      <PrimaryButton title="Explore Courses" onPress={() => navigation.navigate('Courses')} />
      <PrimaryButton
        title="Create Free Account"
        variant="secondary"
        onPress={() => navigation.navigate('Account', { screen: 'Register' })}
      />
    </View>

    <View style={styles.features}>
      {FEATURES.map(([emoji, title, text]) => (
        <View key={title} style={styles.featureCard}>
          <Text style={styles.featureEmoji}>{emoji}</Text>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureText}>{text}</Text>
        </View>
      ))}
    </View>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0eefc',
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 10,
  },
  title: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, marginBottom: 10 },
  subtitle: { fontSize: 15, color: colors.muted, lineHeight: 22, marginBottom: 24 },
  actions: { gap: 12, marginBottom: 32 },
  features: { gap: 14 },
  featureCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16 },
  featureEmoji: { fontSize: 28, marginBottom: 6 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  featureText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});

export default HomeScreen;
