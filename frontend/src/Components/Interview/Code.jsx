import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { IoPlay } from "react-icons/io5";
import { MdClear } from "react-icons/md";

const Code = () => {
  const [code, setCode] = useState("// Write your code here...\nconsole.log('Hello, World!');");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { name: "JavaScript", value: "javascript" },
    { name: "Python", value: "python" },
    { name: "Java", value: "java" },
    { name: "C++", value: "cpp" },
    { name: "C", value: "c" },
  ];

  const handleRunCode = async () => {
    setLoading(true);
    setError("");
    setOutput("Executing code on Judge0...");

    try {
      const response = await axios.post("http://localhost:8080/api/execute-code", {
        code,
        language,
      });

      if (response.data.success) {
        setOutput(response.data.output || "Code executed successfully!");
        setError("");
      } else {
        setError(response.data.error || "Execution failed");
        setOutput("");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to execute code";
      setError(errorMsg);
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  const handleClearOutput = () => {
    setOutput("");
    setError("");
  };

  const handleClearCode = () => {
    setCode("// Write your code here...");
    setOutput("");
    setError("");
  };

  return (
    <div className="w-full h-full bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-zinc-700 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Code Editor</h1>
        
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-800 text-white px-3 py-1 rounded text-sm border border-zinc-600 hover:border-zinc-500 cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Editor Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "Fira Code, Courier New, monospace",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10, bottom: 10 },
              wordWrap: "on",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-3 border-t border-zinc-700 bg-zinc-800">
          <button
            onClick={handleRunCode}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm font-semibold transition"
          >
            <IoPlay size={16} />
            {loading ? "Running..." : "Run Code"}
          </button>
          <button
            onClick={handleClearCode}
            className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded text-sm transition"
          >
            <MdClear size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="h-40 border-t border-zinc-700 flex flex-col bg-black overflow-hidden">
        <div className="p-3 border-b border-zinc-700 flex justify-between">
          <h2 className="text-sm font-semibold text-gray-400">Output</h2>
          {(output || error) && (
            <button
              onClick={handleClearOutput}
              className="text-xs text-gray-500 hover:text-gray-300"
            >
              Clear Output
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto p-3 font-mono text-sm">
          {error ? (
            <div className="text-red-400">
              <p className="font-semibold">Error:</p>
              <p className="whitespace-pre-wrap break-words">{error}</p>
            </div>
          ) : output ? (
            <pre className="text-green-400 whitespace-pre-wrap break-words">{output}</pre>
          ) : (
            <p className="text-gray-600">Output will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Code;
