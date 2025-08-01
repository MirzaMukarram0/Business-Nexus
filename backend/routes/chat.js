const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

// Get all conversations for the logged-in user
router.get('/conversations', auth, chatController.getConversations);

// Get all messages between logged-in user and userId
router.get('/:userId', auth, chatController.getMessages);

module.exports = router; 