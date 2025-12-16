import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../Store/useAuthStore';
import Join from './join';
import PageNotFound from '../PageNotFound';
import Meet from './Meet';
import { Navigate } from 'react-router-dom';


const Interview = () => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  const [joinInterview, setInterview] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasRequestedRef = useRef(false);
  const [request, sendRequest] = useState(false);

  const userId = authUser?._id;

  const job = location.state?.job;
  const Resume = location.state?.resumeContent;
  const isPremium = location.state?.isAPremium;

  if (!job) {
    return <PageNotFound />;
  }

  const payload = {
    User: userId,
    Job: job,
    Resume,
    isPremium,
  };

  const InterviewQuestion = async () => {
    try {
      setLoading(true);
      toast.loading('Generating interview questions...', { id: 'ai-gen' });

      await axios.post(
        'http://localhost:8080/api/setup-interview',
        payload
      );

      toast.success('Interview ready', { id: 'ai-gen' });

      setTimeout(()=>{
        sendRequest(true);
      }, 5000);
      
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          'Failed to generate interview questions',
        { id: 'ai-gen' }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!joinInterview) return;
    if (hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    InterviewQuestion();
  }, [joinInterview]);


  return (
    <div>
      {!joinInterview ? (
        <Join job={job} setInterview={setInterview} />
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          {/* <div className="rounded-md shadow-md w-[90%] h-150 mt-20 flex items-center justify-center"> */}
            { request === true && <Navigate to="/activated"/>}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default Interview;
