// Interview.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Join from './Join';
import RoomPage from './RoomPage';

const Interview = () => {
    const location = useLocation();
    const interviewData = location.state;

    const [info, setInfo] = useState(null);

    // Default values with fallback for robustness
    const jobTitle = interviewData?.jobDetails?.jobTitle || "Technical Interview";
    const defaultUsername = interviewData?.jobDetails?.posterName || "Interviewer";
    const matchedSkills = interviewData?.matchedSkillsCount || 0;
    // Create a robust, URL-safe room ID
    const defaultRoom = `Room-${jobTitle.replace(/[^a-zA-Z0-9]/g, "")}`; 
    const resumePreview = interviewData?.resumeContent?.substring(0, 100) || "No content available.";


    // Basic check for missing state
    if (!interviewData || !interviewData.jobDetails) {
        return (
            <div className="p-10 min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500">⚠️ Your interview is not scheduled yet</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-20">
            {/* Conditional Rendering based on connection status */}
            {!info ? (
                // --- Pre-Call Screen (Join Component) ---
                <div className="flex items-center justify-center h-screen p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                        {/* Left Side: Context Panel */}
                        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl">
                            <h1 className="text-4xl font-extrabold mb-2 text-green-400">{jobTitle} Interview</h1>
                            <p className="text-lg opacity-70 mb-6">Preparation Context</p>

                            <div className='bg-zinc-800 p-4 rounded-lg mb-4'>
                                <h2 className='text-xl font-semibold mb-2'>Candidate Context</h2>
                                <p className='text-sm opacity-90'>
                                    <span className="text-yellow-400">Matched Skills:</span> {matchedSkills}
                                </p>
                                <p className='text-xs opacity-60 mt-2'>
                                    <span className="font-mono">Resume Preview:</span> {resumePreview}...
                                </p>
                            </div>
                            <p className="text-sm text-green-500 mt-6">
                                The interview will cover technical topics related to {jobTitle}.
                            </p>
                        </div>
                        
                        {/* Right Side: Join Form */}
                        <div className="lg:col-span-1 flex items-center justify-center">
                            <Join 
                                onJoin={setInfo} 
                                defaultRoom={defaultRoom}
                                defaultUsername={defaultUsername}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // --- Live Video Call Screen (RoomPage) ---
                <RoomPage 
                    token={info.token} // Receives the guaranteed string token
                    url={info.url}     // Receives the guaranteed string URL
                    jobTitle={jobTitle} 
                    matchedSkills={matchedSkills}
                />
            )}
        </div>
    )
}

export default Interview;