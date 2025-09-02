import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';

const LoginUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Backend should set 'token' cookie (httpOnly)
      await axios.post('http://localhost:3000/api/auth/login', formData, {
        withCredentials: true
      });

      // Navigate directly to protected route after login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-green-400 to-green-600 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter username / email"
            value={formData.username}
            onChange={handleChange}
            required
            className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mt-2 font-semibold"
          >
            Login
          </button>
        </form>

        {/* Don’t have an account link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginUser;
