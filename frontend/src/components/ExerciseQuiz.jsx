import { useState } from 'react';

const ExerciseQuiz = ({ exercises, onSubmit, result }) => {
  const [answers, setAnswers] = useState(Array(exercises.length).fill(null));

  const selectAnswer = (questionIndex, optionIndex) => {
    if (result) return;
    const next = [...answers];
    next[questionIndex] = optionIndex;
    setAnswers(next);
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="quiz-box">
      <h3>Quick Check 🎯</h3>
      {exercises.map((exercise, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <p>{exercise.question}</p>
          <div className="quiz-options">
            {exercise.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              let optionClass = 'quiz-option';
              if (isSelected) optionClass += ' selected';
              if (result) {
                if (oIndex === result.correctAnswers?.[qIndex]) optionClass += ' correct';
                else if (isSelected) optionClass += ' incorrect';
              }
              return (
                <button
                  key={oIndex}
                  type="button"
                  className={optionClass}
                  onClick={() => selectAnswer(qIndex, oIndex)}
                  disabled={!!result}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!result && (
        <button className="btn-primary" disabled={!allAnswered} onClick={() => onSubmit(answers)}>
          Submit Answers
        </button>
      )}

      {result && (
        <div className="quiz-result">
          🎉 You scored {result.score} out of {result.totalQuestions}!
        </div>
      )}
    </div>
  );
};

export default ExerciseQuiz;
