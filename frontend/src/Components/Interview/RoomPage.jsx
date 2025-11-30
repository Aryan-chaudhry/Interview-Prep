// // RoomPage.jsx
// import { useEffect, useState, useRef } from "react"; 
// import { Room, RoomEvent, createLocalVideoTrack, createLocalAudioTrack, Track } from "livekit-client"; 
// import { Mic, Video, PhoneOff, Settings, BookOpen, AlertCircle } from "lucide-react";
// import { useNavigate} from 'react-router-dom'
// import axios from 'axios'

// export default function RoomPage({ token, url, jobTitle, matchedSkills }) {
//     // Use useRef to hold the Room object for stable cleanup access
//     const roomRef = useRef(null); 
//     const navigate = useNavigate();
//     const [room, setRoom] = useState(null); 
//     const [isMicOn, setIsMicOn] = useState(true);
//     const [isCameraOn, setIsCameraOn] = useState(true);
//     const [connectionError, setConnectionError] = useState(false); 
//     // AI interviewer state (browser TTS fallback)
//     const [aiQuestions] = useState([
//         "Tell me about a challenging bug you fixed recently.",
//         "Walk me through your approach to optimizing performance in a React app.",
//         "Describe a project where you used asynchronous programming effectively.",
//         "How do you approach testing and ensuring code quality?",
//         "Explain a system design decision you made and why."
//     ]);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [isAutoAsking, setIsAutoAsking] = useState(false);
//     const [lastSpoken, setLastSpoken] = useState('');

//     useEffect(() => {
//         if (roomRef.current || connectionError) return; 

//         const joinRoom = async () => {
//             const newRoom = new Room();
//             roomRef.current = newRoom; 
            
//             // Event listeners for remote tracks
//             newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
//                 const element = track.attach();
//                 element.className = 'w-full h-full object-cover rounded-xl'; 
//                 document.getElementById("remote-video").appendChild(element);
//             });
            
//             newRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
//                 track.detach().forEach(el => el.remove());
//             });

//             try {
//                 // 1. Connect to the room (using guaranteed string token and url)
//                 await newRoom.connect(url, token);
                
//                 // 2. Create and Publish Local Tracks
                
//                 // A. Local Audio (Microphone)
//                 const localAudio = await createLocalAudioTrack();
//                 await newRoom.localParticipant.publishTrack(localAudio);

//                 // B. Local Video (Camera)
//                 const localVideo = await createLocalVideoTrack();
                
//                 // Attach the video element to the DOM
//                 const localElement = localVideo.attach();
//                 localElement.className = 'w-full h-full object-cover rounded-xl'; 
//                 document.getElementById("local-video").appendChild(localElement);

//                 // Publish the video track so others can see it
//                 await newRoom.localParticipant.publishTrack(localVideo); 

//                 setRoom(newRoom); 
//                 setConnectionError(false);
//                 // Start the AI interviewer automatically (browser TTS)
//                 startAIInterview();
//             } catch(e) {
//                 console.error("Failed to connect or publish tracks to LiveKit room:", e);
//                 setConnectionError(true); 
                
//                 // Cleanup partial room connection
//                 if (roomRef.current) {
//                     roomRef.current.disconnect();
//                     roomRef.current = null; 
//                 }
//             }
//         };

//         joinRoom();
        
//         // Cleanup function for when the component unmounts
//         return () => {
//             // CRITICAL FIX: Use the stable ref for reliable disconnection
//             if (roomRef.current) { 
//                 roomRef.current.localParticipant?.unpublishTracks(
//                     roomRef.current.localParticipant.getTracks().map(p => p.track)
//                 );
//                 roomRef.current.disconnect();
//                 roomRef.current = null; 
//             }
//         };
//     }, [token, url]); 


//     // Toggle microphone state
//     const toggleMic = () => {
//         if (room && room.localParticipant) {
//             const isEnabled = room.localParticipant.setMicrophoneEnabled(!isMicOn);
//             setIsMicOn(isEnabled);
//         }
//     };
    
//     // Toggle camera state (FIXED LOGIC)
//     const toggleCamera = async () => {
//         if (!room || !room.localParticipant) return;

//         const trackPublication = room.localParticipant.getTrackPublication(Track.Source.Camera);
//         const track = trackPublication?.track;

//         if (isCameraOn) {
//             // Turning OFF: Disable the track AND detach the DOM element
//             if (track) {
//                 track.disable();
//                 // FIX: Remove DOM element to show placeholder text
//                 track.detach().forEach(el => el.remove()); 
//             }
//             setIsCameraOn(false);
//         } else {
//             // Turning ON: Re-enable/re-attach the existing track or create a new one
//             if (track) {
//                  // If track exists, re-enable it and attach
//                  track.enable();
//                  const localElement = track.attach();
//                  localElement.className = 'w-full h-full object-cover rounded-xl';
//                  document.getElementById("local-video").appendChild(localElement);
//             } else {
//                 // If the track was fully unpublished or missing, create a new one
//                 try {
//                     const newVideoTrack = await createLocalVideoTrack();
//                     const localElement = newVideoTrack.attach();
//                     localElement.className = 'w-full h-full object-cover rounded-xl';
//                     document.getElementById("local-video").appendChild(localElement);
//                     await room.localParticipant.publishTrack(newVideoTrack);
//                 } catch(e) {
//                     console.error("Failed to re-enable camera:", e);
//                     alert("Could not re-enable camera. Check system permissions.");
//                     return;
//                 }
//             }
//             setIsCameraOn(true);
//         }
//     };
    
//     // End Call function (Uses useRef for robust disconnection)
//     const endCall = async () => {
//         if (roomRef.current) {
//             roomRef.current.disconnect();
//             roomRef.current = null;
//         }

//         try {
//             const { data } = await axios.get("http://localhost:8080/api/test-token");
//             const generatedToken = data.token;

//             navigate(`/complete/${generatedToken}`, { 
//                 state: { token: generatedToken } 
//             });
//         } catch (err) {
//             console.error(err);
//             alert("Could not complete interview.");
//         }
//     };

//     // --- AI Interviewer (Browser TTS) ---
//     const speakText = (text) => {
//         if (typeof window === 'undefined' || !window.speechSynthesis) return;
//         try {
//             const utterance = new SpeechSynthesisUtterance(text);
//             // Prefer a clear, neutral voice if available
//             const voices = window.speechSynthesis.getVoices();
//             const preferred = voices.find(v => /english|en-US|Google US/gi.test(v.name)) || voices[0];
//             if (preferred) utterance.voice = preferred;
//             utterance.rate = 1;
//             utterance.pitch = 1;
//             window.speechSynthesis.cancel();
//             window.speechSynthesis.speak(utterance);
//             setLastSpoken(text);
//         } catch (err) {
//             console.error('TTS failed:', err);
//         }
//     };

//     const askNextQuestion = () => {
//         const next = (currentQuestionIndex + 1) % aiQuestions.length;
//         setCurrentQuestionIndex(next);
//         const q = aiQuestions[next];
//         speakText(q);
//     };

//     const startAIInterview = () => {
//         if (aiQuestions.length === 0) return;
//         setIsAutoAsking(true);
//         const q = aiQuestions[currentQuestionIndex];
//         // speak immediately
//         speakText(q);
//         // then schedule a question every ~45s while auto-asking is enabled
//         const interval = setInterval(() => {
//             if (!isAutoAsking) {
//                 clearInterval(interval);
//                 return;
//             }
//             setCurrentQuestionIndex(i => {
//                 const next = (i + 1) % aiQuestions.length;
//                 speakText(aiQuestions[next]);
//                 return next;
//             });
//         }, 45000);
//         // store interval on ref for cleanup
//         aiIntervalRef.current = interval;
//     };

//     const stopAIInterview = () => {
//         setIsAutoAsking(false);
//         if (aiIntervalRef.current) {
//             clearInterval(aiIntervalRef.current);
//             aiIntervalRef.current = null;
//         }
//         window.speechSynthesis?.cancel();
//     };

//     const aiIntervalRef = useRef(null);
//     // Gemini (server) state
//     const [isSpeaking, setIsSpeaking] = useState(false);
//     const [recorderState, setRecorderState] = useState('idle'); // 'idle' | 'recording' | 'processing'
//     const mediaRecorderRef = useRef(null);
//     const recordedChunksRef = useRef([]);

//     // Play base64 MP3 audio and show speaking indicator
//     const playBase64Audio = async (base64) => {
//         try {
//             setIsSpeaking(true);
//             const binary = atob(base64);
//             const len = binary.length;
//             const bytes = new Uint8Array(len);
//             for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
//             const blob = new Blob([bytes], { type: 'audio/mpeg' });
//             const urlObj = URL.createObjectURL(blob);
//             const audio = new Audio(urlObj);
//             audio.onended = () => {
//                 setIsSpeaking(false);
//                 URL.revokeObjectURL(urlObj);
//             };
//             await audio.play();
//         } catch (err) {
//             console.error('Failed to play audio', err);
//             setIsSpeaking(false);
//         }
//     };

//     // Ask Gemini (server) for a question/response and play its TTS
//     const askGemini = async (prompt) => {
//         try {
//             const { data } = await axios.post('http://localhost:8080/api/gemini/ask', { prompt });
//             if (data?.audio) {
//                 await playBase64Audio(data.audio);
//             } else if (data?.text) {
//                 // fallback to browser TTS if server TTS missing
//                 speakText(data.text);
//             }
//             return data;
//         } catch (err) {
//             console.error('askGemini error', err);
//             return null;
//         }
//     };

//     // Recording user's answer and sending to ASR endpoint
//     const startRecording = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             recordedChunksRef.current = [];
//             const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
//             mediaRecorderRef.current = mr;
//             mr.ondataavailable = (e) => { if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data); };
//             mr.onstop = async () => {
//                 setRecorderState('processing');
//                 const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
//                 const form = new FormData();
//                 form.append('file', blob, 'answer.webm');
//                 try {
//                     const resp = await axios.post('http://localhost:8080/api/gemini/asr', form, { headers: { 'Content-Type': 'multipart/form-data' } });
//                     const transcript = resp.data?.transcript || '';
//                     // Send transcript back to Gemini to generate the next follow-up
//                     const follow = await askGemini(`Candidate answer: ${transcript}. Ask a follow-up question.`);
//                     setRecorderState('idle');
//                     return { transcript, follow };
//                 } catch (err) {
//                     console.error('ASR upload failed', err);
//                     setRecorderState('idle');
//                 }
//             };
//             mr.start();
//             setRecorderState('recording');
//         } catch (err) {
//             console.error('startRecording failed', err);
//             alert('Could not start recording. Check microphone permissions.');
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
//             mediaRecorderRef.current.stop();
//             mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
//         }
//     };


//     // --- Error Screen Render ---
//     if (connectionError) {
//         return (
//             <div className="flex flex-col h-screen bg-white text-gray-900 items-center justify-center p-8">
//                 <AlertCircle size={64} className="text-red-600 mb-4" />
//                 <h1 className="text-4xl font-bold mb-2">Device Access Failed</h1>
//                 <p className="text-xl text-red-600 mb-6">
//                     Failed to access your camera or microphone.
//                 </p>
//                 <ul className="list-disc list-inside text-left space-y-2 bg-gray-50 p-6 rounded-lg max-w-lg">
//                     <li>Check browser permissions: allow camera and microphone for this site.</li>
//                     <li>System settings: verify OS-level permissions allow the browser to use devices.</li>
//                     <li>Use HTTPS if not on `localhost` (required for device access in many browsers).</li>
//                 </ul>
//                 <button 
//                     onClick={() => setConnectionError(false) || window.location.reload()}
//                     className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
//                 >
//                     Retry Connection
//                 </button>
//             </div>
//         );
//     }

//     // --- Main Room Render ---
//     return (
//         <div className="flex flex-col h-screen bg-white">
//             {/* Header: Context Bar */}
//             <header className="bg-white border-b border-gray-200 p-3 flex justify-between items-center px-6 md:px-8">
//                 <div className="flex flex-col">
//                     <h1 className="text-xl font-bold text-gray-900">{jobTitle} Interview</h1>
//                     <p className="text-xs text-gray-500">Status: Live | Room: {room?.name || 'Connecting...'}</p>
//                 </div>
//                 <div className="flex items-center gap-4 text-sm bg-gray-100 p-2 rounded-lg">
//                     <BookOpen size={16} className="text-gray-700" />
//                     <span className="text-gray-700 font-semibold">{matchedSkills} Skills Matched</span>
//                 </div>
//             </header>

//             {/* Main Content: Video Grid and Sidebar */}
//             <div className="flex flex-grow overflow-hidden p-4 md:p-6">
//                 <div className="flex-grow grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-1 h-full">
                    
//                     <div id="remote-video" className="relative bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
//                         <h3 className="absolute top-2 left-3 text-xs bg-white/80 px-2 py-1 rounded text-gray-600">Remote User</h3>
//                     </div>

//                     <div id="local-video" className="relative bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
//                         <h3 className="absolute top-2 left-3 text-xs bg-white/80 px-2 py-1 rounded text-gray-600">Your Video</h3>
//                         {/* Placeholder text if camera is off */}
//                         {!isCameraOn && <p className="text-gray-500 text-lg">Camera is off</p>}
//                     </div>
//                 </div>

//                 <div className="hidden lg:block w-80 ml-4 bg-gray-50 p-4 rounded-xl shadow-inner overflow-y-auto">
//                     <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-2">AI Interviewer</h3>
//                     <p className="text-sm text-gray-700 mb-3">Last question:</p>
//                     <div className="bg-white p-3 rounded border border-gray-100 mb-3 min-h-[60px]">
//                         <p className="text-sm text-gray-800">{lastSpoken || 'No question asked yet.'}</p>
//                     </div>

//                     <div className="flex flex-col gap-2 mb-3">
//                         <div className="flex gap-2">
//                             <button onClick={() => askGemini()} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ask Gemini</button>
//                             <button onClick={() => askGemini('Please start with an interview question for the candidate.')} className="px-3 py-2 bg-gray-100 rounded border border-gray-200">Start Gemini</button>
//                         </div>

//                         <div className="flex gap-2">
//                             {recorderState !== 'recording' ? (
//                                 <button onClick={startRecording} className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Record Answer</button>
//                             ) : (
//                                 <button onClick={stopRecording} className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">Stop Recording</button>
//                             )}
//                             <button onClick={() => { isAutoAsking ? stopAIInterview() : startAIInterview(); }} className="px-3 py-2 bg-gray-100 rounded border border-gray-200">
//                                 {isAutoAsking ? 'Stop Auto' : 'Start Auto'}
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-2 mt-2">
//                         <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                         <p className="text-xs text-gray-500">{isSpeaking ? 'Gemini is speaking...' : recorderState === 'recording' ? 'Recording...' : 'Idle'}</p>
//                     </div>

//                     <h4 className="text-sm font-semibold mt-4 mb-2">Notes</h4>
//                     <p className="text-sm text-gray-600">Focus on <strong className="text-gray-800">{jobTitle}</strong> core competencies.</p>
//                 </div>
//             </div>
            
//             {/* Footer: Control Bar */}
//             <footer className="bg-white p-3 flex justify-center items-center border-t border-gray-200">
//                 <div className="flex gap-4">
//                     {/* Mic Toggle */}
//                     <button 
//                         onClick={toggleMic} 
//                         className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-500 hover:bg-red-600'}`}
//                         title={isMicOn ? "Mute" : "Unmute"}
//                     >
//                         <Mic size={20} className={isMicOn ? "text-gray-800" : "text-white"}/>
//                     </button>

//                     {/* Camera Toggle */}
//                     <button 
//                         onClick={toggleCamera} 
//                         className={`p-3 rounded-full transition-colors ${isCameraOn ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-500 hover:bg-red-600'}`}
//                         title={isCameraOn ? "Turn off video" : "Turn on video"}
//                     >
//                         <Video size={20} className={isCameraOn ? "text-gray-800" : "text-white"}/>
//                     </button>

//                     <button 
//                         onClick={endCall} 
//                         className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
//                         title="End Call"
//                     >
//                         <PhoneOff size={20} className="text-white"/>
//                     </button>
                    
//                     <button 
//                         className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors hidden sm:block"
//                         title="Device Settings"
//                     >
//                         <Settings size={20} className="text-gray-800"/>
//                     </button>
//                 </div>
//             </footer>
//         </div>
//     );
// }

import React from 'react'

const RoomPage = () => {
  return (
    <div>
      
    </div>
  )
}

export default RoomPage
