import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { IoCallOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { CiDesktop } from "react-icons/ci";
import { VscVscode } from "react-icons/vsc";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";
import { GoPeople } from "react-icons/go";

import Chat from "./Chat";
import People from "./People"; 
import Join from "./Join";
import Code from "./Code";
import Console from "./Console";
import Reaction from "./Reaction";
import Webcam from "react-webcam";

import joinSoundFile from "../../assets/JoinCall.mp3";
import hangupSoundFile from "../../assets/Hangup.mp3";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
 
  const { 
    transcript, 
    listening, 
    browserSupportsSpeechRecognition, 
    resetTranscript 
  } = useSpeechRecognition();

  // State Management
  const [candidate, setCandidate] = useState([]);
  const [mute, setMute] = useState(true); // Default to muted on join
  const [cam, setCam] = useState(false); // Default to camera off on join
  const [handRaised, setHandRaised] = useState(false); 
  const [activePanel, setActivePanel] = useState('chat');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Component Mount Setup
  useEffect(() => {
    const candidateData = location?.state?.Candidatedata || [];
    setCandidate(candidateData);

    // Update time every second
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId); // Cleanup timer
  }, [location]);

  
  useEffect(() => {
    
    if (!mute) {
        SpeechRecognition.startListening({ continuous: true });
    } else {
        SpeechRecognition.stopListening();
    }
  }, [mute]); 

  
  const handleWebCam = () => {
    setCam((prev) => !prev);
  };

  const handleMic = () => {
    setMute((prev) => !prev);
  };

  const handleLeave = async () => {
    console.log("Leaving the call...");
    
    try {
        const response = await axios.get('http://localhost:8080/api/test-token');
        const tokenValue = response.data.token;
        navigate(`/Complete/${tokenValue}`, { state: { token: tokenValue } });  
    } catch (error) {
        console.error("Error fetching token:", error);
        navigate('/ErrorPage');
    }
  };
  

  const handleChat = () => setActivePanel(activePanel === 'chat' ? null : 'chat');
  const handlePeople = () => setActivePanel(activePanel === 'people' ? null : 'people');
  const handleRaise = () => setHandRaised((prev) => !prev); 
  const handleReact = () => setActivePanel(activePanel === 'react' ? null : 'react');
  const handleCode = () => setActivePanel(activePanel === 'code' ? null : 'code');
  const handleConsole = () => setActivePanel(activePanel === 'console' ? null : 'console');


  const VideoPlaceholder = ({ role, initial }) => (
    <div className="bg-zinc-800 w-full h-60 rounded-lg flex justify-center items-center pt-5">
      <div className="w-20 h-20 rounded-full bg-gray-400 flex justify-center items-center">
        <h1 className="text-4xl font-md text-gray-700">{initial}</h1>
      </div>
    </div>
  );

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-white p-10">Browser doesn't support speech recognition.</div>;
  }

  
  const controlBtnClasses = "flex flex-col items-center justify-center hover:cursor-pointer p-1 rounded-md transition-colors duration-150 hover:bg-zinc-800";


  return (
    <div className="min-h-screen bg-zinc-950">
      
      {/* Top Bar */}
      <div className="flex justify-between text-gray-400 px-10 py-1 border-b border-zinc-800">
        <div>
          <p className="text-lg font-semibold">Interview Meeting</p>
        </div>
        <div>Personal</div>
      </div>
      
      {/* Control Bar */}
      <div className="bg-zinc-900 w-full flex justify-between py-2 border-b border-zinc-800">
        <div className="flex items-center gap-4 pl-5">
          <div>
            <AiOutlineSecurityScan className="text-gray-400" size={25} />
          </div>
          {/* Dynamic Timestamp */}
          <p className="text-gray-400 text-sm">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center text-gray-400 gap-8 pr-5">
          
          {/* Chat Toggle */}
          <div onClick={handleChat} className={`${controlBtnClasses} ${activePanel === 'chat' ? 'text-indigo-500' : ''}`}>
            <IoChatbubbleEllipsesOutline size={25} />
            <p className="text-sm">Chat</p>
          </div>

          {/* People Toggle */}
          <div onClick={handlePeople} className={`${controlBtnClasses} ${activePanel === 'people' ? 'text-indigo-500' : ''}`}>
            <GoPeople size={25} />
            <p className="text-sm">People</p>
          </div>

          {/* Hand Raise Toggle */}
          <div onClick={handleRaise} className={`${controlBtnClasses} ${handRaised ? 'text-yellow-500' : ''}`}>
            <HiOutlineHandRaised size={25} />
            <p className="text-sm">Hand</p>
          </div>
          
          <p className="text-4xl text-zinc-700">|</p>

          {/* Code Editor Toggle */}
          <div onClick={handleCode} className={`${controlBtnClasses} ${activePanel === 'code' ? 'text-blue-400' : ''}`}>
            <VscVscode size={25} />
            <p className="text-sm">Code</p>
          </div>

          {/* Console Toggle */}
          <div onClick={handleConsole} className={`${controlBtnClasses} ${activePanel === 'console' ? 'text-green-400' : ''}`}>
            <CiDesktop size={25} />
            <p className="text-sm">Console</p>
          </div>
          
          {/* Reaction Toggle */}
          <div onClick={handleReact} className={`${controlBtnClasses} ${activePanel === 'react' ? 'text-yellow-500' : ''}`}>
            <BsEmojiSmile size={25} />
            <p className="text-sm">React</p>
          </div>
          
          <p className="text-4xl text-zinc-700">|</p>

          {/* Mic Toggle */}
          <div onClick={handleMic} className={controlBtnClasses}>
            {mute ? (
              <FaMicrophoneSlash size={25} />
            ) : (
              // Show listening indicator
              <FaMicrophone className={`text-red-400 ${listening ? 'animate-pulse' : ''}`} size={25} />
            )}
            <p className="text-sm">Mic</p>
          </div>

          {/* Camera Toggle */}
          <div onClick={handleWebCam} className={controlBtnClasses}>
            {cam ? (
              <FaVideo className="text-red-400" size={25} />
            ) : (
              <FaVideoSlash size={25} />
            )}
            <p className="text-sm">Camera</p>
          </div>

          <p className="text-4xl text-zinc-700">|</p>

          {/* Leave Button */}
          <div onClick={handleLeave} className={`${controlBtnClasses} text-red-400 hover:text-red-500`}>
            <IoCallOutline size={25} />
            <p className="text-sm">Leave</p>
          </div>
        </div>
      </div>

      {/* Main Layout: Video Feeds and Side Panel */}
      <div className="flex justify-between item-center"> 
        {/* Video Feeds (Left Column) */}
        <div className="flex flex-col gap-10 p-5 pl-10 flex-1 max-w-lg ">
            {/* Agent Video */}
            <div className="flex-1 min-h-0">
                <VideoPlaceholder role="Agent" initial="A" />
                <p className="text-white text-center mt-1">Agent</p>
            </div>

            {/* Your Video (Self-View) - Premium Feature: Webcam Stream */}
            <div className="flex-1 min-h-0">
                <div className="bg-zinc-800 w-full h-60 rounded-lg overflow-hidden">
                    {cam ? (
                        <Webcam 
                            audio={!mute} // Use mute state for audio
                            ref={webcamRef} 
                            mirrored={true} 
                            videoConstraints={{ facingMode: "user" }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <VideoPlaceholder role="You" initial="Y" />
                    )}
                </div>
                <p className="text-white text-center mt-1">You</p>
            </div>
        </div>

        {/* Side Panel (Right Column) */}
        {activePanel && (
            <div className="w-150 bg-zinc-900 border-l border-zinc-700 flex flex-col overflow-hidden transition-all duration-300 ">
              {activePanel === 'chat' && <Chat />}
              {activePanel === 'people' && <People candidate={candidate} />}
              {activePanel === 'join' && <Join />}
              {activePanel === 'code' && <Code />} 
              {activePanel === 'console' && <Console/>}
              {activePanel === 'react' && <Reaction/>} 
            </div>
        )}
      </div>

      
      {/* <div className="bg-zinc-800 text-gray-300 py-2 px-5 fixed bottom-0 left-0 right-0 border-t border-zinc-700">
        <p className="font-bold text-sm flex items-center gap-2">
          Real-Time Transcript
          {listening && (
            <span className="text-red-400 animate-pulse flex items-center gap-1">
              <FaMicrophone size={14} /> (Listening...)
            </span>
          )}
        </p>
        <div className="text-sm text-white min-h-[20px]"> 
          {transcript}
        </div>
      </div> */}
      
    </div>
  );
};

export default Interview;