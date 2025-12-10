const User = require('../Models/userModel');
const cloudinary = require('cloudinary');


const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverid} = req.params;
        const senderId = process.env.INTERVIEW_AGENT;

        console.log("receiverid", receiverid);
        console.log(text, image);
        let imageUrl;

        if(image){
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // real time functionality goes here => socket.io to commuicate with ai in real time

        res.status(201).json({mesage:"ai will integrated to soon to communicate.."})
    } catch (error) {
        console.log("error in message controller", error.mesage);
        res.status(500).json({message:"Internal server error"}); 
    }
}

module.exports = sendMessage;