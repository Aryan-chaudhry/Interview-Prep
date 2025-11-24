const express = require('express');
const dotenv = require('dotenv');
const {AccessToken} = require('livekit-server-sdk');
dotenv.config();

const TokenFunction = async (req, res) => {
    const {username, room} = req.query;

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {identity: username}
    );

    token.addGrant({
        room,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
    });

    const jwt = token.toJwt();
    res.json({ token: jwt, url: process.env.LIVEKIT_URL });
}

module.exports = TokenFunction