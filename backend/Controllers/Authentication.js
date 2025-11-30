    const UserModel = require('../Models/userModel');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken'); 
    const dotenv = require('dotenv');
    dotenv.config();

    const JWT_SECRET = process.env.JWT_SECRET;

    const Signup = async (req, res) => {
        // 1. Destructure the data using the keys sent from the frontend
        const { User, Email, Password } = req.body; 
        
        // Simple validation (though Mongoose will also validate)
        if (!User || !Email || !Password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        try {
            // 2. Check if user already exists
            const existingUser = await UserModel.findOne({ email: Email }); // Use the schema key 'email' for query
            if (existingUser) {
                return res.status(409).json({ message: 'Email address is already registered.' });
            }

            // 3. Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);

            // 4. Create and save new user
            const newUser = new UserModel({
                // MAPPING: Schema key: Frontend key
                name: User,             // 'name' in schema gets value from 'User'
                email: Email,           // 'email' in schema gets value from 'Email'
                passwordHash: hashedPassword, // 'passwordHash' in schema gets the HASHED 'Password'
            });

            await newUser.save(); // Line 32 from your error trace now saves successfully

            // 5. Send a success response
            return res.status(201).json({ 
                message: 'User registered successfully!',
                userId: newUser._id 
            });

        } catch (error) {
            // Handle Mongoose validation errors (like unique email failure)
            if (error.code === 11000) {
                return res.status(409).json({ message: 'Email address is already registered.' });
            }
            
            console.error("Signup failed:", error);
            return res.status(500).json({ 
                message: 'Server error during signup. Check server logs for details.',
            });
        }
    };


    const Login = async (req, res) => {
        const { Email, Password } = req.body; 
        
        if (!Email || !Password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            const user = await UserModel.findOne({ email: Email }); 

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' }); 
            }

            const isMatch = await bcrypt.compare(Password, user.passwordHash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // 4. Login Successful: GENERATE JWT with 5-day expiry
            const token = jwt.sign(
                { id: user._id, email: user.email }, // Payload
                JWT_SECRET, // Secret key
                { expiresIn: '5d' } // ⬅️ TOKEN EXPIRES AFTER 5 DAYS
            );
            
            return res.status(200).json({ 
                message: 'Login successful!',
                token: token, // SEND THE TOKEN TO THE CLIENT
                name: user.name
            });

        } catch (error) {
            console.error("Login failed:", error);
            return res.status(500).json({ 
                message: 'Server error during login.',
            });
        }
    };


    module.exports = { Signup, Login };