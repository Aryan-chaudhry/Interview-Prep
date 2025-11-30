const dotenv = require('dotenv');
const { AccessToken } = require('livekit-server-sdk'); 
dotenv.config();

const TokenFunction = async (req, res) => {
    try {
        const { username, room } = req.query;

        if (!username || !room) {
            return res.status(400).json({ error: "Missing username or room name." });
        }

        // Create Token
        const token = new AccessToken(
            process.env.LIVEKIT_API_KEY,
            process.env.LIVEKIT_API_SECRET,
            { identity: username }
        );

        token.addGrant({
            room,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
        });

        // FIX ❗❗ => toJwt() MUST be awaited!
        const jwt = await token.toJwt();

        // Validate before sending
        if (typeof jwt !== "string") {
            return res.status(500).json({ error: "JWT generation failed" });
        }

        res.json({
            token: jwt,
            url: process.env.LIVEKIT_URL
        });

    } catch (err) {
        console.error("Token generation failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = TokenFunction;
