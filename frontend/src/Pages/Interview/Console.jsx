import React, { useState } from "react";
import { Terminal } from "lucide-react";

const Console = ({ questions }) => {
  const problems = questions.filter(
    q => q.category === "problem-solving"
  );

  const [current, setCurrent] = useState(0);

  if (problems.length === 0) {
    return (
      <div className="w-200 h-135 rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f] flex items-center justify-center text-gray-500">
        No problem-solving questions available
      </div>
    );
  }

  const problem = problems[current];

  // 🔥 PARSING YOUR EXISTING QUESTION STRING
  const text = problem.question;

  const title =
    text.match(/Problem:\s*(.*?)(\.|$)/)?.[1] || "Problem";

  const description =
    text.split("Example:")[0]?.replace("Problem:", "").trim();

  const example =
    text.match(/Example:\s*([\s\S]*?)Constraints:/)?.[1]?.trim();

  const constraints =
    text.match(/Constraints:\s*([\s\S]*)/)?.[1]?.trim();

  return (
    <div className="w-200 h-135 rounded-2xl shadow-2xl bg-[#0e0e0e] border border-[#1f1f1f] overflow-hidden flex flex-col">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#121212] border-b border-[#1f1f1f]">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-green-500" />
          <span className="text-sm font-semibold text-gray-200">
            Problem {current + 1} / {problems.length}
          </span>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-teal-900 text-teal-300">
          Interview Problem
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 overflow-auto text-gray-200 text-sm leading-relaxed">

        {/* Title */}
        <h1 className="text-xl font-semibold text-white mb-4">
          {title}
        </h1>

        {/* Description */}
        <div className="mb-6 text-gray-300 whitespace-pre-wrap">
          {description}
        </div>

        {/* Example */}
        {example && (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4 mb-6">
            <h3 className="text-gray-200 font-semibold mb-2">Example</h3>
            <pre className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
{example}
            </pre>
          </div>
        )}

        {/* Constraints */}
        {constraints && (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-4">
            <h3 className="text-gray-200 font-semibold mb-2">Constraints</h3>
            <pre className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
{constraints}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-[#121212] border-t border-[#1f1f1f]">
        <button
          disabled={current === 0}
          onClick={() => setCurrent(prev => prev - 1)}
          className="px-4 py-1 text-sm rounded bg-[#1f1f1f] text-gray-300 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-xs text-gray-500">
          Score: {problem.score}
        </span>

        <button
          disabled={current === problems.length - 1}
          onClick={() => setCurrent(prev => prev + 1)}
          className="px-4 py-1 text-sm rounded bg-green-700 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Console;
