import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Code2 } from "lucide-react";

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

const Code = ({ question, onSubmitAnswer }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);

  // 🔒 store code per language (NO UI CHANGE)
  const codeCacheRef = useRef({ ...DEFAULT_CODE });

  // reset editor only when question changes
  useEffect(() => {
    codeCacheRef.current = { ...DEFAULT_CODE };
    setLanguage("javascript");
    setCode(DEFAULT_CODE["javascript"]);
  }, [question]);

  // switch language without losing code
  useEffect(() => {
    setCode(codeCacheRef.current[language]);
  }, [language]);

  if (!question)
    return (
      <div className="p-6 text-center text-gray-400">
        Open a problem to start coding
      </div>
    );

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    codeCacheRef.current[language] = newCode;
  };

  const handleSubmit = () => {
    onSubmitAnswer?.({
      type: "code",
      language,
      code: codeCacheRef.current[language],
    });
  };

  return (
    <div className="w-200 h-120 rounded-2xl shadow-2xl bg-[#0e0e0e] border border-[#1f1f1f] overflow-hidden">
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
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#1a1a1a] text-gray-200 text-sm px-3 py-1.5 rounded-md border border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-1.5 rounded-md transition"
          >
            <Play size={16} />
            Submit Code
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
