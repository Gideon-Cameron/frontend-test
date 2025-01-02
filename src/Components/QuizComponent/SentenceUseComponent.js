import React, { useState } from 'react';

const SentenceUseComponent = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    onAnswer(answer === question.correctAnswer);
  };

  return (
    <div className="sentence-use-component text-center">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
      <p className="text-lg mb-6 italic text-gray-700">{question.sentence}</p>
      
      <div className="options grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
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
            disabled={!!selectedAnswer} // Disable options after selection
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SentenceUseComponent;
