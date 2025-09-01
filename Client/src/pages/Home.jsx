import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      
      {/* Optional low-poly/abstract background */}
      <div className="absolute inset-0">
        <img 
          src="./image/lowpoly-background.png" 
          alt="Low-poly background" 
          className="w-full h-full object-cover opacity-20" 
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src="./image/Immersio.png" alt="Immersio Logo" className="h-12 w-auto" />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 text-gray-200 font-medium text-lg">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/features" className="hover:text-green-400 transition">Features</Link>
          <Link to="/about" className="hover:text-green-400 transition">About</Link>
          <Link to="/contact" className="hover:text-green-400 transition">Contact</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link 
            to="/register" 
            className="bg-green-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-green-400 transition"
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="bg-transparent border-2 border-green-500 text-green-500 px-4 py-2 rounded-md font-semibold hover:bg-green-500 hover:text-black transition"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col justify-center items-center h-[90%] text-center px-6">
        <h1 className="text-6xl md:text-7xl font-bold text-green-400 mb-6 drop-shadow-lg">
          Welcome to Immersio
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-8">
          Step into a low-poly 3D metaverse, explore immersive worlds, and bring your digital experiences to life.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            to="/register" 
            className="bg-green-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-400 transition"
          >
            Enter the Metaverse
          </Link>
          <Link 
            to="/features" 
            className="bg-transparent border-2 border-green-500 text-green-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 hover:text-black transition"
          >
            Explore Features
          </Link>
        </div>
      </div>

      {/* Low-poly decorative elements */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-green-600 via-transparent to-purple-600 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-1/3 right-0 w-1/4 h-1/4 bg-gradient-to-br from-purple-500 via-green-400 to-blue-500 rounded-full opacity-30 animate-pulse"></div>
    </div>
  );
};

export default Home;
