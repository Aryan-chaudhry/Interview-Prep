import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

const JobCard = ({
  job,
  isDark,
  isJobPremium,
  getMatchScore,
  isQualifiedForJob,
  handleAiAssist,
  activateInterview,
  formatDate,
}) => {
  const isPremium = isJobPremium(job);
  const initials = (job.companyName || ' ').charAt(0).toUpperCase();
  const posted = job.postedDate || job.postedAt || job.createdAt || job.date || '';
  const displayDate = posted ? formatDate(posted) : '';
  const skills = job.primarySkills || [];
  const rating = typeof job.rating === 'number' ? job.rating : null;

  const cardBgClass = isPremium
    ? isDark
      ? 'bg-gray-800 shadow-2xl ring-2 ring-teal-400 border-teal-300'
      : 'bg-gradient-to-r from-teal-50 via-white to-white'
    : isDark
    ? 'bg-gray-900 shadow-md border border-base-700'
    : 'bg-white shadow';

  const textPrimary = !isPremium && isDark ? 'text-gray-200' : 'text-gray-500';
  const textSecondary = !isPremium && isDark ? 'text-gray-300' : 'text-gray-600';
  const badgeBg = !isPremium && isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700';

  return (
    <div
      key={job.id}
      className={`relative overflow-visible rounded-lg p-5 flex flex-col justify-between ${cardBgClass}`}
    >
      {isPremium && (
        <div
          className={`${
            isDark
              ? 'absolute -top-3 -left-3 bg-teal-600 text-white'
              : 'absolute -top-3 -left-3 bg-teal-500 text-white'
          } text-xs font-semibold px-3 py-1 rounded-br-md shadow-md transform -rotate-3`}
        >
          ★ Premium
        </div>
      )}

      <div className="flex gap-4">
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-md text-2xl font-bold ${
            isPremium
              ? isDark
                ? 'text-teal-300 bg-teal-900/10'
                : 'text-teal-700 bg-teal-100'
              : 'bg-gray-200 text-teal-500'
          }`}
        >
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className={`text-sm ${textPrimary}`}>{job.companyName}</div>
              <div className="text-lg font-semibold">{job.jobTitle || job.jobRole || 'Untitled Role'}</div>
              {job.jobRole && <div className={`text-sm ${textSecondary} mt-1`}>{job.jobRole}</div>}
            </div>

            <div className="text-right">
              <div
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  job.workType === 'Remote' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {job.workType}
              </div>

              {displayDate && (
                <div className={`text-xs ${isDark && !isPremium ? 'text-gray-300' : 'text-gray-400'} mt-2`}>Posted: {displayDate}</div>
              )}

              {rating !== null && (
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div className={`${isDark ? 'text-yellow-300' : 'text-yellow-500'} text-sm`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < Math.round(rating) ? '' : isDark ? 'text-gray-700' : 'text-gray-200'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">{rating.toFixed(1)}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {job.location && <div className={`text-sm ${textSecondary}`}>{job.location}</div>}
            {job.salary || job.compensation ? <div className="text-sm font-medium text-teal-700">{job.salary || job.compensation}</div> : null}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.slice(0, 6).map((s) => (
                <span key={s} className={`text-xs px-2 py-1 rounded-full ${badgeBg}`}>{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {getMatchScore(job.id) !== null && (
          <div className={`p-2 rounded-lg text-center text-sm font-bold ${
            isQualifiedForJob(job.id) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>Resume Match: {getMatchScore(job.id)}%</div>
        )}

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm">Details</button>
          <button onClick={() => handleAiAssist(job)} className="btn btn-teal btn-sm flex items-center gap-1 bg-teal-600 text-white hover:bg-teal-500" title="Chat with AI about this role">
            <Sparkles size={15} className="text-white" />
          </button>
        </div>

        {isQualifiedForJob(job.id) && (
          <button onClick={() => activateInterview(job)} className="btn bg-teal-600 text-white btn-sm w-full flex items-center justify-center gap-2 animate-pulse hover:bg-teal-500">
            <CheckCircle size={16} />
            Activate Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
