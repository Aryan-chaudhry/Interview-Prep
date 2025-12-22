import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx';
import { useLocation } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Meet from './Pages/Interview/Meet.jsx';
import Complete from './Pages/Complete.jsx';
import Profile from './Components/Profile.jsx';

import { useAuthStore } from './Store/useAuthStore.js'
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './Store/useThemeStore.js';
import Setting from './Components/Setting.jsx';
import Interview from './Pages/Interview/Interview.jsx'
import PageNotFound from './Pages/PageNotFound.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import ManualInterview from './Pages/Home/ManualInterview.jsx';


function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();
  const location = useLocation();

  

  useEffect(() => {
    checkAuth();
  }, [checkAuth])


  
  if(isCheckingAuth && !authUser) return (
    <div className='flex item-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )


  return (
  <div data-theme={theme} className="bg-white text-teal-600">
      <NavBar />

      <div>

        <Routes>
          
          <Route path="/login" element={ !authUser ? <Login /> : <Navigate to='/' />} />
          <Route path="/signup" element={ !authUser ? <Signup/> : <Navigate to='/' />} />
          <Route path="/settings" element={<Setting/>} />

          
          <Route
            path="/"
            element={           
               authUser ? <Home /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/manual-interview"
            element={           
               authUser ? <ManualInterview /> : <Navigate to='/login'/>
            }
          />


          <Route
            path="/interview"
            element={           
               authUser ? <Interview /> : <Navigate to='/login'/> 
            }
          />

          <Route
            path='/activated'
            element={           
              <Meet/>
            }
          />

          <Route
            path="/Complete/:token"
            element={
              authUser ? <Complete /> : <Navigate to='/login'/>
            }
          />

          <Route
            path="/error/:id"
            element={
              // authUser ? <ErrorPage /> : <Navigate to='/login'/>
              <ErrorPage />
            }
          />

          <Route
            path={`profile/u/:userid`}
            element={
              authUser ? <Profile/> : <Navigate to='/login'/>
            }
          />

          <Route
            path="*"
            element={
              authUser ? <PageNotFound/> : <Navigate to='/login'/>
            }
          />

        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
