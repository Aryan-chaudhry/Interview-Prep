// RoomPage.jsx
import { useEffect, useState, useRef } from "react"; 
import { Room, RoomEvent, createLocalVideoTrack, createLocalAudioTrack, Track } from "livekit-client"; 
import { Mic, Video, PhoneOff, Settings, BookOpen, AlertCircle } from "lucide-react";

export default function RoomPage({ token, url, jobTitle, matchedSkills }) {
    // Use useRef to hold the Room object for stable cleanup access
    const roomRef = useRef(null); 
    
    const [room, setRoom] = useState(null); 
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [connectionError, setConnectionError] = useState(false); 

    useEffect(() => {
        if (roomRef.current || connectionError) return; 

        const joinRoom = async () => {
            const newRoom = new Room();
            roomRef.current = newRoom; 
            
            // Event listeners for remote tracks
            newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                const element = track.attach();
                element.className = 'w-full h-full object-cover rounded-xl'; 
                document.getElementById("remote-video").appendChild(element);
            });
            
            newRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
                track.detach().forEach(el => el.remove());
            });

            try {
                // 1. Connect to the room (using guaranteed string token and url)
                await newRoom.connect(url, token);
                
                // 2. Create and Publish Local Tracks
                
                // A. Local Audio (Microphone)
                const localAudio = await createLocalAudioTrack();
                await newRoom.localParticipant.publishTrack(localAudio);

                // B. Local Video (Camera)
                const localVideo = await createLocalVideoTrack();
                
                // Attach the video element to the DOM
                const localElement = localVideo.attach();
                localElement.className = 'w-full h-full object-cover rounded-xl'; 
                document.getElementById("local-video").appendChild(localElement);

                // Publish the video track so others can see it
                await newRoom.localParticipant.publishTrack(localVideo); 

                setRoom(newRoom); 
                setConnectionError(false);
            } catch(e) {
                console.error("Failed to connect or publish tracks to LiveKit room:", e);
                setConnectionError(true); 
                
                // Cleanup partial room connection
                if (roomRef.current) {
                    roomRef.current.disconnect();
                    roomRef.current = null; 
                }
            }
        };

        joinRoom();
        
        // Cleanup function for when the component unmounts
        return () => {
            // CRITICAL FIX: Use the stable ref for reliable disconnection
            if (roomRef.current) { 
                roomRef.current.localParticipant?.unpublishTracks(
                    roomRef.current.localParticipant.getTracks().map(p => p.track)
                );
                roomRef.current.disconnect();
                roomRef.current = null; 
            }
        };
    }, [token, url]); 


    // Toggle microphone state
    const toggleMic = () => {
        if (room && room.localParticipant) {
            const isEnabled = room.localParticipant.setMicrophoneEnabled(!isMicOn);
            setIsMicOn(isEnabled);
        }
    };
    
    // Toggle camera state (FIXED LOGIC)
    const toggleCamera = async () => {
        if (!room || !room.localParticipant) return;

        const trackPublication = room.localParticipant.getTrackPublication(Track.Source.Camera);
        const track = trackPublication?.track;

        if (isCameraOn) {
            // Turning OFF: Disable the track AND detach the DOM element
            if (track) {
                track.disable();
                // FIX: Remove DOM element to show placeholder text
                track.detach().forEach(el => el.remove()); 
            }
            setIsCameraOn(false);
        } else {
            // Turning ON: Re-enable/re-attach the existing track or create a new one
            if (track) {
                 // If track exists, re-enable it and attach
                 track.enable();
                 const localElement = track.attach();
                 localElement.className = 'w-full h-full object-cover rounded-xl';
                 document.getElementById("local-video").appendChild(localElement);
            } else {
                // If the track was fully unpublished or missing, create a new one
                try {
                    const newVideoTrack = await createLocalVideoTrack();
                    const localElement = newVideoTrack.attach();
                    localElement.className = 'w-full h-full object-cover rounded-xl';
                    document.getElementById("local-video").appendChild(localElement);
                    await room.localParticipant.publishTrack(newVideoTrack);
                } catch(e) {
                    console.error("Failed to re-enable camera:", e);
                    alert("Could not re-enable camera. Check system permissions.");
                    return;
                }
            }
            setIsCameraOn(true);
        }
    };
    
    // End Call function (Uses useRef for robust disconnection)
    const endCall = () => {
        if (roomRef.current) { 
            roomRef.current.disconnect();
            roomRef.current = null;
        }
        // Redirect back to the jobs page or home page
        window.location.href = '/'; 
    };

    // --- Error Screen Render ---
    if (connectionError) {
        return (
            <div className="flex flex-col h-screen bg-zinc-950 text-white items-center justify-center p-8">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h1 className="text-4xl font-bold mb-2">Device Access Failed</h1>
                <p className="text-xl text-red-400 mb-6">
                    Failed to access your **Camera** or **Microphone**.
                </p>
                <ul className="list-disc list-inside text-left space-y-2 bg-zinc-800 p-6 rounded-lg max-w-lg">
                    <li>**Check Browser Permissions:** Ensure your browser (e.g., Chrome, Firefox) is allowed to access your camera and microphone for this site.</li>
                    <li>**System Settings:** Verify that your operating system (Windows/macOS) permissions allow the browser to use the devices.</li>
                    <li>**Use HTTPS:** If not on `localhost`, ensure your site is served over **HTTPS** (required for device access).</li>
                </ul>
                <button 
                    onClick={() => setConnectionError(false) || window.location.reload()}
                    className="mt-8 px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    // --- Main Room Render ---
    return (
        <div className="flex flex-col h-screen bg-zinc-950">
            {/* Header: Context Bar */}
            <header className="bg-black/40 border-b border-zinc-800 p-3 flex justify-between items-center px-8">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white">{jobTitle} Interview</h1>
                    <p className="text-xs text-green-400">Status: Live | Room: {room?.name || 'Connecting...'}</p>
                </div>
                <div className="flex items-center gap-4 text-sm bg-zinc-800 p-2 rounded-lg">
                    <BookOpen size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{matchedSkills} Skills Matched</span>
                </div>
            </header>

            {/* Main Content: Video Grid and Sidebar */}
            <div className="flex flex-grow overflow-hidden p-4">
                <div className="flex-grow grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-1 h-full">
                    
                    <div id="remote-video" className="relative bg-zinc-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                        <h3 className="absolute top-2 left-3 text-xs bg-black/50 px-2 py-1 rounded">Remote User</h3>
                    </div>

                    <div id="local-video" className="relative bg-zinc-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                        <h3 className="absolute top-2 left-3 text-xs bg-black/50 px-2 py-1 rounded">Your Video</h3>
                        {/* Placeholder text if camera is off */}
                        {!isCameraOn && <p className="text-gray-400 text-lg">Camera is off</p>}
                    </div>
                </div>

                <div className="hidden lg:block w-72 ml-4 bg-zinc-800 p-4 rounded-xl shadow-inner overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-3 border-b border-zinc-700 pb-2">Interview Notes</h3>
                    <p className="text-sm opacity-70">
                        Focus on **{jobTitle}** core competencies.
                    </p>
                </div>
            </div>
            
            {/* Footer: Control Bar */}
            <footer className="bg-black/50 p-3 flex justify-center items-center border-t border-zinc-800">
                <div className="flex gap-4">
                    {/* Mic Toggle */}
                    <button 
                        onClick={toggleMic} 
                        className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-red-600 hover:bg-red-700'}`}
                        title={isMicOn ? "Mute" : "Unmute"}
                    >
                        <Mic size={20} className={isMicOn ? "text-white" : "text-black"}/>
                    </button>

                    {/* Camera Toggle */}
                    <button 
                        onClick={toggleCamera} 
                        className={`p-3 rounded-full transition-colors ${isCameraOn ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-red-600 hover:bg-red-700'}`}
                        title={isCameraOn ? "Turn off video" : "Turn on video"}
                    >
                        <Video size={20} className={isCameraOn ? "text-white" : "text-black"}/>
                    </button>

                    <button 
                        onClick={endCall} 
                        className="p-3 rounded-full bg-red-700 hover:bg-red-800 transition-colors"
                        title="End Call"
                    >
                        <PhoneOff size={20} className="text-white"/>
                    </button>
                    
                    <button 
                        className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors hidden sm:block"
                        title="Device Settings"
                    >
                        <Settings size={20} className="text-white"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}