import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaUserAlt, FaTrophy, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Control modal visibility
  const token = localStorage.getItem('token'); // Check if user is logged in
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    setShowLogoutModal(false);
    navigate('/'); // Redirect to dashboard after logout
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="fixed md:h-screen bottom-0 md:bottom-auto left-0 w-full md:w-60 bg-gray-800 text-white border-t md:border-r md:border-t-0 border-gray-700">
      {/* App Name at the Top for larger screens */}
      <div className="text-center text-2xl font-bold py-4 border-b border-gray-700 hidden md:block">
        FluentWave
      </div>

      {/* Sidebar and Bottom Navigation */}
      <ul className="flex md:block justify-around md:pt-2">
        {/* Home Link */}
        <li className="w-full border-b border-gray-700">
          <Link
            to="/"
            className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full"
          >
            <FaHome className="text-xl" />
            <span className="ml-2 hidden md:block">Dashboard</span>
          </Link>
        </li>

        {/* Lessons Link */}
        <li className="w-full border-b border-gray-700">
          <Link
            to="/lessons"
            className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full"
          >
            <FaBook className="text-xl" />
            <span className="ml-2 hidden md:block">Lessons</span>
          </Link>
        </li>

        {/* Profile Link */}
        <li className="w-full border-b border-gray-700">
          <Link
            to="/profile"
            className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full"
          >
            <FaUserAlt className="text-xl" />
            <span className="ml-2 hidden md:block">Profile</span>
          </Link>
        </li>

        {/* Leaderboard Link */}
        <li className="w-full border-b border-gray-700">
          <Link
            to="/leaderboard"
            className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full"
          >
            <FaTrophy className="text-xl" />
            <span className="ml-2 hidden md:block">Leaderboard</span>
          </Link>
        </li>

        {/* Login/Logout Link - Full Width */}
        <li className="w-full border-b border-gray-700">
          {token ? (
            <button
              onClick={handleLogoutClick}
              className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full text-white"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="ml-2 hidden md:block">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex justify-center md:justify-start items-center p-4 hover:bg-gray-700 transition w-full"
            >
              <FaSignInAlt className="text-xl" />
              <span className="ml-2 hidden md:block">Login</span>
            </Link>
          )}
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
