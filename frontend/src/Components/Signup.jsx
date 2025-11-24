import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const redirectLogin = () => {
    navigate('/login')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6">
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mt-2">Start your interview preparation journey</p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <input
              type="text"
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-indigo-500 transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-pink-500 transition"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 font-semibold shadow-lg hover:scale-105 transition shadow-lg hover:scale-105 transition"
          >
            Sign Up
          </button>
        </form>

        <p  onClick={redirectLogin} className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <span className="text-indigo-400 hover:underline cursor-pointer">Login</span>
        </p>
      </div>

      
    </div>
  );
};

export default Signup;