// Jobs.jsx — WHITE + INDIGO PREMIUM THEME

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
import Confetti from "react-confetti";

// Loader
const JobsLoader = () => (
  <div className="flex space-x-2 justify-center items-center h-48">
    <motion.div className="h-4 w-4 bg-indigo-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
    <motion.div className="h-4 w-4 bg-indigo-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
    <motion.div className="h-4 w-4 bg-indigo-500 rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
  </div>
);

export default function Jobs() {
  const navigate = useNavigate();
  const now = new Date();
  const formatted = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

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
  const [isLoading, setIsLoading] = useState(true);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:8080/api/jobs")
      .then(res => { setJobs(res.data || []); setIsLoading(false); })
      .catch(() => { toast.error("Failed to load jobs"); setIsLoading(false); });
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

  // Extract + Matching
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
      if (progress >= 95) clearInterval(fakeProgress);
      setScanningProgress(progress);
    }, 150);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await axios.post("http://localhost:8080/api/extractpdf", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      clearInterval(fakeProgress);
      setScanningProgress(100);

      const text = res.data.extractedText || "";
      setResumeTextContent(text);

      if (!activeJob) return;

      const resumeText = text.toLowerCase().replace(/[\r\n]+/g, " ")
        .replace(/[^a-z0-9.+# ]/gi, " ").replace(/\s+/g, " ");

      const matchSkill = (skill) => {
        if (!skill) return false;
        const s = skill.toLowerCase().trim();
        const variations = [s, s.replace(/\s+/g, ""), s.replace(/\s+/g, "-")];
        return variations.some(v => {
          try {
            const escaped = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            const regex = new RegExp(`\\b${escaped}\\b`, "i");
            return regex.test(resumeText);
          } catch { return false; }
        });
      };

      const p = activeJob.primarySkills?.filter(matchSkill) || [];
      const s = activeJob.secondarySkills?.filter(matchSkill) || [];

      const totalMatched = p.length + s.length;
      setMatchedPrimarySkills(p);
      setMatchedSecondarySkills(s);
      setMatchedSkillsCount(totalMatched);

      if (totalMatched > 3) {
        setInterviewStatus("ready");
        toast.success(`Matched ${totalMatched} skills! Interview ready.`);
      } else {
        toast.warn(`Only ${totalMatched} skills matched. Improve resume.`);
      }

    } catch (err) {
      toast.error("Failed to extract text");
      clearInterval(fakeProgress);
      setScanningProgress(0);
      setInterviewStatus("pending");
    }
  };

  const handleActivateInterview = () => {
    if (matchedSkillsCount > 3) {
      setInterviewStatus("activated");
      toast.success("Interview Activated!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
      setTimeout(() => {
        const candidate = {
          resume: resumeTextContent,
          jobDescription: activeJob.jobDescription,
          professionalJD: activeJob.professionalJD,
          primarySkills: activeJob.primarySkills,
          secondarySkills: activeJob.secondarySkills,
          matchedPrimarySkills,
          matchedSecondarySkills,
          jobRole: activeJob.jobRole,
        };
        navigate("/interview", { state: { Candidatedata: candidate } });
      }, 5000);
    } else {
      toast.error("Match more than 3 skills to activate interview.");
    }
  };

  const filtered = jobs.filter((job) => {
    const t = search.toLowerCase();
    return (
      job.jobTitle?.toLowerCase().includes(t) ||
      job.jobRole?.toLowerCase().includes(t) ||
      job.location?.toLowerCase().includes(t)
    );
  });

  const tabs = [
    { id: "application", label: "Job Application", icon: <IoNewspaperSharp size={18} /> },
    { id: "resume", label: "Resume", icon: <FaRegFileAlt size={18} /> },
    { id: "interview", label: "Interview", icon: <MdOutlineVideoCall size={18} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 px-25 py-20">

      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      <ToastContainer />

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10 text-indigo-600">
        Explore Premium Jobs
      </motion.h1>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:border-indigo-500 outline-none"
            placeholder="Search job title, role, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <JobsLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((job, index) => (
            <motion.div
              key={index}
              onClick={() => setActiveJob(job)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-indigo-500 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={job.profilePhoto} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold">{job.posterName}</p>
                  <p className="text-xs text-gray-500">{job.gender}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-indigo-600">{job.jobTitle}</h2>
              <p className="text-gray-600 text-sm">Role: {job.jobRole}</p>
              <p className="text-gray-500 text-sm">Location: {job.location}</p>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-600">{job.workType}</span>

                <div className="flex gap-2 bg-gray-100 rounded-full px-3 py-1">
                  <FaRegStar className="text-indigo-500 mt-1" />
                  <span className="text-indigo-600">{job.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {activeJob && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-50">
          <div className="w-full max-w-5xl h-full bg-white overflow-y-auto p-8 border-l border-gray-200">

            {/* Close Button */}
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={activeJob.profilePhoto}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold">{activeJob.posterName}</h2>
                  <p className="text-gray-500">{activeJob.jobRole}</p>
                </div>
              </div>

              <button onClick={() => setActiveJob(null)}
                className="px-4 h-10  text-white rounded-xl hover:bg-gray-200 hover:cursor-pointer">
                <h1 className="text-gray-400 text-2xl">x</h1>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-3 border-gray-200">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                    ${activeTab === t.id ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* === Application Tab === */}
            {activeTab === "application" && (
              <div className="space-y-6">
                <div className="bg-gray-200 p-5 rounded-xl ">
                  <h3 className="font-semibold mb-2 text-lg">Job Description</h3>
                  <p className="text-gray-600 text-sm">{activeJob.jobDescription}</p>
                </div>

                <div className="bg-gray-200 p-5 rounded-xl ">
                  <h3 className="font-semibold mb-2 text-lg">Professional Description</h3>
                  <p className="text-gray-600 text-sm">{activeJob.professionalJD}</p>
                </div>
              </div>
            )}

            {/* === Resume Tab === */}
            {activeTab === "resume" && (
              <div className="bg-gray-200 p-6 rounded-xl flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Upload Resume</h3>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={extractTextAndMatchSkills}
                  className="file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-lg"
                />

                {resumeFile && <p className="text-gray-600">{resumeFile.name}</p>}

                {resumeFile && (
                  <div className="w-full bg-gray-200 h-4 rounded-full">
                    <div
                      className="bg-indigo-500 h-4 rounded-full"
                      style={{ width: `${scanningProgress}%` }}
                    />
                  </div>
                )}

                {scanningProgress === 100 && (
                  <div className="text-indigo-600">
                    Matched Skills: {matchedSkillsCount}
                  </div>
                )}
              </div>
            )}

            {/* === Interview Tab === */}
            {activeTab === "interview" && (
              <div className="bg-gray-200 p-5 rounded-xl">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Technical Interview</p>
                    <p className="text-gray-500 text-sm">CareerPilot</p>
                  </div>

                  <button
                    onClick={handleActivateInterview}
                    disabled={interviewStatus !== "ready" && interviewStatus !== "activated"}
                    className={`px-5 py-2 rounded-md border transition 
                      ${interviewStatus === "ready" || interviewStatus === "activated"
                        ? "border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                        : "border-gray-400 text-gray-400 cursor-not-allowed"}`}
                  >
                    {interviewStatus === "activated" ? "Interview Live" : "Activate Interview"}
                  </button>
                </div>

              </div>
            )}

            {/* Right Info */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-gray-200 p-5 rounded-xl">
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <p className="text-gray-600 text-sm">Gender: {activeJob.gender}</p>
                <p className="text-gray-600 text-sm mt-2">Email: {activeJob.email}</p>
                <p className="text-gray-600 text-sm mt-2">Location: {activeJob.location}</p>
              </div>

              <div className="bg-gray-200 p-5 rounded-xl ">
                <h3 className="font-semibold mb-3">Skills</h3>

                <p className="font-semibold text-sm">Primary Skills:</p>
                <div className="flex flex-wrap gap-2 my-2">
                  {activeJob.primarySkills?.map((s, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 text-xs rounded-full border 
                        ${matchedPrimarySkills.includes(s)
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                        }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <p className="font-semibold text-sm mt-2">Secondary Skills:</p>
                <div className="flex flex-wrap gap-2 my-2">
                  {activeJob.secondarySkills?.map((s, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 text-xs rounded-full border 
                        ${matchedSecondarySkills.includes(s)
                          ? "bg-indigo-500 text-white border-indigo-500"
                          : "bg-gray-100 text-gray-600 border-gray-300"
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
