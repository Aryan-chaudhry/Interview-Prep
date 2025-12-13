import React from 'react';

const Pagination = ({ filteredJobsLength, pageSize, page, setPage, totalPages, showAll, setShowAll }) => {
  if (filteredJobsLength <= pageSize) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button disabled={page <= 1 && !showAll} onClick={() => setPage((p) => Math.max(1, p - 1))} className="btn btn-sm btn-ghost">Prev</button>

      <div className="text-sm text-gray-600">Page {showAll ? 'All' : page} of {totalPages}</div>

      <button disabled={page >= totalPages && !showAll} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="btn btn-sm btn-ghost">Next</button>

      <button className="btn btn-sm" onClick={() => setShowAll((s) => !s)}>{showAll ? 'Show Pages' : 'Show All'}</button>
    </div>
  );
};

export default Pagination;
