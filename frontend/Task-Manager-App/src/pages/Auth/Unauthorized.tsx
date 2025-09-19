import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center p-8 bg-white/10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div className="text-8xl mb-6">🚫</div>
        <h1 className="text-6xl font-bold text-white mb-4">Unauthorized</h1>
        <p className="text-xl text-white/80 mb-8">
          You don't have permission to access this page
        </p>
        <Link
          to="/login"
          className="inline-block bg-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 text-lg font-medium shadow-md"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
