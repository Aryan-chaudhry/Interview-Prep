import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdWork, MdOutlineVideoCall } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { IoMdNotifications } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import Logo from "../assets/Logo.png";

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-zinc-950 border-r border-zinc-800 p-4 transition-all duration-300 z-50
        ${open ? "w-64" : "w-20"}`}
    >

      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <img
          src={Logo}
          alt="logo"
          width={open ? 90 : 60}
          className="animate-pulse"
        />
        {open && (
          <h1 className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-2xl font-semibold">
            CareerPilot
          </h1>
        )}
      </div>

      <hr className="border-zinc-700 mt-4" />

      {/* MENU */}
      <div className="mt-8 flex flex-col gap-2">

        {/* Home */}
        <NavLink
          to="/"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <GoHomeFill size={28} className="text-indigo-400" />
          {open && <p className="text-indigo-400 text-lg">Home</p>}
        </NavLink>

        {/* Interview */}
        <NavLink
          to="/interview"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <MdOutlineVideoCall size={28} className="text-indigo-400" />
          {open && <p className="text-indigo-400 text-lg">Interview</p>}
        </NavLink>

        {/* Jobs */}
        <NavLink
          to="/jobs"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <MdWork size={28} className="text-indigo-400" />
          {open && <p className="text-indigo-400 text-lg">Jobs</p>}
        </NavLink>

        {/* Notifications */}
        <NavLink
          to="/notifications"
          className="relative flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <IoMdNotifications size={28} className="text-indigo-400" />

          {/* Only show text when sidebar is open */}
          {open && <p className="text-indigo-400 text-lg">Notifications</p>}

          {/* Notification dot */}
          <span className="absolute right-3 top-4">
            <span className="relative flex h-3 w-3 mt-1">
              <span className=" animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
          </span>
        </NavLink>

        
        <NavLink
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <FiSettings
            size={28}
            className="text-indigo-400 animate-spin-slow"
          />
          {open && <p className="text-indigo-400 text-lg">Settings</p>}
        </NavLink>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-8 left-4 flex flex-col gap-3">
        {/* Login */}
        <NavLink
          to="/login"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <BiLogIn size={28} className="text-green-400" />
          {open && <p className="text-green-400 text-lg">Login</p>}
        </NavLink>

        {/* Logout */}
        <NavLink
          to="/logout"
          className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition"
        >
          <BiLogOut size={28} className="text-red-400" />
          {open && <p className="text-red-400 text-lg">Logout</p>}
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
