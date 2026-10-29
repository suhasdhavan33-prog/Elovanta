import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const ScreenContainer = ({ children, scroll = true }) => (
  <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
    {scroll ? (
      <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView>
    ) : (
      <View style={styles.flexContent}>{children}</View>
    )}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 20, paddingBottom: 48 },
  flexContent: { flex: 1 },
});

export default ScreenContainer;
