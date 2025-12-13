import React from 'react';
import { useAuthStore } from '../../Store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Join = ({ job }) => {
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const formatDate = (iso) => {
        if (!iso) return 'N/A';
        try {
            return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return iso;
        }
    };

    if (!job) {
        return (
            <div className="bg-white">
                <div className="mx-auto py-16 sm:px-6 lg:px-8">
                    <div className="relative isolate overflow-hidden rounded-2xl bg-white px-6 py-14 shadow-md sm:px-16 text-center">
                        <p className="text-gray-600">Loading job details…</p>
                  
                    </div>
                </div>
            </div>
        );
    }

    const handleJoin = () => {
        const id = authUser?._id || job?.id || job?._id || 'me';
        navigate(`/interview/${id}`, { state: { job } });
    }

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 sm:px-6 lg:px-8">
                <div className="relative isolate overflow-hidden rounded-2xl bg-white px-6 py-14 shadow-md sm:px-16">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
                        <div className="flex-shrink-0">
                            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-teal-50">
                                <span className="text-2xl font-extrabold text-teal-600">{job.companyName?.charAt(0) ?? 'J'}</span>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
                            <p className="mt-1 text-sm text-gray-600">{job.jobRole} • {job.location} • {job.workType}</p>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">{job.rating ?? '—'} ★</span>
                                    <span className="text-sm text-gray-500">Posted {formatDate(job.postedTime)}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {(job.primarySkills || []).map((s) => (
                                    <span key={s} className="inline-flex items-center rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">{s}</span>
                                ))}
                                {(job.secondarySkills || []).map((s) => (
                                    <span key={s} className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-2">
                            <img src={authUser.profilePic} alt="User" className='w-10 h-10 object-cover rounded-full' />
                            <button onClick={handleJoin}
                                type="button"
                                className="inline-flex items-center gap-x-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-teal-500"
                            >
                                Join Now
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                            <p className="mt-3 text-gray-700 leading-relaxed">{job.jobDescription}</p>

                            <h3 className="mt-6 text-md font-semibold text-gray-900">Professional Responsibilities</h3>
                            <p className="mt-2 text-gray-700">{job.professionalJD}</p>
                        </div>

                        <aside className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <h4 className="text-sm font-semibold text-gray-900">Details</h4>
                            <dl className="mt-3 space-y-3 text-sm text-gray-700">
                                <div>
                                    <dt className="font-medium">Company</dt>
                                    <dd>{job.companyName}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Location</dt>
                                    <dd>{job.location}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Type</dt>
                                    <dd>{job.workType}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Posted By</dt>
                                    <dd>{job.posterName} • {job.email}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Created</dt>
                                    <dd>{formatDate(job.createdAt)}</dd>
                                </div>
                            </dl>
                        </aside>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Join;
