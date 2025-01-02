import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        console.log('[Leaderboard] Fetching leaderboard data...');
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('User is not authenticated. Please log in.');
        }

        const leaderboardResponse = await axios.get('https://fluentwave-backend-beta.onrender.com/api/users/leaderboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileResponse = await axios.get('https://fluentwave-backend-beta.onrender.com/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLeaderboardData(leaderboardResponse.data.data);
        setCurrentUser(profileResponse.data.data);
        setLoading(false);
        console.log('[Leaderboard] Data fetched successfully.');
      } catch (err) {
        console.error('[Leaderboard] Error fetching data:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load leaderboard. Please try again.');
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:ml-60 text-center">
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold mb-4">Loading Leaderboard...</h2>
          <div className="bg-gray-300 h-6 w-1/2 mb-4 mx-auto rounded"></div>
          <div className="bg-gray-300 h-6 w-3/4 mx-auto rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen md:ml-60 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if the current user is in the top 50
  const isCurrentUserInTop50 = leaderboardData.some((user) => user.id === currentUser.id);

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:ml-60">
      {/* Leaderboard Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-lg">Top learners with the highest XP</p>
      </div>

      {/* Top Users */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Top Learners</h2>
        <div className="grid grid-cols-1 gap-4">
          {leaderboardData.map((user, index) => (
            <LeaderboardUser
              key={index}
              user={user}
              isCurrentUser={user.id === currentUser.id}
            />
          ))}
        </div>
      </div>

      {/* Show current user if they are not in the top 50 */}
      {!isCurrentUserInTop50 && currentUser && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Rank</h2>
          <LeaderboardUser user={{ ...currentUser, rank: 'N/A' }} isCurrentUser={true} />
        </div>
      )}
    </div>
  );
};

// LeaderboardUser component to display each user
const LeaderboardUser = ({ user, isCurrentUser }) => {
  return (
    <div
      className={`flex items-center p-4 ${
        isCurrentUser ? 'bg-yellow-200' : 'bg-gray-100'
      } rounded-lg`}
    >
      <img
        src={user.avatar ? `https://fluentwave-backend-beta.onrender.com${user.avatar}` : 'https://via.placeholder.com/50'}
        alt={`${user.name}'s avatar`}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-grow">
        <h3 className="text-xl font-semibold">
          {isCurrentUser ? 'You' : user.name}
        </h3>
        <p>Level: {user.level}</p>
        <p>XP: {user.xp}</p>
      </div>
      <div className="text-xl font-bold">{user.rank !== undefined ? `#${user.rank}` : '-'}</div>
    </div>
  );
};

export default Leaderboard;

