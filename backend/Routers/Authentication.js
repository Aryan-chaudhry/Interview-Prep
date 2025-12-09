const express = require('express');
const { Signup, Login, Logout, updateProfile, checkAuth } = require('../Controllers/Authentication');
const protectRoute = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/logout', Logout)

router.put('/update-profile', protectRoute ,updateProfile);

router.get('/check', protectRoute, checkAuth);
module.exports = router;    