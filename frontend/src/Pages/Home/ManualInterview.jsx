import React from "react";
import { Briefcase, Building2, Sparkles } from "lucide-react";

const ManualInterview = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-2 text-teal-500">
          <h1 className="text-2xl font-semibold">
            Create Your Own Interview
          </h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Design a personalized interview experience tailored to your goals
        </p>
      </div>

      {/* Card */}
      <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl p-8">
        <form className="space-y-6">

          {/* Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Your Name */}
            <div>
              <label className="text-sm font-medium text-gray-400">
                Your Name
              </label>
              <div className="mt-2 flex items-center gap-2 border border-teal-500/40 rounded-xl px-4 py-3 focus-within:border-teal-500 transition">
                <Briefcase className="text-teal-500" size={18} />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="text-sm font-medium text-gray-400">
                Company Name
              </label>
              <div className="mt-2 flex items-center gap-2 border border-teal-500/40 rounded-xl px-4 py-3 focus-within:border-teal-500 transition">
                <Building2 className="text-teal-500" size={18} />
                <input
                  type="text"
                  placeholder="Enter company name"
                  className="bg-transparent w-full outline-none text-sm"
                />
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-base-300 my-6"></div>

          {/* Action */}
          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-teal-500
                         text-white font-medium shadow-lg
                         hover:scale-105 transition-all"
            >
              Create Interview
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ManualInterview;
