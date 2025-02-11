import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateLevel = (totalXp) => {
    let level = 1;
    let xpForNextLevel = 100;
    let remainingXP = totalXp;

    while (remainingXP >= xpForNextLevel) {
      remainingXP -= xpForNextLevel;
      level++;
      xpForNextLevel += 50;
    }

    return {
      level,
      xp: remainingXP,
      xpNeededForNextLevel: xpForNextLevel,
    };
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem('cachedUser');

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setLoading(false);
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://backend-test-8r7y.onrender.com/api/users/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = response.data.data;
        const levelInfo = calculateLevel(userData.totalXp);
        const updatedUser = { ...userData, ...levelInfo };

        setUser(updatedUser);
        localStorage.setItem('cachedUser', JSON.stringify(updatedUser));
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Skeleton Loader during loading
  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-64 flex justify-center items-center">
        <div className="max-w-4xl w-full animate-pulse">
          <div className="h-12 bg-gray-300 rounded mb-6"></div>
          <div className="h-40 bg-gray-300 rounded mb-6"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Error or No User (Display Default)
  if (!user || error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-64 flex justify-center items-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold mb-6">Welcome to Fluentwave!</h1>
          <p className="text-lg mb-6">
            Start your journey to learning Amharic. Track your progress, gain XP, and level up.
          </p>
          {error && (
            <p className="text-red-500 mb-4">Could not load your profile. Please try logging in again.</p>
          )}
          <div className="flex justify-center space-x-6">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-500 transition">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-400 transition">
                Sign Up
              </button>
            </Link>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Guest Progress</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-lg mb-2">XP: 0</p>
              <p className="text-lg mb-2">Level: 1</p>
              <p className="text-lg mb-2">XP to Next Level: 100</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nextMilestoneXP = user.xpNeededForNextLevel - user.xp;

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:pl-64 flex justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome, {user.name}!</h1>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Progress</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-lg mb-2">XP: {user.totalXp}</p>
            <p className="text-lg mb-2">Level: {user.level}</p>
            <p className="text-lg mb-2">XP to Next Level: {nextMilestoneXP}</p>
          </div>
        </div>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="absolute top-0 left-0 h-4 bg-blue-500 transition-all duration-500"
            style={{ width: `${(user.xp / user.xpNeededForNextLevel) * 100}%` }}
          ></div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Continue Your Lesson</h2>
          <Link to="/lessons">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-500 transition">
              Continue Lesson
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
