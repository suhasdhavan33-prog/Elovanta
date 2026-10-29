import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    age: '',
    parentEmail: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      await register(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create Your Account 🚀</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>I am a...</Text>
      <View style={styles.roleRow}>
        {['student', 'parent'].map((role) => (
          <Pressable
            key={role}
            onPress={() => set('role')(role)}
            style={[styles.roleChip, form.role === role && styles.roleChipActive]}
          >
            <Text style={[styles.roleChipText, form.role === role && styles.roleChipTextActive]}>
              {role === 'student' ? 'Student (age 4-14)' : 'Parent'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={set('name')} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={set('email')}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={form.password} onChangeText={set('password')} secureTextEntry />

      {form.role === 'student' && (
        <>
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={form.age} onChangeText={set('age')} keyboardType="number-pad" />

          <Text style={styles.label}>Parent's Email (optional, links your progress to them)</Text>
          <TextInput
            style={styles.input}
            value={form.parentEmail}
            onChangeText={set('parentEmail')}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="parent@example.com"
          />
        </>
      )}

      <View style={styles.submitRow}>
        <PrimaryButton title="Sign Up" onPress={handleSubmit} loading={submitting} />
      </View>

      <Text style={styles.switch} onPress={() => navigation.navigate('Login')}>
        Already have an account? <Text style={styles.link}>Login</Text>
      </Text>
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
  roleRow: { flexDirection: 'row', gap: 10 },
  roleChip: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  roleChipActive: { backgroundColor: colors.primary },
  roleChipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  roleChipTextActive: { color: '#fff' },
  submitRow: { marginTop: 16 },
  switch: { textAlign: 'center', marginTop: 18, color: colors.text },
  link: { color: colors.primaryDark, fontWeight: '700' },
});

export default RegisterScreen;
