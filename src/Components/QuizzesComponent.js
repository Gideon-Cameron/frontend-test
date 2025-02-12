import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const QuizzesComponent = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [xpGained, setXpGained] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [selectedPair, setSelectedPair] = useState({ amharic: null, english: null });
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showContinue, setShowContinue] = useState(false);

  const formattedQuizId = String(quizId);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`https://backend-test-8r7y.onrender.com/api/quiz-completion/${formattedQuizId}`);
        if (!response.ok) throw new Error('Failed to fetch quiz data');
        const data = await response.json();
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (formattedQuizId) fetchQuiz();
    else {
      setError("Quiz ID is missing");
      setLoading(false);
    }
  }, [formattedQuizId]);

  const handleAnswerSelect = (answer) => {
    const isAnswerCorrect = answer === quizData.questions[currentQuestionIndex].correctAnswer;
    setUserAnswers([...userAnswers, { question: currentQuestionIndex, answer }]);
    setShowContinue(true);

    if (isAnswerCorrect) setScore((prevScore) => prevScore + 1);
  };

  const handleContinue = () => {
    setShowContinue(false);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedPair({ amharic: null, english: null });
      setMatchedPairs([]);
    } else {
      completeQuiz();
      setQuizCompleted(true);
    }
  };

  const completeQuiz = async () => {
    const scorePercentage = Math.round((score / quizData.questions.length) * 100);

    try {
      const response = await fetch(`https://backend-test-8r7y.onrender.com/api/quiz-completion/${formattedQuizId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "YOUR_USER_ID",
          lessonId: quizData.lessonId,
          score: scorePercentage,
          totalQuestions: quizData.questions.length,
        })
      });
      const result = await response.json();
      setXpGained(result.xpGained);
      setTotalXP(result.totalXP);
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const getNextLessonQuizId = (currentLessonId) => {
    return 'next-quiz-id';
  };

  const handleSelection = (word, type) => {
    const newSelection = { ...selectedPair, [type]: word };
    setSelectedPair(newSelection);

    if (newSelection.amharic && newSelection.english) {
      const correctPair = quizData.questions[currentQuestionIndex].options.find(
        (pair) => pair.Amharic === newSelection.amharic && pair.English === newSelection.english
      );

      if (correctPair) {
        setMatchedPairs([...matchedPairs, correctPair.Amharic, correctPair.English]);
      }
      setSelectedPair({ amharic: null, english: null });
    }
  };

  useEffect(() => {
    const currentQuestion = quizData?.questions[currentQuestionIndex];
    if (
      currentQuestion?.questionType === 'matching' &&
      matchedPairs.length === currentQuestion.options.length * 2 // All pairs are matched
    ) {
      setShowContinue(true); // Show Continue button only after all pairs are matched
      setScore((prevScore) => prevScore + 1); // Count matching question as one correct answer
    }
  }, [matchedPairs]);

  const renderMatchingQuestion = (question) => {
    const amharicWords = question.options.map((pair) => pair.Amharic);
    const englishWords = question.options.map((pair) => pair.English);

    return (
      <div className="matching-question">
        <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
        <div className="matching-container grid grid-cols-2 gap-8">
          <div className="amharic-column">
            <h4 className="font-semibold mb-2">Amharic</h4>
            {amharicWords.map((word, index) => (
              <button
                key={index}
                className={`matching-item p-2 mb-2 rounded-lg border border-blue-400 ${
                  matchedPairs.includes(word) ? 'bg-green-400' : 'bg-blue-200'
                } ${selectedPair.amharic === word ? 'bg-blue-300' : ''}`}
                onClick={() => handleSelection(word, 'amharic')}
                disabled={matchedPairs.includes(word)}
              >
                {word}
              </button>
            ))}
          </div>
          <div className="english-column">
            <h4 className="font-semibold mb-2">English</h4>
            {englishWords.map((word, index) => (
              <button
                key={index}
                className={`matching-item p-2 mb-2 rounded-lg border border-blue-400 ${
                  matchedPairs.includes(word) ? 'bg-green-400' : 'bg-blue-200'
                } ${selectedPair.english === word ? 'bg-blue-300' : ''}`}
                onClick={() => handleSelection(word, 'english')}
                disabled={matchedPairs.includes(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quizData) return <div>No quiz data available</div>;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:ml-60 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">
          {quizData.lessonId ? `Quiz for Lesson ${quizData.lessonId}` : 'Quiz'}
        </h2>
        <p className="text-lg mb-4">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>

        {currentQuestion.questionType === 'multipleChoice' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h3>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="block w-full p-4 mb-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'matching' && renderMatchingQuestion(currentQuestion)}

        {showContinue && (
          <button
            onClick={handleContinue}
            className="mt-4 px-4 py-2 rounded text-white bg-green-500"
          >
            {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Continue'}
          </button>
        )}
      </div>

      {quizCompleted && (
        <div className="p-6 bg-gray-100 min-h-screen md:ml-60 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-lg">Your Score: {score} / {quizData.questions.length} ({Math.round((score / quizData.questions.length) * 100)}%)</p>
          <p className="text-lg mt-2">XP Gained: {xpGained}</p>
          <p className="text-lg mt-2">Total XP: {totalXP}</p>
          <div className="navigation-buttons flex justify-between mt-8 w-full max-w-md">
          <Link to="/lessons">
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg"
          onClick={() => console.log('Back to Lessons button clicked')}
        >
          Back to Lessons.
        </button>
      </Link>

      <Link to={`/quiz/${getNextLessonQuizId(quizData.lessonId)}`}>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg"
          onClick={() => console.log('Next Lesson button clicked')}
        >
          Continue to Next Lesson
        </button>
      </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizzesComponent;
