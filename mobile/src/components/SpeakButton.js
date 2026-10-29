import { Pressable, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { colors } from '../theme/colors';

const SpeakButton = ({ text }) => {
  const speak = () => {
    if (!text) return;
    Speech.stop();
    Speech.speak(text, { rate: 0.85, pitch: 1.1 });
  };

  return (
    <Pressable onPress={speak} style={styles.btn}>
      <Text style={styles.label}>🔊 Listen</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginTop: 14,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  label: { color: '#fff', fontWeight: '700' },
});

export default SpeakButton;
