import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import api from '../config/axios';
import { useDispatch } from 'react-redux';
import { login } from '../lib/slice/authSlice';

const RegisterUser = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // Correct payload according to backend schema
    const payload = {
      username: formData.username,
      fullname: {
        firstname: formData.firstName,
        lastname: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
    };

    // Send request to backend
    const res = await api.post("/auth/register", payload);

    // Dispatch login after successful register
    if (res.data.user) {
      dispatch(login(res.data.user));
    }

    // Navigate directly to avatar-custom after registration
    navigate("/avatar-custom");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="w-full h-screen bg-gradient-to-r from-green-400 to-green-600 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border-2 border-gray-300 rounded-lg p-3 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="border-2 border-gray-300 rounded-lg p-3 flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
            Register
          </button>
        </form>

        {/* Already have an account link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
