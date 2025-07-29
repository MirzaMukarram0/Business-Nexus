require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes (to be added later)
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');
const chatRoutes = require('./routes/chat');
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', requestRoutes);
app.use('/api/chat', chatRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io chat logic
io.on('connection', (socket) => {
  // Join a room for a pair of users
  socket.on('joinRoom', ({ userId, otherUserId }) => {
    const roomId = [userId, otherUserId].sort().join('_');
    socket.join(roomId);
  });

  // Handle sending a message
  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join('_');
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    io.to(roomId).emit('receiveMessage', {
      senderId,
      receiverId,
      message,
      timestamp: newMessage.timestamp
    });
  });
});
