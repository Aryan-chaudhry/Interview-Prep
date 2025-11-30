// src/components/Login.jsx (No changes needed for 5-day persistence, as localStorage is used)

import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }
    
    setLoading(true);

    try {
      const loginData = {
        Email: email,
        Password: password
      };
      
      const response = await axios.post('http://localhost:8080/api/login', loginData);

      if (response.status === 200) {
        
        // ⬅️ CRITICAL STEP: SAVE THE TOKEN in localStorage
        const token = response.data.token;
        if (token) {
            localStorage.setItem('authToken', token); // This is persistent storage
        }
        
        toast.success(response.data.message || 'Login successful!');
        
        setEmail('');
        setPassword('');
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Server is unreachable. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const redirectSignup = () => {
    navigate('/signup');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6">
      <ToastContainer />
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        
        <p className="text-gray-400 text-center mt-2">Login to continue your interview prep</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-green-500 transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-green-500 transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p onClick={redirectSignup} className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <span className="text-green-400 hover:underline cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;