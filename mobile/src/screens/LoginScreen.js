import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Welcome Back! 👋</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <View style={styles.submitRow}>
        <PrimaryButton title="Login" onPress={handleSubmit} loading={submitting} />
      </View>

      <Text style={styles.switch} onPress={() => navigation.navigate('Register')}>
        Don't have an account? <Text style={styles.link}>Sign up</Text>
      </Text>

      <View style={styles.hint}>
        <Text style={styles.hintTitle}>Demo accounts (after running the seed script):</Text>
        <Text style={styles.hintText}>Student: student@elovanta.com / student123</Text>
        <Text style={styles.hintText}>Parent: parent@elovanta.com / parent123</Text>
        <Text style={styles.hintText}>Admin: admin@elovanta.com / admin123</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.primaryDark, marginBottom: 16 },
  label: { fontWeight: '700', color: colors.text, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  error: {
    backgroundColor: '#fdeceb',
    color: colors.danger,
    padding: 10,
    borderRadius: 10,
    fontWeight: '600',
    marginBottom: 10,
  },
  submitRow: { marginTop: 10 },
  switch: { textAlign: 'center', marginTop: 18, color: colors.text },
  link: { color: colors.primaryDark, fontWeight: '700' },
  hint: { backgroundColor: '#fff1e2', borderRadius: 10, padding: 12, marginTop: 24 },
  hintTitle: { fontWeight: '700', marginBottom: 6, color: colors.text },
  hintText: { fontSize: 12.5, color: colors.text, lineHeight: 18 },
});

export default LoginScreen;
