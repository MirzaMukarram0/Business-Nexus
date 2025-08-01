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

// GET /api/chat/conversations - get all conversations for the logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
      .sort({ timestamp: -1 })
      .populate('senderId', 'name')
      .populate('receiverId', 'name');
    
    // Group messages by conversation partner
    const conversations = {};
    messages.forEach(msg => {
      const partnerId = msg.senderId._id.toString() === userId ? 
        msg.receiverId._id.toString() : msg.senderId._id.toString();
      const partnerName = msg.senderId._id.toString() === userId ? 
        msg.receiverId.name : msg.senderId.name;
      
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partnerId,
          partnerName,
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: 0 // Could be implemented later
        };
      }
    });
    
    const conversationList = Object.values(conversations);
    res.json(conversationList);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 