import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export const createToken = () => {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_SECRET,
    {
      identity: "user-" + Date.now(),
      ttl: "1h",
    }
  );

  at.addGrant({ roomJoin: true, room: "interview-room" });

  return at.toJwt();
};
