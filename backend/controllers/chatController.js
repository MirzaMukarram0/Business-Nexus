const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/chat/:userId - get all messages between logged-in user and userId
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'name')
      .populate('receiverId', 'name');
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 