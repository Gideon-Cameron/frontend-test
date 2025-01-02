import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate user's level and XP
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

  // Handle Avatar Change (Now accessible to JSX)
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Avatar change triggered', file);
      // Logic for handling avatar upload can go here
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Token is missing. Please log in again.');
        }

        const response = await axios.get('https://fluentwave-backend-beta.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data;
        const levelInfo = calculateLevel(userData.totalXp);

        setUser({
          ...userData,
          ...levelInfo,
        });
      } catch (err) {
        setError(
          err.response?.data?.error || 'Failed to load user data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60">
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:pl-60">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const xpProgress = user
    ? Math.min((user.xp / user.xpNeededForNextLevel) * 100, 100)
    : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:pl-60 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>

        {/* User Information */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={user.avatar ? `https://fluentwave-backend-beta.onrender.com${user.avatar}` : 'https://via.placeholder.com/150'}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full border border-gray-300"
              />
            </div>
            <label className="text-blue-600 cursor-pointer hover:underline mb-6">
              Change Avatar
              <input type="file" className="hidden" onChange={(e) => handleAvatarChange(e)} />
            </label>
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-lg text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* XP and Level Progress */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
          <p className="text-lg mb-2">Total XP: {user.totalXp}</p>
          <p className="text-lg mb-2">XP to Next Level: {user.xpNeededForNextLevel - user.xp}</p>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-0 left-0 h-4 bg-blue-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
          <p className="text-lg mb-2">Level: {user.level}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
