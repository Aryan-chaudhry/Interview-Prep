import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/SideBar.jsx';
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import ApplyJobs from './Components/Jobs.jsx';
import PostJob from './Components/PostJob.jsx';
import Interview from './Components/Interview/Interview.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

function App() {
  return (
    <div className='flex'>
      <Sidebar />

      <div className='flex-1'>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/apply"
            element={
              <ProtectedRoute>
                <ApplyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/post"
            element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
