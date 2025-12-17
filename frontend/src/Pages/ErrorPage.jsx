import React from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, RefreshCcw } from "lucide-react";

 function ErrorPage() {
  const navigate = useNavigate()  
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-950 to-zinc-900 px-6">
      <div className="w-full max-w-xl bg-white/5 border border-zinc-800 rounded-2xl p-10 shadow-xl text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <KeyRound className="text-amber-400" size={32} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white">
          Voice Service Unavailable
        </h2>

        {/* Message */}
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          Platform voice interview service is temporarily unavailable because the  credentials
          have been <i className="text-teal-500">expired</i>  or are  <i className="text-teal-500">invalid</i>. This is not an issue from our side.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Please refresh your credentials or try again later.
        </p>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium shadow"
          >
            <RefreshCcw size={16} />
            Retry
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 rounded-md border border-zinc-700 text-gray-300 hover:bg-white/5 text-sm"
          >
            Go Back
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-500">
          If the problem persists, please do contact support.
        </div>
      </div>
    </div>
  );
}

export default ErrorPage
