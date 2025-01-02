// RegularQuestionComponent.js
import React, { useState, useEffect } from 'react';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const RegularQuestionComponent = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    // Filter valid options and shuffle them
    const validOptions = question.options.map((option) =>
      typeof option === 'string' || typeof option === 'number' ? option : JSON.stringify(option)
    );
    setShuffledOptions(shuffleArray(validOptions));
  }, [question.options]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    onAnswer(answer === question.correctAnswer);
  };

  return (
    <div className="regular-question-component text-center">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>

      <div className="options grid grid-cols-1 gap-4">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`block w-full p-4 rounded-lg ${
              selectedAnswer === option
                ? option === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={!!selectedAnswer} // Disable further clicks after selection
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegularQuestionComponent;
