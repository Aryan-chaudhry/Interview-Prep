// import { useEffect, useState } from "react";
// import { Room, RoomEvent, createLocalVideoTrack } from "livekit-client";

// export default function RoomPage({ token, url }) {
//   const [room, setRoom] = useState(null);
//   const [videoTrack, setVideoTrack] = useState(null);

//   useEffect(() => {
//     const joinRoom = async () => {
//       const room = new Room();
//       await room.connect(url, token);

//       room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
//         const element = track.attach();
//         document.getElementById("remote-video").appendChild(element);
//       });

//       const localVideo = await createLocalVideoTrack();
//       setVideoTrack(localVideo);
//       document.getElementById("local-video").appendChild(localVideo.attach());

//       setRoom(room);
//     };

//     joinRoom();
//   }, []);

//   return (
//     <div>
//       <h2>LiveKit Video Room</h2>

//       <div>
//         <h3>Your Video</h3>
//         <div id="local-video"></div>
//       </div>

//       <div>
//         <h3>Remote Users</h3>
//         <div id="remote-video"></div>
//       </div>
//     </div>
//   );
// }
