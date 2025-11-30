import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-10 pl-30
    transition-all duration-300`}>

      {/* HERO SECTION */}
      <div className="flex flex-col lg:flex-row items-center justify-between pt-10">

        {/* LEFT TEXT SECTION */}
        <div className="max-w-xl space-y-6 mt-10 lg:mt-0">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            A New Way to{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Prepare
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Master technical interviews with real-time AI that listens, analyzes,
            evaluates and gives instant feedback — just like a real interviewer.
          </p>

          {/* CTA BUTTON */}
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-full text-black font-semibold shadow-xl hover:scale-105 transition"
          >
            Get Started →
          </button>
        </div>

        {/* RIGHT FLOATING ILLUSTRATION */}
        <div className="relative mt-10 lg:mt-0">
          <div className="w-[420px] h-[260px] bg-zinc-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700 p-5 
                          transform rotate-6 hover:rotate-3 transition-all duration-500 
                          hover:scale-105 floating-card">
            
            <div className="flex gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-green-500"></div>
              <div className="w-10 h-10 rounded-lg bg-green-400"></div>
              <div className="w-10 h-10 rounded-lg bg-green-300"></div>
              <div className="w-10 h-10 rounded-lg bg-green-600"></div>
            </div>

            <div className="space-y-3">
              <div className="w-full h-3 bg-zinc-700/60 rounded"></div>
              <div className="w-3/4 h-3 bg-zinc-700/60 rounded"></div>

              <div className="w-1/2 h-3 bg-green-500/60 rounded mt-4"></div>
              <div className="w-1/4 h-3 bg-green-400/60 rounded"></div>
              <div className="w-1/3 h-3 bg-green-300/60 rounded"></div>
            </div>
          </div>
        </div>

      </div>

      {/* SUB SECTION */}
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
          Start Exploring
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-3">
          Level up your interview preparation with structured practice sessions,
          AI-powered question sets, and real-time feedback that helps you
          improve faster than ever.
        </p>
      </div>

    </div>
  );
};

export default Home;
