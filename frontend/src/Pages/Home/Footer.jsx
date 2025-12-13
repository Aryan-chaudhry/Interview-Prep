import React from 'react'
import { useThemeStore } from '../../Store/useThemeStore'

const Footer = () => {
  const { theme } = useThemeStore();
  const darkThemes = ['dark', 'black', 'night', 'dracula', 'nord', 'dim'];
  const isDark = darkThemes.includes(theme);

    return (
    <footer
      className={`
         border-t-2
        ${isDark
          ? 'bg-slate-900 border-teal-800 text-teal-200'
          : 'bg-white border-teal-100 text-teal-800'}
      `}
    >
      <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
        
        {/* Top Section */}
        <div className="md:flex md:justify-between">
          
          {/* Brand */}
          <div className="mb-6 md:mb-0">
            <div className="text-lg font-semibold text-teal-700 dark:text-teal-200">
              Interview Prep
            </div>
            <p className="mt-2 max-w-xs text-sm text-teal-600 dark:text-teal-300">
              Helping you prepare with real job data and interview-ready insights.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-teal-700 dark:text-teal-200">
                Company
              </h2>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">About</a></li>
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-teal-700 dark:text-teal-200">
                Resources
              </h2>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">Jobs</a></li>
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">Interview Prep</a></li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-teal-700 dark:text-teal-200">
                Legal
              </h2>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:underline text-teal-600 dark:text-teal-300">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className={`my-4 ${isDark ? 'border-teal-700' : 'border-teal-100'}`} />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-sm text-teal-700 dark:text-teal-300">
            © {new Date().getFullYear()} <span className="font-medium">Interview Prep</span>. All rights reserved.
          </span>

          {/* Social Icons (optional, premium look) */}
          <div className="flex gap-5">
            {['GitHub', 'LinkedIn', 'Twitter'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm hover:underline opacity-90 hover:opacity-100 text-teal-600 dark:text-teal-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
