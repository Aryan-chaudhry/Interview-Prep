import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useThemeStore } from '../../Store/useThemeStore';
import { Briefcase, MapPin, Mail, User, Star, PlusCircle, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManualInterview = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [jobId, setJobId] = useState(0);

  const darkThemes = ['dark', 'black', 'night', 'dracula', 'nord', 'dim'];
  const isDark = darkThemes.includes(theme);

  // Constants for fixed values
  const AGENT_NAME = "Agent";
  const AGENT_EMAIL = "agent@gmail.com";

  const [form, setForm] = useState({
    companyName: '',
    gender: 'Male',
    jobTitle: '',
    jobRole: '',
    location: '',
    postedTime: new Date().toISOString().slice(0, 10),
    jobDescription: '',
    professionalJD: '',
    primarySkillsText: '',
    secondarySkillsText: '',
    rating: 0,
    workType: 'Remote'
  });

  const getJobLength = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/getjoblength', {
        withCredentials: true
      });
      setJobId((response.data.length || 0) + 1);
    } catch (error) {
      console.error('Error fetching job length', error);
    }
  };

  useEffect(() => {
    getJobLength();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const parseSkills = (text) => text.split(',').map((s) => s.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobPayload = {
      ...form,
      posterName: AGENT_NAME, // Always send fixed Agent name
      email: AGENT_EMAIL,     // Always send fixed Agent email
      id: jobId,
      postedTime: new Date(form.postedTime),
      primarySkills: parseSkills(form.primarySkillsText),
      secondarySkills: parseSkills(form.secondarySkillsText),
      rating: Number(form.rating),
    };

    try {
      await axios.post('http://localhost:8080/api/addJobs', jobPayload, { withCredentials: true });
      toast.success('Job Created Successfully! ✨');
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create job');
    }
  };

  // Shared Input Style
  const inputClass = `w-full mt-1 p-3 rounded-xl border transition-all duration-200 outline-none 
    ${isDark 
      ? 'bg-base-200 border-gray-700 text-white focus:border-teal-500' 
      : 'bg-white border-gray-200 text-gray-800 focus:border-indigo-500 shadow-sm'}`;

  // Read-only specific style
  const readOnlyClass = `${inputClass} opacity-60 cursor-not-allowed border-dashed`;

  const labelClass = `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} ml-1`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-base-300' : 'bg-slate-50'} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-base-100' : 'hover:bg-white shadow-sm'}`}
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Manual Interview</h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Customize your job simulation parameters</p>
            </div>
          </div>
          
          <div className={`${isDark ? 'bg-base-100' : 'bg-white'} px-6 py-2 rounded-2xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className="text-xs block opacity-60 uppercase font-bold">ID</span>
            <span className="text-xl font-mono font-bold text-teal-500">#{jobId}</span>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-base-100 border-gray-800' : 'bg-white border-gray-100'} border rounded-3xl shadow-2xl overflow-hidden`}>
          <div className="p-6 md:p-10 space-y-8">
            
            {/* Section 1: Company Info */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-5 text-teal-500">
                <Briefcase size={20} /> Company & Role Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input name="companyName" value={form.companyName} onChange={handleChange} required className={inputClass} placeholder="e.g. Google" />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input name="jobTitle" value={form.jobTitle} onChange={handleChange} required className={inputClass} placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div>
                  <label className={labelClass}>Work Type</label>
                  <select name="workType" value={form.workType} onChange={handleChange} className={inputClass}>
                    <option>Remote</option>
                    <option>Office</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-5 opacity-40" />
                    <input name="location" value={form.location} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="London, UK" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Experience Rating (0-5)</label>
                  <div className="relative">
                    <Star size={16} className="absolute left-3 top-5 text-yellow-500" />
                    <input type="number" name="rating" min="0" max="5" value={form.rating} onChange={handleChange} className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Posted Date</label>
                  <input type="date" name="postedTime" value={form.postedTime} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </section>

            {/* Section 2: Poster Details (LOCKED) */}
            <section className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-5 text-teal-500">
                <User size={20} /> Interviewer Information <span className="text-xs font-normal opacity-50 ml-2">(Fixed)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className={labelClass}>Interviewer Name</label>
                  <input value={AGENT_NAME} readOnly className={readOnlyClass} />
                  <Lock size={14} className="absolute right-3 top-11 opacity-30" />
                </div>
                <div className="relative">
                  <label className={labelClass}>Contact Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-5 opacity-40" />
                    <input value={AGENT_EMAIL} readOnly className={`${readOnlyClass} pl-10`} />
                    <Lock size={14} className="absolute right-3 top-3 opacity-30" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Gender Preference</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 3: Job Description */}
            <section className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-5 text-teal-500">
                <PlusCircle size={20} /> Description & Skills
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Primary Skills (Comma Separated)</label>
                    <input name="primarySkillsText" value={form.primarySkillsText} onChange={handleChange} className={inputClass} placeholder="React, Tailwind, Node.js" />
                  </div>
                  <div>
                    <label className={labelClass}>Secondary Skills</label>
                    <input name="secondarySkillsText" value={form.secondarySkillsText} onChange={handleChange} className={inputClass} placeholder="Docker, AWS, Redis" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Short Job Summary</label>
                  <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} rows="3" className={inputClass} placeholder="Briefly describe the role..." />
                </div>
                <div>
                  <label className={labelClass}>Professional Job Description (AI Context)</label>
                  <textarea name="professionalJD" value={form.professionalJD} onChange={handleChange} rows="5" className={inputClass} placeholder="Paste the full job requirements here for better AI analysis..." />
                </div>
              </div>
            </section>
          </div>

          {/* Action Footer */}
          <div className={`p-6 md:p-8 ${isDark ? 'bg-base-200/50' : 'bg-gray-50'} border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} flex justify-end gap-4`}>
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${isDark ? 'hover:bg-base-100 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-10 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Generate Premium Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualInterview;