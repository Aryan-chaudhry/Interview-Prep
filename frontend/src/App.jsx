import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/SideBar.jsx';
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Jobs from './Components/Jobs.jsx';

function App() {
  return (
    <div className='flex'>
      <Sidebar />

      <div className='flex-1'>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/Home" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
