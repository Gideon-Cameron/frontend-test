import React from 'react';

const WordIntroductionComponent = ({ question, onAnswer }) => {
  const handleComplete = () => {
    onAnswer(true);  // Mark the question as complete (multiple times allowed)
  };

  return (
    <div className="word-introduction-component text-center">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
      <div className="word-details">
        <p className="text-4xl text-blue-600 font-bold mb-2">{question.options[0].Amharic}</p>
        <p className="text-lg text-gray-700">Pronunciation: {question.options[0].Pronunciation}</p>
        <p className="text-lg text-gray-700">Meaning: {question.options[0].English}</p>
        <p className="text-md text-gray-500 italic mt-4">
          Example: {question.options[0].ExampleSentence}
        </p>
      </div>

      {/* Mark as Complete Button (always clickable) */}
      <button
        onClick={handleComplete}
        className="mt-6 px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold"
      >
        Mark as Complete
      </button>
    </div>
  );
};

export default WordIntroductionComponent;
