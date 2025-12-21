import React from "react";
import { useThemeStore } from "../../Store/useThemeStore";

const Footer = () => {
  const { theme } = useThemeStore();
  const darkThemes = ["dark", "black", "night", "dracula", "nord", "dim"];
  const isDark = darkThemes.includes(theme);

  return (
    <footer
      className={`
        border-t
        ${
          isDark
            ? "bg-gradient-to-r from-[#0f1318] via-[#12171d] to-[#0f1318] text-teal-200 border-teal-900"
            : "bg-white text-teal-700 border-teal-100"
        }
      `}
    >
      <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
        {/* Top Section */}
        <div className="md:flex md:justify-between">
          {/* Brand */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold tracking-wide">
              Interview Prep
            </h2>
            <p className="mt-2 max-w-xs text-sm opacity-90">
              Helping you prepare with real job data and interview-ready insights.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Company
              </h2>
              <ul className="space-y-3 text-sm opacity-90">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Resources
              </h2>
              <ul className="space-y-3 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Jobs</a></li>
                <li><a href="#" className="hover:underline">Interview Prep</a></li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Legal
              </h2>
              <ul className="space-y-3 text-sm opacity-90">
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr
          className={`my-6 ${
            isDark ? "border-teal-900/50" : "border-teal-100"
          }`}
        />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-sm opacity-90">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium">Interview Prep</span>. All rights reserved.
          </span>

          {/* Social Links */}
          <div className="flex gap-6 text-sm">
            <a
              href="https://github.com/Aryan-chaudhry"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/aryan05/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              LinkedIn
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
