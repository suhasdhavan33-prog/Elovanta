import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

const PrimaryButton = ({ title, onPress, disabled, loading, variant = 'primary' }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    style={({ pressed }) => [
      styles.base,
      variant === 'secondary' ? styles.secondary : styles.primary,
      (disabled || loading) && styles.disabled,
      pressed && styles.pressed,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={variant === 'secondary' ? colors.primaryDark : '#fff'} />
    ) : (
      <Text style={variant === 'secondary' ? styles.secondaryText : styles.primaryText}>{title}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.secondary },
  secondary: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.primary },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryText: { color: colors.primaryDark, fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.98 }] },
});

export default PrimaryButton;
