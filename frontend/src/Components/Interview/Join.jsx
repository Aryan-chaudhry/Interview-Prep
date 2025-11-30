// Join.jsx
import { useState } from "react";
import axios from "axios";

export default function Join({ onJoin, defaultRoom, defaultUsername }) { 
    const [name, setName] = useState(defaultUsername || ""); 

    const joinRoom = async () => {
        if (!name.trim()) {
            alert("Please enter your name/identity to join the call.");
            return;
        }
        
        try {
            const response = await axios.get("http://localhost:8080/api/getToken", {
                params: { 
                    username: name, 
                    room: defaultRoom 
                }
            });
            
            const { token, url } = response.data;

            // Defensive check for data types (ensures we get strings)
            if (typeof token !== 'string' || typeof url !== 'string') {
                // This console log is exactly what caught your error!
                console.error("Backend did not return string token/url:", response.data); 
                alert("Connection failed: Malformed token from server. Check backend code.");
                return;
            }

            // Call onJoin with the valid string token and URL
            onJoin({ token, url });
        } catch (error) {
            console.error("Error fetching token:", error);
            alert("Failed to connect. Check your LiveKit settings or backend server is running on port 8080.");
        }
    };

    return (
        <div className="bg-black/50 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-700">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to Join?</h2>
            <div className="mb-6 bg-zinc-900 p-3 rounded-lg border border-zinc-700">
                <p className="text-xs opacity-60">Meeting ID</p>
                <p className="text-sm font-mono text-yellow-300 truncate">{defaultRoom}</p>
            </div>
            <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 mb-6"
                placeholder="Enter Your Full Name/Identity" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
            />
            <button 
                onClick={joinRoom}
                className="w-full bg-green-500 text-black font-extrabold py-3 rounded-lg hover:bg-green-600 transition duration-200 text-lg"
            >
                Start Video Interview
            </button>
        </div>
    );
}