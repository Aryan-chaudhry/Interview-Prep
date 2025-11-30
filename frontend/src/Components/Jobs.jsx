// Jobs.jsx
// IMPORTANT: run `npm install axios react-toastify framer-motion lucide-react react-icons react-router-dom`

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaRegStar, FaRegFileAlt } from "react-icons/fa";
import { IoNewspaperSharp } from "react-icons/io5";
import { MdOutlineVideoCall } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 

export default function Jobs() {
  const navigate = useNavigate(); // Initialize useNavigate
  const now = new Date();
  const formatted = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [activeTab, setActiveTab] = useState("application");
  const [resumeFile, setResumeFile] = useState(null);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [matchedSkillsCount, setMatchedSkillsCount] = useState(0);
  const [matchedPrimarySkills, setMatchedPrimarySkills] = useState([]);
  const [matchedSecondarySkills, setMatchedSecondarySkills] = useState([]);
  const [interviewStatus, setInterviewStatus] = useState("pending"); 
  const [resumeTextContent, setResumeTextContent] = useState(""); 

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => toast.error("Failed to load jobs"));
  }, []);
  
  useEffect(() => {
    if (activeJob) {
      setInterviewStatus("pending");
      setMatchedSkillsCount(0);
      setResumeFile(null);
      setScanningProgress(0);
      setResumeTextContent("");
    }
  }, [activeJob]);


  // --------------- extractTextAndMatchSkills (Backend PDF Extraction) ---------------
  const extractTextAndMatchSkills = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("Please select a PDF file");

    setResumeFile(file);
    setScanningProgress(0);
    setMatchedPrimarySkills([]);
    setMatchedSecondarySkills([]);
    setMatchedSkillsCount(0);
    setInterviewStatus("pending"); 

    let progress = 0;
    const fakeProgress = setInterval(() => {
      progress += 4;
      if (progress >= 95) {
        clearInterval(fakeProgress);
      }
      setScanningProgress(progress);
    }, 150);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await axios.post(
        "http://localhost:8080/api/extractpdf",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      clearInterval(fakeProgress);
      setScanningProgress(100);

      const text = res.data.extractedText || "";
      setResumeTextContent(text); 

      if (!activeJob) return;

      const resumeText = text
        .toLowerCase()
        .replace(/[\r\n]+/g, " ")
        .replace(/[^a-z0-9.+# ]/gi, " ")
        .replace(/\s+/g, " ");

      const matchSkill = (skill) => {
        if (!skill) return false;

        const s = skill.toLowerCase().trim();
        const variations = [
          s,
          s.replace(/\s+/g, ""),
          s.replace(/\s+/g, "-"),
          s.replace(/\s+/g, "."),
          s.replace(/\s+/g, "_"),
          s.replace(/js$/, " js"),
        ];

        return variations.some((v) => {
          try {
            const escaped = v.replace(
              /[-[\]{}()*+?.,\\^$|#\s]/g,
              "\\$&"
            );
            const regex = new RegExp(`\\b${escaped}\\b`, "i");
            return regex.test(resumeText);
          } catch {
            return false;
          }
        });
      };

      const p = activeJob.primarySkills?.filter(matchSkill) || [];
      const s = activeJob.secondarySkills?.filter(matchSkill) || [];

      const totalMatched = p.length + s.length;
      setMatchedPrimarySkills(p);
      setMatchedSecondarySkills(s);
      setMatchedSkillsCount(totalMatched);

      // --- LOGIC: Check for readiness ( > 3 skills) ---
      if (totalMatched > 3) {
        setInterviewStatus("ready");
        toast.success(`Matched ${totalMatched} skills! Interview is ready.`);
      } else {
        setInterviewStatus("pending");
        toast.warn(`Only matched ${totalMatched} skills. Needs more skills.`);
      }

    } catch (err) {
      console.error(err);
      clearInterval(fakeProgress);
      toast.error("Failed to extract text from PDF");
      setScanningProgress(0);
      setInterviewStatus("pending");
    }
  };

  // --------------- Handle Activation and Redirection ---------------
  const handleActivateInterview = () => {
    if (matchedSkillsCount > 3) {
      setInterviewStatus("activated");
      toast.success("Interview activated! Redirecting...");

      // Simulate a small delay for animation/user feedback
      setTimeout(() => {
        // Redirect to /interview with all necessary data in state
        navigate("/interview", {
          state: {
            jobDetails: activeJob,
            resumeContent: resumeTextContent,
            matchedPrimarySkills,
            matchedSecondarySkills,
            matchedSkillsCount,
          },
        });
      }, 1500); // 1.5 second delay
    } else {
      toast.error("Match more than 3 skills to activate the interview.");
    }
  };
  // -----------------------------------------------------------------------------

  const filtered = jobs.filter((job) => {
    const t = search.toLowerCase();
    return (
      job.jobTitle?.toLowerCase().includes(t) ||
      job.jobRole?.toLowerCase().includes(t) ||
      job.location?.toLowerCase().includes(t)
    );
  });

  // Helper function to determine ping class
  const getPingClasses = (status) => {
    if (status === "activated") {
      return "bg-green-500 opacity-75"; // Activated/Live
    }
    if (status === "ready") {
      return "bg-yellow-500 opacity-75"; // Ready to Activate
    }
    return "bg-red-500 opacity-75"; // Pending/Default
  };

  // Helper function to determine inner dot class
  const getDotClasses = (status) => {
    if (status === "activated") {
      return "bg-green-500";
    }
    if (status === "ready") {
      return "bg-yellow-500";
    }
    return "bg-red-500";
  };
  
  // Helper function to determine status text
  const getStatusText = (status) => {
    if (status === "activated") return "Live";
    if (status === "ready") return "Ready";
    return "Pending";
  };


  const tabs = [
    {
      id: "application",
      label: "Job Application",
      icon: <IoNewspaperSharp size={18} />,
    },
    { id: "resume", label: "Resume", icon: <FaRegFileAlt size={18} /> },
    {
      id: "interview",
      label: "Interview",
      icon: <MdOutlineVideoCall size={18} />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white px-25 py-20">
      <ToastContainer />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Explore Premium Jobs
      </motion.h1>

      {/* Search */}
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
              <img
                src={job.profilePhoto}
                alt="profile"
                className="w-12 h-12 rounded-full object-cover border border-white/10"
              />
              <div>
                <p className="text-lg font-semibold">{job.posterName}</p>
                <p className="text-xs opacity-60">{job.gender}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-green-400">
              {job.jobTitle}
            </h2>
            <p className="opacity-80 text-sm mb-2">Role: {job.jobRole}</p>
            <p className="opacity-60 text-sm mb-2">Location: {job.location}</p>
            <p className="opacity-60 text-sm mb-2">Posted: {job.postedTime}</p>

            <p className="opacity-80 text-sm mt-4 line-clamp-3">
              {job.jobDescription}
            </p>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm opacity-80">{job.workType}</span>
              <div className="flex gap-2 hover:bg-zinc-700 rounded-full pl-2 pr-2 py-1">
                <FaRegStar className="text-yellow-500 mt-1" />
                <span className="text-yellow-400">{job.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* Drawer */}
      {activeJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-5xl h-full bg-black/80 border-l border-white/10 overflow-y-auto p-8">
            {/* Top */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={activeJob.profilePhoto}
                  alt="profile"
                  className="w-16 h-16 rounded-full border border-white/10"
                />
                <div>
                  <div className="flex justify-center gap-5">
                    <h2 className="text-2xl font-bold mt-1">
                      {activeJob.posterName}
                    </h2>

                    <div className="flex gap-2 mt-2 border border-yellow-500 w-32 justify-center rounded-full">
                      <FaRegStar className="text-yellow-500 mt-1" size={17} />
                      <p className="text-yellow-500">{activeJob.rating}</p>
                      <p>Overall</p>
                    </div>

                    {/* --- UPDATED: Interview Readiness Ping --- */}
                   <div className="flex gap-2 mt-2 border border-green-500 w-32 justify-center rounded-full">
                    <span className="pt-1">
                      <span className="relative flex h-3 w-3 mt-1">
                        <span 
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getPingClasses(interviewStatus)}`}
                        ></span>
                        <span 
                          className={`relative inline-flex mt-[2px] ml-[2px] h-2 w-2 rounded-full ${getDotClasses(interviewStatus)}`}
                        ></span>
                      </span>
                    </span>
                    <p>{getStatusText(interviewStatus)}</p>
                  </div>

                  </div>
                  <p>
                    <span className="text-gray-500 px-3">Posted for</span>
                    {activeJob.jobRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveJob(null)}
                className="px-4 py-2 bg-red-500 rounded-xl hover:bg-red-600"
              >
                Close
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-3">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeTab === t.id
                      ? "bg-green-500 text-black"
                      : "bg-white/10"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Application */}
            {activeTab === "application" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                  <p className="opacity-70 text-sm">
                    {activeJob.jobDescription}
                  </p>
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">
                    Professional Description
                  </h3>
                  <p className="opacity-70 text-sm">
                    {activeJob.professionalJD}
                  </p>
                  </div>
              </div>
            )}

            {/* Tab: Resume */}
            {activeTab === "resume" && (
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={extractTextAndMatchSkills}
                    className="file:bg-green-500 file:text-black file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
                  />

                  {resumeFile && (
                    <p className="mt-3 opacity-70">Selected: {resumeFile.name}</p>
                  )}

                  {resumeFile && (
                    <div className="w-full bg-white/20 h-4 rounded-full mt-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all"
                        style={{ width: `${scanningProgress}%` }}
                      />
                    </div>
                  )}

                  {scanningProgress === 100 && (
                    <p className="mt-2 text-green-400">
                      Matched Skills: {matchedSkillsCount}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Interview */}
            {activeTab === "interview" && (
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-md bg-white/5 p-5 border border-white/10 flex justify-center items-center">
                      {formatted}
                    </div>
                    <div>
                      <h1>Technical Interview</h1>
                      <p className="text-gray-500">
                        1 hour with <i>CareerPilot</i>
                      </p>
                    </div>
                  </div>

                  <hr className="mt-5 text-gray-400" />

                  <div className="flex justify-between pt-5">
                    <div className="flex gap-10">
                      <div>
                        <p className="text-gray-500">Location</p>
                        <h1>Online</h1>
                      </div>

                      <div>
                        <p className="text-gray-500">Status</p>
                        <h1 className="flex gap-2">
                          <span className="pt-1">
                            <span className="relative flex h-3 w-3 mt-1">
                              {/* Animate Ping Class based on status */}
                              <span 
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getPingClasses(interviewStatus)}`}
                              ></span>
                              {/* Inner Dot Class based on status */}
                              <span 
                                className={`relative inline-flex mt-[2px] ml-[2px] h-2 w-2 rounded-full ${getDotClasses(interviewStatus)}`}
                              ></span>
                            </span>
                          </span>
                          {getStatusText(interviewStatus)}
                        </h1>
                      </div>

                      <div>
                        <p className="text-gray-500">Created By</p>
                        <h1>Agent</h1>
                      </div>
                    </div>

                    <div>
                      {/* --- UPDATED: Activate Interview Button --- */}
                      <button 
                        onClick={handleActivateInterview}
                        disabled={interviewStatus !== "ready" && interviewStatus !== "activated"}
                        className={`px-5 h-10 border rounded-md transition duration-200 
                          ${
                            interviewStatus === "ready" || interviewStatus === "activated"
                              ? "border-green-500 text-green-500 hover:bg-green-600 hover:text-white"
                              : "border-gray-500 text-gray-500 cursor-not-allowed opacity-50"
                          }
                        `}
                      >
                        {interviewStatus === "activated" ? "Interview Live" : "Activate Interview"}
                      </button>
                      {/* ------------------------------------------- */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3">
                  Personal Information
                </h3>
                <p className="opacity-70 text-sm">Gender: {activeJob.gender}</p>
                <p className="opacity-70 text-sm mt-2">
                  Email: {activeJob.email}
                </p>
                <p className="opacity-70 text-sm mt-2">
                  Location: {activeJob.location}
                </p>
              </div>

              {/* Skills */}
              <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold mb-3">Skills</h3>

                <p className="text-sm font-semibold">Primary Skills:</p>
                <div className="flex flex-wrap gap-2 my-2">
                  {activeJob.primarySkills?.map((s, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 border text-xs rounded-full ${
                        matchedPrimarySkills.includes(s)
                          ? "bg-green-500/70 border-green-500/80"
                          : "bg-green-500/20 border-green-500/30"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-sm font-semibold mt-3">Secondary Skills:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeJob.secondarySkills?.map((s, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 border text-xs rounded-full ${
                        matchedSecondarySkills.includes(s)
                          ? "bg-green-500/70 border-green-500/80"
                          : "bg-white/10 border-white/20"
                      }`}
                    >
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