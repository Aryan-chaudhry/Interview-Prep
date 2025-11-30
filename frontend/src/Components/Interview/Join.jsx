// // Join.jsx
// import { useState } from "react";
// import axios from "axios";

// export default function Join({ onJoin, defaultRoom, defaultUsername }) { 
//     const [name, setName] = useState(defaultUsername || ""); 

//     const joinRoom = async () => {
//         if (!name.trim()) {
//             alert("Please enter your name/identity to join the call.");
//             return;
//         }
        
//         try {
//             const response = await axios.get("http://localhost:8080/api/getToken", {
//                 params: { 
//                     username: name, 
//                     room: defaultRoom 
//                 }
//             });
            
//             const { token, url } = response.data;

//             // Defensive check for data types (ensures we get strings)
//             if (typeof token !== 'string' || typeof url !== 'string') {
//                 // This console log is exactly what caught your error!
//                 console.error("Backend did not return string token/url:", response.data); 
//                 alert("Connection failed: Malformed token from server. Check backend code.");
//                 return;
//             }

//             // Call onJoin with the valid string token and URL
//             onJoin({ token, url });
//         } catch (error) {
//             console.error("Error fetching token:", error);
//             alert("Failed to connect. Check your LiveKit settings or backend server is running on port 8080.");
//         }
//     };

//     return (
//         <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm border border-gray-200">
//             <h2 className="text-2xl font-bold mb-4 text-gray-900">Ready to Join?</h2>
//             <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                 <p className="text-xs text-gray-500">Meeting ID</p>
//                 <p className="text-sm font-mono text-gray-700 truncate">{defaultRoom}</p>
//             </div>
//             <input 
//                 type="text"
//                 className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-6"
//                 placeholder="Enter Your Full Name/Identity" 
//                 value={name}
//                 onChange={(e) => setName(e.target.value)} 
//             />
//             <button 
//                 onClick={joinRoom}
//                 className="w-full bg-blue-600 text-white font-md py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
//             >
//                 Join Interview
//             </button>
//         </div>
//     );
// }

import React from 'react'

const Join = () => {
  return (
    <div>
      
    </div>
  )
}

export default Join
