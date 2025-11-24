// import { useState } from "react";
// import axios from "axios";

// export default function Join({ onJoin }) {
//   const [name, setName] = useState("");

//   const joinRoom = async () => {
//     const response = await axios.get("http://localhost:8080/api/getToken", {
//       params: { username: name, room: "myroom" }
//     });
//     onJoin(response.data);
//   };

//   return (
//     <div>
//       <h2>Join Video Room</h2>
//       <input 
//         placeholder="Enter your name" 
//         onChange={(e) => setName(e.target.value)} 
//       />
//       <button onClick={joinRoom}>Join</button>
//     </div>
//   );
// }
