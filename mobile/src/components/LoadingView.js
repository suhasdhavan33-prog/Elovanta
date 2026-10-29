import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const LoadingView = ({ label = 'Loading...' }) => (
  <View style={styles.wrap}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  label: { color: colors.muted, fontSize: 15, marginTop: 12 },
});

export default LoadingView;
