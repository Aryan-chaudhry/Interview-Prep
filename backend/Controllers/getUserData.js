const userModel = require('../Models/userModel');

const getUserData = async (req, res) => {
    const email = req.params.token;
    console.log(email);
}

module.exports = getUserData;