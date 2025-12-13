import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { LogOut, LogIn, Settings, User, Briefcase, MessageSquare } from "lucide-react";
import { useThemeStore } from "../Store/useThemeStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [profilePanel, setProfilePanel] = useState(false);
  const { theme } = useThemeStore();
  const darkThemes = ['dark', 'black', 'night', 'dracula', 'nord', 'dim'];
  const isDark = darkThemes.includes(theme);

  const handleProfile = () => {
    setProfilePanel(!profilePanel);
  };

  return (
    <header
      className="border-b border-teal-100 fixed w-full top-0 z-40 backdrop-blur-lg bg-white/90"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="h-9 w-9 rounded-lg bg-teal-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600" />
              </div>
              <h1 className="text-lg font-bold text-teal-700">Interview Prep</h1>
            </Link>
          </div>

          {/* Profile section */}
          <div className="relative">
            <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={handleProfile}>
              <img
                className="rounded-full w-10 h-10 object-cover"
                src={authUser ? authUser.profilePic : "Avatar"}
                alt="Profilepic"
              />

              <div className={`${isDark ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-teal-50 text-teal-700 hover:bg-teal-100'} font-medium rounded-md px-3 py-1.5 shadow-sm transition`}>
                Profile
              </div>
            </div>

            {/* Dropdown Panel */}
              {profilePanel && (
              <div
                className={`absolute right--1 mt-3 w-40 rounded-xl shadow-xl px-2 py-2 animate-fadeIn z-50 ${isDark ? 'bg-base-200 border border-slate-800' : 'bg-white border border-teal-100'}`}>

                  <Link to="/profile" onClick={() => setProfilePanel(false)} className={`flex items-center gap-2 p-2 rounded-md transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-teal-50'}`}>
                    <User className={`w-4 h-4 ${isDark ? 'text-white' : 'text-teal-600'}`} />
                    Profile
                  </Link>

                <Link to="/settings" onClick={() => setProfilePanel(false)} className={`flex items-center gap-2 p-2 rounded-md transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-teal-50'}`}>
                  <Settings className={`w-4 h-4 ${isDark ? 'text-white' : 'text-teal-600'}`} />
                  Settings
                </Link>

                {authUser && (
                  <button onClick={logout} className={`w-full flex items-center gap-2 p-2 rounded-md transition ${isDark ? '' : ''}`}>
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
