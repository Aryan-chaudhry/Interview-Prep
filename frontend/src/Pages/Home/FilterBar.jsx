import React from 'react';
import { Upload } from 'lucide-react';

const FilterBar = ({
  query,
  setQuery,
  scanningGlobal,
  handleGlobalResumeUpload,
  showMatchesOnly,
  setShowMatchesOnly,
  workType,
  setWorkType,
  premiumOnly,
  setPremiumOnly,
  allSkills,
  skillFilter,
  setSkillFilter,
  isDark,
}) => {
  return (
    <div
      className={`${
        isDark ? 'bg-base-900/60 border border-base-700' : 'bg-white'
      } p-4 rounded-lg shadow mb-10`}
    >
      <div className="flex gap-3 flex-wrap">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, company or role"
          className={`input input-bordered w-72 ${
            isDark ? 'bg-base-800 text-gray-200 placeholder-gray-400 border-base-700' : ''
          }`}
        />

        <label className={`flex items-center gap-2 btn btn-sm btn-outline ${scanningGlobal ? 'opacity-60' : ''}`}>
          <Upload size={14} />
          <span>{scanningGlobal ? 'Scanning...' : 'Upload Resume'}</span>
          <input type="file" accept=".pdf,.txt" onChange={handleGlobalResumeUpload} className="hidden" disabled={scanningGlobal} />
        </label>

        <button
          onClick={() => setShowMatchesOnly((s) => !s)}
          className={`btn btn-sm ${showMatchesOnly ? 'bg-teal-500' : 'btn-ghost'}`}
          title="Show only jobs that match your uploaded resume"
        >
          {showMatchesOnly ? 'Showing Matches' : 'Show Matches'}
        </button>

        <div className="flex justify-center items-center gap-2">
          <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Work type:
          </label>
          {['All', 'Remote', 'Hybrid', 'Office'].map((w) => (
            <button
              key={w}
              onClick={() => setWorkType(w)}
              className={`btn btn-sm ${workType === w ? 'bg-teal-500' : 'btn-ghost'}`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Show:
          </label>
          {['All', 'Premium'].map((p) => (
            <button
              key={p}
              onClick={() => setPremiumOnly(p === 'Premium')}
              className={`btn btn-sm ${
                premiumOnly && p === 'Premium'
                  ? 'btn-primary'
                  : !premiumOnly && p === 'All'
                  ? 'bg-teal-500'
                  : 'btn-ghost'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Skill:
          </label>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className={`select select-bordered select-sm ${
              isDark ? 'bg-base-800 text-gray-200 border-base-700' : ''
            }`}
          >
            <option value="">All</option>
            {allSkills.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
