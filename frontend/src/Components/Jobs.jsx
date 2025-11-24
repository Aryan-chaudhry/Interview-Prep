// Premium Jobs Page with Detail Drawer
// Uses your dark gradient theme and matches structure of reference UI

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaRegStar } from "react-icons/fa";

export default function Jobs() {
    const now = new Date(Date.now());
    const formatted = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short" // or "long"
    });

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [activeTab, setActiveTab] = useState("application");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/jobs").then((res) => setJobs(res.data));
  }, []);

  const filtered = jobs.filter((job) =>
    job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
    job.jobRole.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-white px-25 py-20">
      {/* Header */}
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-10">
        Explore Premium Jobs
      </motion.h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-3 opacity-50" />
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-green-400 outline-none backdrop-blur-md"
            placeholder="Search job title, role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((job, index) => (
          <motion.div
            key={index}
            onClick={() => setActiveJob(job)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-green-400 transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={job.profilePhoto} className="w-12 h-12 rounded-full object-cover border border-white/10" />
              <div>
                <p className="text-lg font-semibold">{job.posterName}</p>
                <p className="text-xs opacity-60">{job.gender}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-green-400">{job.jobTitle}</h2>
            <p className="opacity-80 text-sm mb-2">Role: {job.jobRole}</p>
            <p className="opacity-60 text-sm mb-2">Location: {job.location}</p>
            <p className="opacity-60 text-sm mb-2">Posted: {job.postedTime}</p>

            <p className="opacity-80 text-sm mt-4 line-clamp-3">{job.jobDescription}</p>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm opacity-80">{job.workType}</span>
              <div className="flex gap-2 hover:bg-zinc-700 rounded-full pl-2 pr-2 py-1">
                <FaRegStar className="text-yellow-500" />
                <span className="text-yellow-400">{job.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Page Drawer */}
      {activeJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-5xl h-full bg-black/80 border-l border-white/10 overflow-y-auto p-8">
            {/* Top Section */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img src={activeJob.profilePhoto} className="w-16 h-16 rounded-full border border-white/10" />
                <div >
                    <div className="flex hustify-center gap-5">
                        <h2 className="text-2xl font-bold mt-1">{activeJob.posterName}</h2>
                    
                        <div className="flex gap-2 mt-2 border border-yellow-500 w-30 justify-center   rounded-full">
                            <FaRegStar className="text-yellow-500 mt-1" size={17}/>
                            <p className="text-yellow-500">{activeJob.rating}</p>
                            <p>Overall</p>
                        </div>

                        <div className="flex gap-2 mt-2 border border-green-500 w-30 justify-center   rounded-full">
                            <span className="pt-1">
                                <span className="relative flex h-3 w-3 mt-1">
                                <span className=" animate-ping absolute  inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex mt-[2px] ml-[2px] h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                            </span>
                            <p>Activated</p>
                        </div>
                    </div>
                    <p><span className="text-gray-500 px-3">Posted for</span>{activeJob.jobRole}</p>
                  
                    {/* <div className="flex ustify-evenly gap-5 mt-3">
                        <div>
                            <p className="text-gray-500">Origin</p>
                            <p>{activeJob.location}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Posted on</p>
                            <p >
                                {new Date(activeJob.postedTime).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    // timeStyle: "short",
                                })}
                            </p>

                        </div>

                        <div>
                            <p className="text-gray-500">Role</p>
                            <p>{activeJob.jobRole}</p>
                        </div>
                    </div> */}
                </div>
              </div>

              <button
                onClick={() => setActiveJob(null)}
                className="px-4 py-2 bg-red-500  rounded-xl hover:bg-red-600"
              >
                Close
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-3">
              {[
                { id: "application", label: "Job Application" },
                { id: "resume", label: "Resume" },
                { id: "interview", label: "Interview" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === t.id ? "bg-green-500 text-black" : "bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}

            {/* Job Application Tab */}
            {activeTab === "application" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                  <p className="opacity-70 text-sm">{activeJob.jobDescription}</p>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Professional Description</h3>
                  <p className="opacity-70 text-sm">{activeJob.professionalJD}</p>
                </div>
              </div>
            )}

            {/* Resume Upload Tab */}
            {activeTab === "resume" && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
                <input
                  type="file"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="file:bg-green-500 file:text-black file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
                />
                {resumeFile && <p className="mt-3 opacity-70">Selected: {resumeFile.name}</p>}
              </div>
            )}

            {/* Interview Tab */}
            {activeTab === "interview" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10" >
                    <div className="flex gap-3">
                        <div className=" w-15 h-15  rounded-md bg-white/5 p-5 rounded-xl border border-white/10 flex py-1 px-5">{formatted}</div>
                        <div>
                            <h1>Techical Interview</h1>
                            <p className="text-gray-500 ">1 hour with <i>CarrerPilot</i></p>
                        </div>
                    </div>

                    <hr  className="mt-5 text-gray-400"/>

                    <div className="flex justify-between pt-5">

                        <div className="flex justify-start-safe gap-10 ">
                            <div>
                                <p className="text-gray-500">Location</p>
                                <h1>Online</h1>
                            </div>

                            <div>
                                <p className="text-gray-500">Status</p>
                                <h1 className="flex gap-2">
                                    <span className="pt-1">
                                        <span className="relative flex h-3 w-3 mt-1">
                                        <span className=" animate-ping absolute  inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                        <span className="relative inline-flex mt-[2px] ml-[2px] h-2 w-2 rounded-full bg-red-500"></span>
                                        </span>
                                    </span>
                                    Pending
                                </h1>
                            </div>

                            <div>
                                <p className="text-gray-500">Created By</p>
                                <h1>Agent</h1>
                            </div>

                        </div>

                        <div>
                            <button className="w-30 h-10 border border-green-500 rounded-md text-green-500 mt-1 hover:bg-green-600 hover:cursor-pointer hover:text-white transition duration-200 ">View Details</button>
                        </div>

                    </div>
                </div>
              </div>
            )}

            {/* Right Side Info */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <p className="opacity-70 text-sm">Gender: {activeJob.gender}</p>
                <p className="opacity-70 text-sm mt-2">Email:  <span className="text-gray-500">Not Provided</span></p>
                <p className="opacity-70 text-sm mt-2">Loction: <span>{activeJob.location}</span></p>
    
              </div>

              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <p className="text-sm font-semibold">Primary Skills:</p>
                <div className="flex flex-wrap gap-2 my-2">
                  {activeJob.primarySkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-xs rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-sm font-semibold mt-3">Secondary Skills:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeJob.secondarySkills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 text-xs rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}