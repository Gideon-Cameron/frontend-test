import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SectionsWithLessons = () => {
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState([]);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  const sectionNames = [
    'Section 1 - Basic Greetings',
    'Section 2 - Everyday Essentials',
    'Section 3 - Conversational Skills',
    'Section 4 - Asking Questions',
    'Section 5 - Practice and Mastery',
  ];

  const getSectionDisplayName = (index) => {
    return sectionNames[index] || `Section ${index + 1}`;
  };

  // Fetch lessons and user progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonResponse, progressResponse] = await Promise.all([
          axios.get('https://fluentwave-backend-beta.onrender.com/api/lessons'),
          axios.get('https://fluentwave-backend-beta.onrender.com/api/users/profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        const sortedSections = lessonResponse.data.map((section) => ({
          ...section,
          lessons: section.lessons.sort((a, b) => a.order - b.order),
        }));

        setSections(sortedSections);
        setProgress(progressResponse.data.data.progress || []);

        const completed = new Set(
          progressResponse.data.data.progress
            .filter((p) => p.completed)
            .map((p) => p.lessonId)
        );
        setCompletedLessons(completed);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load lessons or user progress.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Unlock lessons within the same section based on order
  const isLessonUnlocked = useCallback(
    (lesson, lessons) => {
      if (!lessons || lessons.length === 0) return false;

      const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

      const completedInSection = sortedLessons.filter((l) =>
        completedLessons.has(l._id)
      ).length;

      const lessonIndex = sortedLessons.findIndex((l) => l._id === lesson._id);

      // Unlock next lesson in sequence within the same section
      return lessonIndex <= completedInSection;
    },
    [completedLessons]
  );

  const previousSection = () => {
    setSelectedSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextSection = () => {
    setSelectedSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center items-center">
        <div>Loading lessons...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center items-center">
        <div>No sections available</div>
      </div>
    );
  }

  const selectedSection = sections[selectedSectionIndex];

  if (!selectedSection || !selectedSection.lessons) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center items-center">
        <div>No lessons available for this section</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Sections</h1>

        <div className="flex items-center mb-6">
          <button
            onClick={previousSection}
            className={`p-2 ${
              selectedSectionIndex === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-500'
            }`}
            disabled={selectedSectionIndex === 0}
          >
            <FaArrowLeft size={24} />
          </button>

          <div className="flex-grow text-center">
            <h2 className="text-2xl font-semibold text-blue-600">
              {getSectionDisplayName(selectedSectionIndex)}
            </h2>
          </div>

          <button
            onClick={nextSection}
            className={`p-2 ${
              selectedSectionIndex === sections.length - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-500'
            }`}
            disabled={selectedSectionIndex === sections.length - 1}
          >
            <FaArrowRight size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Lessons in {getSectionDisplayName(selectedSectionIndex)}
        </h2>

        <div className="grid gap-4">
          {selectedSection.lessons.map((lesson) => {
            const unlocked = isLessonUnlocked(lesson, selectedSection.lessons);
            const completed = completedLessons.has(lesson._id);

            return (
              <div
                key={lesson._id}
                className={`p-4 bg-white shadow-md rounded-lg ${
                  completed ? 'bg-green-100' : ''
                }`}
              >
                <h3 className="text-xl font-semibold">{lesson.title}</h3>
                <p>Difficulty: {lesson.difficulty}</p>

                <div className="mt-2">
                  {unlocked ? (
                    <Link to={`/quiz/${lesson.quizId}`}>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
                        {completed ? 'Review' : 'Start Lesson'}
                      </button>
                    </Link>
                  ) : (
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>
                      Locked
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionsWithLessons;
