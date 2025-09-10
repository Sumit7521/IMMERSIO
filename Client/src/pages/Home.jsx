import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../lib/slice/authSlice";
import { fetchProfile } from "../api/profile";
import api from "../config/axios";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await fetchProfile();
        dispatch(login(profile)); // ✅ store user in redux
      } catch (err) {
        dispatch(logout()); // ✅ ensure logged out state if API fails
        console.log(err);
      }
    };

    checkUser();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      dispatch(logout()); // ✅ clear user state
      navigate("/");
      setShowDropdown(false); // Close dropdown after logout
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
        alert(error.response.data.message || "Logout failed. Try again.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        alert("Network error. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        alert("Unexpected error during logout.");
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0">
        <img
          src="./image/lowpoly-background.png"
          alt="Low-poly background"
          className="w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-md border-b border-green-500/20">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="./images/immersio_logo.png"
            alt="Immersio Logo"
            className="h-12 w-auto drop-shadow-lg"
          />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-8 text-gray-300 font-medium text-lg">
          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-green-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <div className="relative user-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-green-400 font-semibold drop-shadow hover:text-green-300 transition cursor-pointer flex items-center gap-2"
              >
                Hi, {user.username}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div>
                  <button className="text-white" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col justify-center items-center h-[85%] text-center px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-green-400 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
          Welcome to Immersio
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
          Step into the metaverse — a vibrant low-poly digital world where
          imagination meets reality.
        </p>

        <Link
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="bg-green-500 text-black px-10 py-4 rounded-xl font-bold text-xl hover:bg-green-400 transition shadow-lg shadow-green-500/30"
        >
          Enter the Metaverse
        </Link>
      </div>

      {/* Decorative glowing blobs */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-green-600/30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-0 w-1/4 h-1/4 bg-purple-500/30 blur-2xl rounded-full animate-pulse"></div>
      <div className="absolute top-10 left-1/4 w-1/5 h-1/5 bg-cyan-400/20 blur-2xl rounded-full animate-pulse"></div>
    </div>
  );
};

export default Home;
