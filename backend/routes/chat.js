const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

// Get all messages between logged-in user and userId
router.get('/:userId', auth, chatController.getMessages);

module.exports = router; 