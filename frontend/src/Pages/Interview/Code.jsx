import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2, Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGES = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
];

const DEFAULT_CODE = {
  javascript: `function main() {
  
}

main();
`,

  typescript: `function main(): void {
  
}

main();
`,

  python: `def main():
    pass

if __name__ == "__main__":
    main()
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}
`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}
`,

  c: `#include <stdio.h>

int main() {
    
    return 0;
}
`,
};

const Code = ({ setLanguage, setCoding }) => {
  const [language, setLanguages] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const codeCacheRef = useRef({ ...DEFAULT_CODE });
  const timerRef = useRef(null);

  useEffect(() => {
    codeCacheRef.current = { ...DEFAULT_CODE };
    setLanguages("javascript");
    setCode(DEFAULT_CODE["javascript"]);
  }, []);

  useEffect(() => {
    setCode(codeCacheRef.current[language]);
    setSubmit(false); // reset submit when language changes
  }, [language]);

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    codeCacheRef.current[language] = newCode;
    setSubmit(false); // reset submit when code changes
  };

  const handleSubmit = () => {
    if (loading) return;

    setLoading(true);
    setSubmit(false);

    // simulate RUN for 2 seconds
    timerRef.current = setTimeout(() => {
      setLanguage(language);
      setCoding(code);

      toast.success("Code submitted to Interviewer");
      setSubmit(true);
      setLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    if (loading) return;

    const defaultCode = DEFAULT_CODE[language];
    setCode(defaultCode);
    codeCacheRef.current[language] = defaultCode;
    setSubmit(false);

    toast.success("Editor cleared");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="w-200 h-135 rounded-2xl shadow-2xl bg-[#0e0e0e] border border-[#1f1f1f] overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-[#1f1f1f]">
        <div className="flex items-center gap-3">
          <Code2 className="text-teal-500" size={18} />
          <span className="text-sm font-semibold text-gray-200">
            Code Editor
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguages(e.target.value)}
            className="bg-[#1a1a1a] text-gray-200 text-sm px-3 py-1.5 rounded-md border border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-60 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-md transition border border-[#2a2a2a]"
          >
            <Trash2 size={16} className="text-red-600"/>
            Clear
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-md transition"
          >
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : submit ? (
              "Submitted"
            ) : (
              <>
                <Play size={16} />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <Editor
        height="calc(100% - 56px)"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontLigatures: true,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
        }}
      />
    </div>
  );
};

export default Code;
