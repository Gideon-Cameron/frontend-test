// MatchingWordsComponent.js
import React, { useState, useEffect } from 'react';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MatchingWordsComponent = ({ question, onAnswer }) => {
  const [selectedPair, setSelectedPair] = useState({ amharic: null, english: null });
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledAmharicWords, setShuffledAmharicWords] = useState([]);
  const [shuffledEnglishWords, setShuffledEnglishWords] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false); // Track completion to prevent duplicate onAnswer calls

  useEffect(() => {
    // Shuffle words and reset state when the question changes
    setShuffledAmharicWords(shuffleArray([...question.options.map((pair) => pair.Amharic)]));
    setShuffledEnglishWords(shuffleArray([...question.options.map((pair) => pair.English)]));
    setMatchedPairs([]); // Clear matched pairs for the new question
    setSelectedPair({ amharic: null, english: null }); // Clear any current selection
    setIsCompleted(false); // Reset completion state
  }, [question]);

  const handleSelection = (word, type) => {
    const newSelection = { ...selectedPair, [type]: word };
    setSelectedPair(newSelection);

    if (newSelection.amharic && newSelection.english) {
      const correctPair = question.options.find(
        (pair) => pair.Amharic === newSelection.amharic && pair.English === newSelection.english
      );

      if (correctPair) {
        setMatchedPairs((prev) => [...prev, correctPair.Amharic, correctPair.English]);
      }

      setSelectedPair({ amharic: null, english: null }); // Reset the selection after each attempt
    }
  };

  // Check if all pairs are matched and trigger onAnswer to show the continue button
  useEffect(() => {
    if (matchedPairs.length === question.options.length * 2 && !isCompleted) {
      setIsCompleted(true); // Mark as completed to prevent duplicate calls
      onAnswer(true); // Signal completion of the question
    }
  }, [matchedPairs, question.options.length, onAnswer, isCompleted]);

  return (
    <div className="matching-words-component text-center">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>

      <div className="matching-container grid grid-cols-2 gap-4">
        {/* Amharic Column */}
        <div className="amharic-column flex flex-col items-center">
          <h4 className="font-semibold mb-2">Amharic</h4>
          {shuffledAmharicWords.map((word, index) => (
            <button
              key={`amharic-${index}`}
              onClick={() => handleSelection(word, 'amharic')}
              disabled={matchedPairs.includes(word)}
              className={`matching-item w-32 h-12 p-2 mb-2 rounded-lg border ${
                matchedPairs.includes(word) ? 'bg-green-400' : 'bg-blue-200'
              } ${selectedPair.amharic === word ? 'ring-2 ring-blue-500' : ''}`}
            >
              {word}
            </button>
          ))}
        </div>

        {/* English Column */}
        <div className="english-column flex flex-col items-center">
          <h4 className="font-semibold mb-2">English</h4>
          {shuffledEnglishWords.map((word, index) => (
            <button
              key={`english-${index}`}
              onClick={() => handleSelection(word, 'english')}
              disabled={matchedPairs.includes(word)}
              className={`matching-item w-32 h-12 p-2 mb-2 rounded-lg border ${
                matchedPairs.includes(word) ? 'bg-green-400' : 'bg-blue-200'
              } ${selectedPair.english === word ? 'ring-2 ring-blue-500' : ''}`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchingWordsComponent;
