import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import PrimaryButton from './PrimaryButton';

const ExerciseQuiz = ({ exercises, onSubmit, result }) => {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(null));

  const selectAnswer = (qIndex, oIndex) => {
    if (result) return;
    const next = [...answers];
    next[qIndex] = oIndex;
    setAnswers(next);
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <View style={styles.box}>
      <Text style={styles.heading}>Quick Check 🎯</Text>
      {exercises.map((exercise, qIndex) => (
        <View key={qIndex} style={styles.question}>
          <Text style={styles.questionText}>{exercise.question}</Text>
          {exercise.options.map((option, oIndex) => {
            const isSelected = answers[qIndex] === oIndex;
            const optionStyle = [styles.option];
            if (isSelected) optionStyle.push(styles.selected);
            if (result) {
              if (oIndex === result.correctAnswers?.[qIndex]) optionStyle.push(styles.correct);
              else if (isSelected) optionStyle.push(styles.incorrect);
            }
            return (
              <Pressable
                key={oIndex}
                onPress={() => selectAnswer(qIndex, oIndex)}
                disabled={!!result}
                style={optionStyle}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {!result && (
        <PrimaryButton title="Submit Answers" disabled={!allAnswered} onPress={() => onSubmit(answers)} />
      )}

      {result && (
        <Text style={styles.result}>
          🎉 You scored {result.score} out of {result.totalQuestions}!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginTop: 20 },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  question: { marginBottom: 18 },
  questionText: { fontWeight: '700', color: colors.text, marginBottom: 10 },
  option: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionText: { color: colors.text, fontSize: 15 },
  selected: { borderColor: colors.primary, backgroundColor: '#fff1e2' },
  correct: { borderColor: colors.success, backgroundColor: '#e9fbf0' },
  incorrect: { borderColor: colors.danger, backgroundColor: '#fdeceb' },
  result: { marginTop: 10, fontWeight: '700', fontSize: 17, color: colors.primaryDark },
});

export default ExerciseQuiz;
