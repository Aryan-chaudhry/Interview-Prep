import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  MdWork,
  MdOutlineVideoCall,
  MdAddCircleOutline,
  MdPersonSearch,
} from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import Logo from "../assets/Logo.png";

const SideBar = () => {
  const [open, setOpen] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [openFooterSettings, setOpenFooterSettings] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Detect route changes

  // ✔ React to LOGIN instantly when route changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]);

  // ✔ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Hide sidebar on interview page
  if (location.pathname === "/interview") return null;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#0d0f12] border-r border-zinc-800 px-4 py-6 transition-all duration-300 shadow-xl z-80
        ${open ? "w-64" : "w-20"}`}
    >
      {/* LOGO + TOGGLE */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <img
          src={Logo}
          alt="logo"
          width={open ? 75 : 55}
          className="transition-all duration-300 group-hover:scale-105 animate-pulse"
        />

        {open && (
          <h1 className="text-xl font-semibold text-white tracking-wide">
            CareerPilot
          </h1>
        )}
      </div>

      <div className="mt-6 bg-zinc-800/50 h-[1px] w-full" />

      {/* MAIN MENU */}
      <div className="mt-6 flex flex-col gap-2">
        <SidebarItem
          to="/"
          icon={<GoHomeFill size={24} />}
          label="Home"
          open={open}
        />

        <SidebarItem
          to="/interview"
          icon={<MdOutlineVideoCall size={24} />}
          label="Interview"
          open={open}
        />

        {/* JOBS DROPDOWN */}
        <div className="w-full">
          <button
            onClick={() => setOpenJobs(!openJobs)}
            className="flex items-center w-full gap-3 p-3 rounded-lg hover:bg-zinc-800/60 transition"
          >
            <MdWork size={24} className="text-green-600" />

            {open && (
              <>
                <p className="text-white font-medium">Jobs</p>
                <FaAngleDown
                  className={`ml-auto text-white transition-transform duration-300 ${
                    openJobs ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {open && openJobs && (
            <div className="ml-10 mt-2 flex flex-col gap-2 animate-fadeIn">
              <DropdownItem
                to="/jobs/apply"
                icon={<MdPersonSearch size={20} />}
                label="Apply"
              />
              <DropdownItem
                to="/jobs/post"
                icon={<MdAddCircleOutline size={20} />}
                label="Post Job"
              />
            </div>
          )}
        </div>

        <SidebarItem
          to="/notifications"
          icon={<IoMdNotifications size={24} />}
          label="Notifications"
          open={open}
          hasPing
        />
      </div>

      {/* FOOTER SETTINGS */}
      <div className="absolute bottom-6 left-4 w-[85%]">
        <button
          onClick={() => setOpenFooterSettings(!openFooterSettings)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/60 transition w-full"
        >
          <FiSettings size={24} className="text-green-600" />

          {open && (
            <p className="text-white font-medium flex items-center gap-2">
              Setting
            </p>
          )}
        </button>

        {openFooterSettings && (
          <div className="ml-10 mt-2 flex flex-col gap-2 animate-fadeIn">
            {/* IF NOT LOGGED IN → SHOW LOGIN */}
            {!isLoggedIn && (
              <DropdownItem
                to="/login"
                icon={<BiLogIn size={20} />}
                label="Login"
              />
            )}

            {/* IF LOGGED IN → SHOW LOGOUT */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/60 transition w-full"
              >
                <span className="text-red-400">
                  <BiLogOut size={20} />
                </span>
                <p className="text-red-400">Logout</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* COMPONENTS */

const SidebarItem = ({ to, icon, label, open, hasPing }) => {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/60 transition relative"
    >
      <span className="text-green-600">{icon}</span>

      {open && <p className="text-white font-medium">{label}</p>}

      {hasPing && <></>}
    </NavLink>
  );
};

const DropdownItem = ({ to, icon, label, red }) => {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/60 transition"
    >
      <span className={`${red ? "text-red-400" : "text-green-600"}`}>
        {icon}
      </span>
      <p className={`${red ? "text-red-400" : "text-white"}`}>{label}</p>
    </NavLink>
  );
};

export default SideBar;
  