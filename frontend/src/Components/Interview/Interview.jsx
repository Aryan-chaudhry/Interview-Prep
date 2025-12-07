import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa6";
import { FaMicrophoneSlash } from "react-icons/fa";
import { IoCallOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { CiDesktop } from "react-icons/ci";
import { VscVscode } from "react-icons/vsc";
import { HiOutlineHandRaised } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from './Chat';
import People from './People';
import Join from './Join';
import Code from './Code';
import Console from "./Console";
import Reaction from './Reaction';
import joinSoundFile from '../../assets/JoinCall.mp3';
import hangupSoundFile from '../../assets/Hangup.mp3';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [candidate, setCandidate] = useState(null);

  const [mute, setMute] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [youSpeaking, setYouSpeaking] = useState(false);
  const [activePanel, setActivePanel] = useState('chat');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [handRaised, setHandRaised] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    setCandidate(location?.state?.Candidatedata);
  }, [location]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Agent joins after 0-30 seconds randomly
  useEffect(() => {
    const randomDelay = Math.random() * 30000; // 0-30 seconds in milliseconds
    const timer = setTimeout(() => {
      setAgentJoined(true);
      setMeetingStartTime(new Date()); // Start timer when agent joins
        // Play join sound from bundled src/assets
        setTimeout(() => {
          const joinSound = new Audio(joinSoundFile);
          joinSound.volume = 1; // Full volume (0-1 scale)
          joinSound.muted = false; // Ensure not muted
          joinSound.play()
            .then(() => console.log('✓ Join sound playing (from src/assets)'))
            .catch(err => console.error('✗ Join sound error (from src/assets):', err));
        }, 100);
    }, randomDelay);
    return () => clearTimeout(timer);
  }, []);

  // Detect if YOU are speaking
  useEffect(() => {
    if (listening && transcript.trim() !== "") {
      setYouSpeaking(true);
    } else {
      setYouSpeaking(false);
    }
  }, [listening, transcript]);

  if (!candidate) {
    return (
      <div className="min-h-screen text-zinc-950 flex justify-center items-center pt-[50px]">
        <h1 className="text-5xl text-green-500">No interview Schedule</h1>
      </div>
    );
  }

  // ------------------ FIXED MIC FUNCTION ------------------
  const handleMic = async () => {
    const micState = !mute;
    setMute(micState);

    if (!micState) {
      resetTranscript();
      await SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
      return;
    }

    await SpeechRecognition.stopListening();

    if (!transcript.trim()) return;

    try {
      const response = await axios.get("http://localhost:8080/api/communicate", {
        params: { message: transcript, ...candidate }
      });

      const { audio } = response.data;

      resetTranscript();
      setAiSpeaking(true);

      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const player = new Audio(audioUrl);

      player.onended = () => setAiSpeaking(false);
      player.play();
    } catch (err) {
      console.log("AI communication error:", err);
    }
  };

  const hour = currentTime.getHours();
  const mins = currentTime.getMinutes();
  const secs = currentTime.getSeconds();

  // Calculate elapsed time since meeting started
  const elapsedTime = meetingStartTime ? Math.floor((currentTime - meetingStartTime) / 1000) : 0;
  const elapsedHours = Math.floor(elapsedTime / 3600);
  const elapsedMins = Math.floor((elapsedTime % 3600) / 60);
  const elapsedSecs = elapsedTime % 60;

  // Show elapsed time after agent joins, otherwise show current time
  const displayHour = agentJoined ? elapsedHours : hour;
  const displayMins = agentJoined ? elapsedMins : mins;
  const displaySecs = agentJoined ? elapsedSecs : secs;

  const handleChat = () => setActivePanel(activePanel === 'chat' ? null : 'chat');
  const handlePeople = () => setActivePanel(activePanel === 'people' ? null : 'people');
  const handleRaise = () => setHandRaised(!handRaised);
  const handleReact = () => setActivePanel(activePanel === 'react' ? null : 'react');
  const handleCode = () => setActivePanel(activePanel === 'code' ? null : 'code');
  const handleConsole = () => setActivePanel(activePanel === 'console' ? null : 'console');
  
  const handleLeave = async () => {
    // Play hangup sound
      // Play hangup sound from bundled src/assets with better handling
      const hangupSound = new Audio(hangupSoundFile);
      hangupSound.volume = 1; // Full volume (0-1 scale)
      hangupSound.muted = false; // Ensure not muted
      hangupSound.play()
        .then(() => console.log('✓ Hangup sound playing (from src/assets)'))
        .catch(err => console.error('✗ Hangup sound error (from src/assets):', err));

    try {
      // Get token from backend
      const response = await axios.get('http://localhost:8080/api/get-test-token');
      const { token } = response.data;
      
      // Redirect to complete page with token
      setTimeout(() => {
        navigate(`/complete/:${token}`, { state: { token, candidateData: candidate } });
      }, 500); // Wait for sound to play
    } catch (err) {
      console.log('Error getting token:', err);
      // Redirect anyway even if token fetch fails
      setTimeout(() => {
        navigate('/complete', { state: { candidateData: candidate } });
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950">

      {/* TOP BAR */}
      <div className="flex justify-between text-gray-400 px-10">
        <h1>Interview Prep Meeting</h1>
        <div className="flex justify-center gap-3">
          <h1>Personal</h1>
        </div>
      </div>

      {/* MENU BAR */}
      <div className="pt-2 px-2">
        <div className="bg-zinc-900 w-full p-2 flex justify-between rounded-md border-b-2 border-gray-500">

          <div className="flex justufy-evenly gap-3 pt-2">
            <AiOutlineSecurityScan className="text-gray-400" size={25} />
            <h1 className="text-gray-400">{String(displayHour).padStart(2, '0')}:{String(displayMins).padStart(2, '0')}:{String(displaySecs).padStart(2, '0')}</h1>
          </div>

          <div className="flex justify-evenly gap-10 text-gray-400">

            <div className={`hover:text-white hover:cursor-pointer px-2 ${activePanel === 'chat' ? 'border-b-2 border-indigo-500' : ''}`} onClick={handleChat}>
              <IoChatbubbleEllipsesOutline size={25} />
              <p className=" text-[10px]">Chat</p>
            </div>

            <div className={`hover:text-white hover:cursor-pointer px-2 ${activePanel === 'people' ? 'border-b-2 border-indigo-500' : ''}`} onClick={handlePeople}>
              <GoPeople size={25} />
              <p className=" text-[10px]">People</p>
            </div>

            <div className={`hover:text-white hover:cursor-pointer px-2 ${handRaised ? 'border-b-2 border-yellow-500' : ''}`} onClick={handleRaise}>
              <HiOutlineHandRaised size={25} className={handRaised ? 'text-yellow-500' : ''} />
              <p className=" text-[10px]">Raise</p>
            </div>

            <div className={`hover:text-white hover:cursor-pointer px-2 ${activePanel === 'react' ? 'border-b-2 border-indigo-500' : ''}`} onClick={handleReact}>
              <BsEmojiSmile size={25} />
              <p className=" text-[10px]">React</p>
            </div>

            <div><p className=" text-2xl">|</p></div>

            <div className={`hover:text-white hover:cursor-pointer px-2 ${activePanel === 'code' ? 'border-b-2 border-indigo-500' : ''}`} onClick={handleCode}>
              <VscVscode className="text-blue-400" size={25} />
              <p className=" text-[10px]">Code</p>
            </div>

            <div className={`hover:text-white hover:cursor-pointer px-2 ${activePanel === 'console' ? 'border-b-2 border-indigo-500' : ''}`} onClick={handleConsole}>
              <CiDesktop size={25} />
              <p className="text-[10px]">Console</p>
            </div>

            <div><p className=" text-2xl">|</p></div>

            {/* ----- MIC BUTTON ----- */}
            <div className="hover:text-white hover:cursor-pointer px-2" onClick={handleMic}>
              {mute ? (
                <FaMicrophoneSlash size={25} className="text-red-400" />
              ) : (
                <FaMicrophone size={25} className="text-gray-400 pt-1" />
              )}
              <p className=" text-[10px]">Mic</p>
            </div>

            <div className={`hover:text-white hover:cursor-pointer px-2`} onClick={handleLeave}>
              <IoCallOutline className="text-red-400 hover:text-red-500" size={25} />
              <p className=" text-[10px]">Leave</p>
            </div>

          </div>
        </div>

        {/* PEOPLE SECTION */}
        <div className="flex gap-0 pt-0 px-0 h-[calc(100vh-130px)] w-full">
          
          {/* LEFT MAIN AREA - ALWAYS VISIBLE */}
          <div className="flex-1 flex flex-col items-center justify-center bg-black">

            {/* Waiting for Agent - Show before agent joins */}
            {!agentJoined && (
              <div className="mb-20 text-center">
                <div className="flex justify-center text-gray-400 gap-2 mb-6">
                  <div className="w-3 h-3  text-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 text-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 text-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-gray-400 text-lg font-semibold animate-pulse">Waiting for Agent...</p>
              </div>
            )}

            {/* Agent - Shows after 1-2 mins with animation */}
            {agentJoined && (
              <div className="mt-auto mb-10 pt-10 animate-fade-in">
                <div className="bg-zinc-900 rounded-md w-100 h-60 flex justify-center items-center mt-10">
                  <span className={`bg-gray-100 rounded-full w-32 h-32 flex justify-center items-center relative 
                    ${aiSpeaking ? "animate-ping-custom border-4 border-green-500" : ""}`}>
                    <h1 className="text-8xl text-gray-400">A</h1>
                  </span>
                </div>
                <p className="text-white text-center mt-2 text-sm">Agent</p>
              </div>
            )}

            {/* You - Always visible */}
            <div className="mt-auto mb-10">
              <div className="bg-zinc-900 rounded-md w-100 h-60 flex justify-center items-center">
                <span className={`bg-gray-100 rounded-full w-32 h-32 flex justify-center items-center relative
                  ${youSpeaking ? "animate-ping-custom border-2 border-pink-500" : ""}`}>
                  <h1 className="text-8xl text-gray-400">Y</h1>
                </span>
              </div>
              <p className="text-white text-center mt-2 text-sm">You</p>
            </div>

          </div>

          {/* RIGHT PANEL - RENDER ACTIVE COMPONENT */}
          <div className="w-150 h-full bg-zinc-900 border-l border-zinc-700 flex flex-col overflow-hidden">
            {activePanel === 'chat' && <Chat />}
            {activePanel === 'people' && <People agentJoined={agentJoined} />}
            {activePanel === 'join' && <Join />}
            {activePanel === 'code' && <Code className="w-200"/>}
            {activePanel === 'console' && <Console/>}
            {activePanel === 'react' && <Reaction/>}           
          </div>

        </div>

      </div>

      {/* TRANSCRIPT */}
      <div className="px-10">
        <h1 className="text-4xl text-white">{transcript}</h1>
      </div>

    </div>
  );
};

export default Interview;
