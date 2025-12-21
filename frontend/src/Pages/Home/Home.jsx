import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AlertCircle, Layers } from 'lucide-react'; // ✅ FIXED
import FilterBar from './FilterBar';
import JobGrid from './JobGrid';
import Pagination from './Pagination';
import { useAuthStore } from '../../Store/useAuthStore';
import { useThemeStore } from '../../Store/useThemeStore';
import Footer from './Footer';
import Chat from './Chat';
import { scanResume } from '../../utils/resumeScanner';
import { useNavigate } from "react-router-dom";
import ManualInterview from './ManualInterview'; // display this page when click on btn
import toast from 'react-hot-toast';

const Home = () => {

  const { authUser } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState([]);
  const [query, setQuery] = useState('');
  const [workType, setWorkType] = useState('All');
  const [skillFilter, setSkillFilter] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [showAll, setShowAll] = useState(false);

  const [aiPannel, setAiPannel] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumeScores, setResumeScores] = useState({});
  const [resumeContent, setResumeContent] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [scanningGlobal, setScanningGlobal] = useState(false);
  const [showMatchesOnly, setShowMatchesOnly] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [displayModel, setDisplayModel] = useState(false);

  const darkThemes = ['dark', 'black', 'night', 'dracula', 'nord', 'dim'];
  const isDark = darkThemes.includes(theme);

  const getJobData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/getjobs', {
        withCredentials: true,
      });
      setJobData(response.data || []);
    } catch (error) {
      console.log('error in getting jobs from backend', error);
    }
  };

  useEffect(() => {
    getJobData();
  }, []);

  const allSkills = useMemo(() => {
    const s = new Set();
    jobData.forEach((j) => (j.primarySkills || []).forEach((sk) => s.add(sk)));
    return Array.from(s).sort();
  }, [jobData]);

  const isJobPremium = (j) =>
    !!(
      j.isPremium ||
      j.premium ||
      (j.rating && j.rating >= 4.5) ||
      (j.professionalJD && j.professionalJD.length > 200)
    );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobData.filter((j) => {
      if (workType !== 'All' && j.workType !== workType) return false;
      if (premiumOnly && !isJobPremium(j)) return false;
      if (skillFilter && !(j.primarySkills || []).includes(skillFilter)) return false;
      if (showMatchesOnly && !resumeScores[j.id]?.isQualified) return false;
      if (!q) return true;
      return (
        (j.jobTitle || '').toLowerCase().includes(q) ||
        (j.companyName || '').toLowerCase().includes(q) ||
        (j.jobRole || '').toLowerCase().includes(q)
      );
    });
  }, [jobData, query, workType, skillFilter, premiumOnly, resumeScores, showMatchesOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));

  const jobsToShow = useMemo(() => {
    if (showAll) return filteredJobs;
    const start = (page - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, page, pageSize, showAll]);

  useEffect(() => setPage(1), [query, workType, skillFilter, premiumOnly]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const handleAiAssist = (job) => {
    setSelectedJob(job);
    setAiPannel(true);
  };

  const handleGlobalResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setScanningGlobal(true);
    setToastMsg('Scanning resume against all jobs...');

    try {
      const scores = {};
      for (const job of jobData) {
        const result = await scanResume(file, job);
        if (result.success) {
          if (!resumeContent && result.resumeText) setResumeContent(result.resumeText);
          scores[job.id] = {
            score: result.matchScore,
            skillScore: result.skillScore,
            isQualified: result.isQualifiedSkill,
          };
        } else {
          scores[job.id] = { score: 0, skillScore: 0, isQualified: false };
        }
      }

      setResumeScores(scores);
      setToastMsg('✓ Resume scanned. Showing matches.');
      setShowMatchesOnly(true);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error('Global resume scan error:', err);
      setToastMsg('✗ Error scanning resume');
      setTimeout(() => setToastMsg(''), 3000);
    } finally {
      setScanningGlobal(false);
    }
  };

  const isQualifiedForJob = (jobId) => resumeScores[jobId]?.isQualified === true;

  const getMatchScore = (jobId) =>
    resumeScores[jobId]?.skillScore ?? resumeScores[jobId]?.score ?? null;

  const activateInterview = (job, isAPremium) => {
    navigate(`/interview`, { state: { job, resumeContent, isAPremium } });
  };

  return (
    <div>
      <div className="min-h-screen bg-base-300 p-6 flex">
        <div className="mx-auto pt-20">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold">Hello, {authUser.name}</h1>
              <p className="text-sm text-gray-500">Preparing for your <i>Dream Job</i>..</p>
            </div>
          </div>

          <FilterBar
            query={query}
            setQuery={setQuery}
            scanningGlobal={scanningGlobal}
            handleGlobalResumeUpload={handleGlobalResumeUpload}
            showMatchesOnly={showMatchesOnly}
            setShowMatchesOnly={setShowMatchesOnly}
            workType={workType}
            setWorkType={setWorkType}
            premiumOnly={premiumOnly}
            setPremiumOnly={setPremiumOnly}
            allSkills={allSkills}
            skillFilter={skillFilter}
            setSkillFilter={setSkillFilter}
            isDark={isDark}
          />

          <JobGrid
            jobsToShow={jobsToShow}
            filteredJobsLength={filteredJobs.length}
            getMatchScore={getMatchScore}
            isQualifiedForJob={isQualifiedForJob}
            handleAiAssist={handleAiAssist}
            activateInterview={activateInterview}
            isJobPremium={isJobPremium}
            formatDate={formatDate}
            isDark={isDark}
          />

          <Pagination
            filteredJobsLength={filteredJobs.length}
            pageSize={pageSize}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        </div>

        {/* FLOATING LEFT ACTION BUTTON */}
        <button onClick={() => setDisplayModel(true)}
          className="fixed left-5 bottom-2 -translate-y-1/2 z-50 flex justify-center gap-3
                     bg-teal-500 text-white p-3  rounded-full shadow-xl 
                     hover:scale-110 transition-all duration-300 cursor-pointer"
          title="Quick Actions"
        >
          <Layers size={24} />
          <h1>Create Interview</h1>
        </button>
        {displayModel && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="relative w-full max-w-4xl mx-auto bg-base-300 rounded-xl shadow-2xl p-6 animate-scale-in">
      
      {/* Close Button */}
      <button
        onClick={() => setDisplayModel(false)}
        className="absolute top-3 right-3 text-xl font-bold hover:scale-110 transition"
      >
        ✕
      </button>

      <ManualInterview />
    </div>
  </div>
)}

        

        {aiPannel && selectedJob && (
          <Chat setAiPannel={setAiPannel} selectedJob={selectedJob} />
        )}

        {toastMsg && (
          <div className="fixed bottom-6 left-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl text-sm font-medium z-40 animate-fade-in">
            {toastMsg}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
