import React from "react";
import { Users, Crown, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";

const User = ({mic, video}) => {
  const { authUser } = useAuthStore();

  return (
    <div className="w-200 h-135 rounded-2xl shadow-2xl bg-[#0e0e0e] border border-[#1f1f1f] overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-[#1f1f1f]">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-teal-500" />
          <span className="text-sm font-semibold text-gray-200">
            Active Participants
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="h-full px-4 py-4 overflow-auto text-sm text-gray-300">

        {/* Interviewer */}
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[#141414] to-[#101010] border border-[#242424]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                AI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-100">
                    Lead Interviewer
                  </span>
                  <Crown size={14} className="text-yellow-400" />
                </div>
                <span className="text-xs text-gray-400">
                  InterviewPrep . agent
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-400">
              <Mic size={14} className="text-green-400" />
              <Video size={14} className="text-green-400" />
            </div>
          </div>
        </div>

        {/* Candidate */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#1f1f1f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-black font-bold uppercase">
                {authUser?.name?.[0] || "U"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-100">
                    {authUser?.name || "Candidate"}
                  </span>
                  <span className="px-2 py-[2px] text-[10px] rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Candidate
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Interview Room Participant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {
                mic  ? 
                  <MicOff size={14} className="text-gray-400" />
                  :
                  <Mic size={14} className="text-green-400" />
              }

              {
                video ? 
                <VideoOff size={14} className="text-gray-400" />
                :
                <Video size={14} className="text-green-400" />
              }
              
              {/* <Mic size={14} className="text-green-400" />
              <Video size={14} className="text-green-400" /> */}
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-6 text-center text-xs text-gray-500">
          All participants are securely connected to this interview session
        </div>

      </div>
    </div>
  );
};

export default User;
