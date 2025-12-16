import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../Store/useAuthStore';
import {
  ShieldUser,
  Users,
  Code,
  Phone,
  Mic,
  MicOff,
  Video,
  VideoOff,
  SquareChevronRight,
} from 'lucide-react';
import User from './User';
import VsCode from './Code';
import Console from './Console';

const Meet = () => {

  const { authUser } = useAuthStore();
  const userId = authUser?._id;

  const streamRef = useRef(null);
  const videoStreamRef = useRef(null);
  const videoRef = useRef(null);
  const apiTriggger = useRef(false);

  const [questions, setQuestion] = useState([]);
  const [mic, setMicOff] = useState(true); // off by default
  const [videoOff, setVideoOff] = useState(true); // off by default
  const [myconsole, setConsole] = useState(false);
  const [mycode, setCode] = useState(true);
  const [people, setPeople] = useState(false);
  const [language, setLanguage] = useState('');
  const [coding, setCoding] = useState('');

  const getQuestion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/interview-question/${userId}`
      );
      setQuestion(response.data.Questions);
      console.log(response.data.Questions)
      toast.success('please enable full screen mode by press f11');
    } catch (error) {
      toast.error('Server Error');
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    if (apiTriggger.current) return;

    apiTriggger.current = true;
    getQuestion();
  }, [userId]);

  const toggleMic = async () => {
    setMicOff(prev => {
      if (prev === true) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            streamRef.current = stream;
          });
      } else {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return !prev;
    });
  };

  const toogleCamera = async () => {
    setVideoOff(prev => {
      if (prev === true) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            videoStreamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          });
      } else {
        videoStreamRef.current?.getTracks().forEach(track => track.stop());
        videoStreamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      return !prev;
    });
  };

  const handleConsole = () => {
    setConsole(prev => !prev);
  };

  const handleIDE = () => {
    setCode(prev => !prev);
  };

  const handlePeople = () => {
    setPeople(prev => !prev);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 pt-20">

      <div className="flex justify-between px-5 shadow-md py-2">
        <div>
          <ShieldUser size={30} className="mx-4" />
          <p>protected</p>
        </div>

        <div className="flex justify-evenly gap-10">
          <div className="cursor-pointer" onClick={handlePeople}>
            <Users size={25} className="mx-3" />
            <p>people</p>
          </div>

          <div className="cursor-pointer" onClick={handleIDE}>
            <Code size={25} className="mx-1" />
            <p>code</p>
          </div>

          <div className="cursor-pointer" onClick={handleConsole}>
            <SquareChevronRight size={25} className="mx-3" />
            <p>console</p>
          </div>

          <p className="text-3xl">|</p>

          {mic ? (
            <div className="text-gray-400 cursor-pointer" onClick={toggleMic}>
              <MicOff size={25} />
              <p>off</p>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={toggleMic}>
              <Mic size={25} className="text-red-600 animate-pulse" />
              <p className="text-gray-400 mx-1">on</p>
            </div>
          )}

          {videoOff ? (
            <div className="text-gray-400 cursor-pointer" onClick={toogleCamera}>
              <VideoOff size={25} />
              <p>off</p>
            </div>
          ) : (
            <div className="cursor-pointer" onClick={toogleCamera}>
              <Video size={25} className="text-red-600 animate-pulse" />
              <p className="text-gray-400">on</p>
            </div>
          )}

          <div className="cursor-pointer">
            <Phone size={25} className="text-red-600" />
            <p className="text-gray-400">leave</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-10 py-10">
        <div className="w-[40%]">

          <div className="bg-zinc-800 w-90 h-60 rounded-md">
            <div className="flex justify-center items-center">
              <span className="bg-gray-400 w-50 h-50 rounded-full my-5 flex justify-center items-center">
                <h1 className="text-8xl text-black py-12">I</h1>
              </span>
            </div>
            <p className="text-center">Interviewer</p>
          </div>

          <div className="bg-zinc-800 w-90 h-60 rounded-md my-18">
            {!videoOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <span className="bg-gray-400 w-50 h-50 rounded-full flex justify-center items-center">
                  <h1 className="text-8xl text-black">Y</h1>
                </span>
              </div>
            )}
            <p className="text-center mt-2">You</p>
          </div>

        </div>

        {myconsole && <Console questions={questions} />}
        {mycode && <VsCode setLanguage={setLanguage} setCoding={setCoding} />}
        {people && <User mic={mic} video={videoOff} />}

      </div>
    </div>
  );
};

export default Meet;
