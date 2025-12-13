import React from 'react';
import JobCard from './JobCard';
import {Loader} from 'lucide-react'

const JobGrid = ({ jobsToShow, filteredJobsLength, getMatchScore, isQualifiedForJob, handleAiAssist, activateInterview, isJobPremium, formatDate, isDark }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredJobsLength === 0 && <div className="col-span-full text-center text-gray-500 flex justify-center item-center py-30">
        <Loader size={40} className='text-teal-500 animate-spin' />
      </div>}

      {jobsToShow.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isDark={isDark}
          isJobPremium={isJobPremium}
          getMatchScore={getMatchScore}
          isQualifiedForJob={isQualifiedForJob}
          handleAiAssist={handleAiAssist}
          activateInterview={activateInterview}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default JobGrid;
