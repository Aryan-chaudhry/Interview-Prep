    const UserModel = require('../Models/userModel');
    const bcrypt = require('bcrypt');
    const dotenv = require('dotenv');
    const generateToken = require('../utils/utils')
    const cloudinary = require("../lib/cloudinary");
    const userModel = require('../Models/userModel');
    dotenv.config();


    const Signup = async (req, res) => {
        // 1. Destructure the data using the keys sent from the frontend
        const { fullName, email, password } = req.body; 
        
        // Simple validation (though Mongoose will also validate)
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        try {
            // 2. Check if user already exists
            const existingUser = await UserModel.findOne({ email: email }); // Use the schema key 'email' for query
            if (existingUser) {
                return res.status(409).json({ message: 'Email address is already registered.' });
            }

            // 3. Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 4. Create and save new user
            const newUser = new UserModel({
                // MAPPING: Schema key: Frontend key
                name:fullName,             // 'name' in schema gets value from 'User'
                email,           // 'email' in schema gets value from 'Email'
                passwordHash: hashedPassword, // 'passwordHash' in schema gets the HASHED 'Password'
            });

            if(newUser){
                // generate jwt token
                generateToken(newUser._id, res)
                await newUser.save();
                res.status(201).json({
                    _id:newUser._id,
                    fullname:newUser.name,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                });
            }
            else{
                res.status(400).json({message:"Invalid user data"});
            }

        } catch (error) {
            console.log("error in signup controller", error.message);
            res.status(500).json({message:"Internal sever error"})
        }
    };


    const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "Invalid Credential" });
        }

        const ispasswordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (!ispasswordCorrect) {
            return res.status(404).json({ message: "Invalid Credential" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.name,
            email: user.email,
            profilePic: user.profilePic,
        });

        } catch (error) {
            console.log("Error in login controller", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };


    const Logout = async (req, res) => {
        try {
            res.cookie("jwt", "", {maxAge:0});
            res.status(200).json({message:"Logged out successfully"})
        } catch (error) {
            console.log("error in logout controller", error.message);
            res.status(500).json({message:"Internal Server Error"})
        }
    }

    const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Upload Base64 or image URL to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "user_profiles",
        });

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
        } catch (error) {
            console.log("Error in update profile", error);
            res.status(500).json({ message: "Internal Server error" });
        }
    };


    const checkAuth = (req, res) => {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            console.log('error in checkAuth controller', error.message);
            res.status(500).json({message:'Internal Serer Error'});
        }
    }


    module.exports = { Signup, Login, Logout, updateProfile, checkAuth };