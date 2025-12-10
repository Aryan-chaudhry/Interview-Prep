// HomePage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Video, Users, ArrowRight } from "lucide-react";

 function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex items-center justify-center px-6 py-10">
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CARD — Premium Meeting Box */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Start Your Interview Session
          </h2>

          <div className="space-y-6">

            {/* Meeting ID */}
            <div>
              <label className="text-gray-300 text-sm">Meeting ID</label>
              <input
                type="text"
                placeholder="Enter Meeting ID"
                className="w-full bg-white/10 mt-2 px-4 py-3 rounded-xl text-white border border-white/20 focus:ring-2 ring-indigo-500 outline-none"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-gray-300 text-sm">Your Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full bg-white/10 mt-2 px-4 py-3 rounded-xl text-white border border-white/20 focus:ring-2 ring-indigo-500 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-4">
              <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-xl font-medium w-full shadow-lg shadow-indigo-600/20">
                <Video size={18} /> Start Meeting
              </button>

              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition text-white px-5 py-3 rounded-xl font-medium w-full border border-white/20">
                <Users size={18} /> Join Meeting
              </button>
            </div>
          </div>
        </motion.div>


        {/* RIGHT SIDE — Hero Message */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Master Your Interview <br />
            <span className="bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              with InterviewPrep
            </span>
          </h1>

          <p className="text-gray-300 text-lg mt-6 max-w-md">
            Mock interviews, meeting rooms, and real-time practice —
            everything you need to crack your next tech interview.
          </p>

          <button className="mt-8 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white px-7 py-4 rounded-2xl font-semibold w-fit shadow-xl shadow-indigo-600/20">
            Get Started <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}


export default Home;
