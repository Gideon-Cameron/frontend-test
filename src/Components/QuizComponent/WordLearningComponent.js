import React, { useEffect } from 'react';

const WordLearningComponent = ({ question, onAnswer }) => {
  useEffect(() => {
    // Automatically mark the question as correct when it is displayed
    onAnswer(true);
  }, [onAnswer]);

  return (
    <div className="word-learning-component text-center">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
      <div className="word-pair mt-4">
        {/* Display Amharic word */}
        <div className="word amharic-word text-4xl font-bold text-blue-600 mb-4 animate-pulse">
          {question.options[0].Amharic}
        </div>
        {/* Display English translation */}
        <div className="word english-word text-2xl font-semibold text-gray-700">
          {question.options[0].English}
        </div>
      </div>
    </div>
  );
};

export default WordLearningComponent;
