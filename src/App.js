import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './mainComponents/Header.js';
import Dashboard from './Components/Dashboard.js';
import LessonsList from './Components/LessonsList.js';
import UserProfile from './Components/UserProfile.js';
import Leaderboard from './Components/Leaderboard.js';
import QuizComponent from './Components/QuizComponent/QuizComponent';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import Logout from './Components/Logout';  // Import Logout Component

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} /> {/* Logout Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/lessons" element={<LessonsList />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
