// frontend/components/Signup.jsx (No changes needed, it is ready to work with the updated backend)

import React, {useState, useEffect} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();

  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault(); 

    try {
      const userData = {
        User: fullname, // ⬅️ Sent to backend
        Email: email,   // ⬅️ Sent to backend
        Password: password // ⬅️ Sent to backend
      }
      
      const response = await axios.post('http://localhost:8080/api/signup', userData);

      if (response.status === 201 || response.status === 200) {
        toast.success('Account created successfully!');
        setFullName('');
        setEmail('');
        setPassword('');
        setTimeout(()=>{
          navigate('/login'); 
        }, 2000);
      } else {
        toast.error('Signup failed with an unexpected response.');
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      let errorMessage = 'Something went wrong. Please try again later!';
      if (error.response && error.response.data && error.response.data.message) {
        // This will display the specific message like 'Email address is already registered.'
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  }

  const redirectLogin = () => {
    navigate('/login')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-6">
      <ToastContainer />
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mt-2">Start your interview preparation journey</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-green-500 transition"
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition shadow-lg hover:scale-105 transition"
          >
            Sign Up
          </button>
        </form>

        <p onClick={redirectLogin} className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <span className="text-green-400 hover:underline cursor-pointer">Login</span>
        </p>
      </div>

    </div>
  );
};

export default Signup;