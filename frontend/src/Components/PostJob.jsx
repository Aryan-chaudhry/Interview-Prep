import React, { useState } from "react";
import axios from "axios";

const PostJob = () => {
  const [form, setForm] = useState({
    posterName: "",
    gender: "",
    profilePhoto: "",
    jobTitle: "",
    jobRole: "",
    location: "",
    postedTime: new Date().toISOString(),
    jobDescription: "",
    professionalJD: "",
    primarySkills: "",
    secondarySkills: "",
    rating: 0,
    workType: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitJob = async () => {
    try {
      const payload = {
        ...form,
        primarySkills: form.primarySkills.split(",").map((s) => s.trim()),
        secondarySkills: form.secondarySkills.split(",").map((s) => s.trim()),
      };

      await axios.post("http://localhost:8080/api/postjobs", payload);

      alert("Job Posted Successfully!");

      setForm({
        posterName: "",
        gender: "",
        profilePhoto: "",
        jobTitle: "",
        jobRole: "",
        location: "",
        postedTime: new Date().toISOString(),
        jobDescription: "",
        professionalJD: "",
        primarySkills: "",
        secondarySkills: "",
        rating: 0,
        workType: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error Posting Job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-5 py-10 flex justify-center">

      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(80,255,120,0.18)]">

        <h1 className="text-3xl font-bold text-center mb-8 text-green-400 tracking-wide">
          Post a New Job
        </h1>

        {/* BASIC DETAILS */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-green-300 mb-4">👤 Basic Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Poster Name */}
            <div>
              <label className="text-xs opacity-70 ml-1">Poster Name</label>
              <input
                name="posterName"
                value={form.posterName}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="Enter your name"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs opacity-70 ml-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="text-xs opacity-70 ml-1">Profile Photo URL</label>
              <input
                name="profilePhoto"
                value={form.profilePhoto}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>
        </section>

        {/* JOB DETAILS */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-green-300 mb-4">💼 Job Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-xs opacity-70 ml-1">Job Title</label>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="Senior MERN Developer"
              />
            </div>

            <div>
              <label className="text-xs opacity-70 ml-1">Job Role</label>
              <input
                name="jobRole"
                value={form.jobRole}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="Full Stack Developer"
              />
            </div>

            <div>
              <label className="text-xs opacity-70 ml-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="Bangalore, India"
              />
            </div>

            <div>
              <label className="text-xs opacity-70 ml-1">Work Type</label>
              <select
                name="workType"
                value={form.workType}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
              >
                <option value="">Select</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Office</option>
              </select>
            </div>

            <div>
              <label className="text-xs opacity-70 ml-1">Rating</label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="0 - 5"
              />
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-green-300 mb-3">📝 Descriptions</h2>

          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            className="w-full bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition mb-6"
            rows="4"
            placeholder="Job Description..."
          />

          <textarea
            name="professionalJD"
            value={form.professionalJD}
            onChange={handleChange}
            className="w-full bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
            rows="4"
            placeholder="Professional JD..."
          />
        </section>

        {/* SKILLS */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-green-300 mb-3">🧠 Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-xs opacity-70 ml-1">Primary Skills</label>
              <input
                name="primarySkills"
                value={form.primarySkills}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="React, Node, MongoDB"
              />
            </div>

            <div>
              <label className="text-xs opacity-70 ml-1">Secondary Skills</label>
              <input
                name="secondarySkills"
                value={form.secondarySkills}
                onChange={handleChange}
                className="w-full mt-1 bg-black/30 border border-white/20 p-3 rounded-lg outline-none focus:border-green-400 transition"
                placeholder="Express, Tailwind, AWS"
              />
            </div>

          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="text-center">
          <button
            onClick={submitJob}
            className="px-10 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-500/30"
          >
            Submit Job
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostJob;
