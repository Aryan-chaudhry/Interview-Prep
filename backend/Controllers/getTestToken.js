const crypto = require("crypto");

const generateToken = async (req, res) => {
    const token = crypto.randomBytes(16).toString("hex");
    res.json({ token });
}

module.exports = generateToken;
