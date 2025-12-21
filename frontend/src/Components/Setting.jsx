import { THEMES } from "./constants/index";
import { useThemeStore } from "../Store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Tell me about yourself.",
    isSent: false,
  },
  {
    id: 2,
    content:
      "I am a MERN Stack Developer with strong problem-solving skills and experience building scalable applications.",
    isSent: true,
  },
];

const Setting = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            Interview Preparation Settings
          </h2>
          <p className="text-sm text-base-content/70">
            Customize the theme for your AI interview experience
          </p>
        </div>

        {/* Theme Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">
          Interview Preview
        </h3>

        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Interview UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-primary-content font-medium">
                      AI
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">
                        AI Interviewer
                      </h3>
                      <p className="text-xs text-base-content/70">
                        Technical Interview • Live
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[80%] bg-teal-500 rounded-xl p-3 shadow-sm
                          ${
                            message.isSent
                              ? "bg-primary text-primary-content"
                              : "bg-base-200"
                          }
                        `}
                      >
                        <p className="text-sm text-white">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent
                                ? "text-white content/70"
                                : "text-white content/70"
                            }
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Preview */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type your interview answer..."
                      value="This is a preview response"
                      readOnly
                    />
                    <button className="btn bg-teal-500 h-10 min-h-0">
                      <Send className="text-white" size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {/* End Mock Interview UI */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
