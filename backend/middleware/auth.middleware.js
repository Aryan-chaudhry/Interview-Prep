const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // FIXED USER MODEL CALL
        const user = await User.findById(decoded.userId).select("-passwordHash");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in Protecting middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = protectRoute;
