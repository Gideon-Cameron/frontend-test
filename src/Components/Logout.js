import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await axios.post('https://backend-test-8r7y.onrender.com/api/users/logout', null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Clear local storage and redirect to login page
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error.response?.data || error.message);
        // Even if logout request fails, clear token and navigate to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-2xl">Logging you out...</h1>
    </div>
  );
};

export default Logout;
