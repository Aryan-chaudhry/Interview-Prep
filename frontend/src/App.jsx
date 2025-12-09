import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx';
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import ApplyJobs from './Components/Jobs.jsx';
import PostJob from './Components/PostJob.jsx';
import Interview from './Components/Interview/Interview.jsx';
import Complete from './Components/Complete.jsx';
import Profile from './Components/Profile.jsx';
import Join from './Components/Interview/Join.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';


function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  console.log({authUser});
  
  if(isCheckingAuth && !authUser) return (
    <div className='flex item-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )


  return (
    <div>
      <NavBar />

      <div>

        <Routes>
          
          <Route path="/login" element={ !authUser ? <Login /> : <Navigate to='/' />} />
          <Route path="/signup" element={ !authUser ? <Signup/> : <Navigate to='/' />} />

          
          <Route
            path="/"
            element={           
               authUser ? <Home /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/jobs/apply"
            element={
              authUser ?  <ApplyJobs /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/jobs/post"
            element={
              authUser ? <PostJob /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/interview"
            element={
              authUser ? <Interview /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/Complete/:token"
            element={
              authUser ? <Complete /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/Profile"
            element={
              authUser ? <Profile/> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/join"
            element={
              authUser ? <Join/> : <Navigate to='/login'/>
            }
          />
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
