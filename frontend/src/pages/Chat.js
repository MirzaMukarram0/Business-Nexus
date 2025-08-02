import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages } from '../services/api';
import io from 'socket.io-client';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import DashboardLayout from '../layouts/DashboardLayout';
import './Chat.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user] = useState({ id: localStorage.getItem('userId'), name: localStorage.getItem('userName') });
  const [otherUser] = useState({ id: userId, name: 'User' }); // Optionally fetch name
  const [online] = useState(true); // Mock online status
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join chat room
    socket.emit('joinRoom', { userId: user.id, otherUserId: userId });
    // Fetch messages
    getMessages(userId).then(res => {
      console.log('Fetched messages:', res.data);
      setMessages(res.data);
    });
    // Listen for new messages
    socket.on('receiveMessage', (msg) => {
      if ((msg.senderId === user.id && msg.receiverId === userId) || (msg.senderId === userId && msg.receiverId === user.id)) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => {
      socket.off('receiveMessage');
    };
  }, [userId, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('sendMessage', {
      senderId: user.id,
      receiverId: userId,
      message: input
    });
    setInput('');
  };

  return (
    <DashboardLayout>
      <div className="bnx-chat-root">
        <Card className="bnx-card-chat">
          <div className="bnx-chat-header">
            <Avatar src="/avatar.png" alt={otherUser.name} />
            <span className="bnx-chat-username">{otherUser.name}</span>
            <span className={`bnx-chat-status ${online ? 'online' : 'offline'}`}>{online ? 'Online' : 'Offline'}</span>
          </div>
          <div className="bnx-chat-messages">
            {messages.map((msg, idx) => {
              const isSentByMe = String(msg.senderId._id || msg.senderId) === String(user.id);
              return (
                <div key={idx} className={`bnx-chat-message ${isSentByMe ? 'sent' : 'received'}`}> 
                  <div className="bnx-chat-meta">
                    <Avatar src="/avatar.png" alt={isSentByMe ? user.name : otherUser.name} />
                    <span className="bnx-chat-sender">{isSentByMe ? 'You' : otherUser.name}</span>
                    <span className="bnx-chat-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="bnx-chat-bubble">{msg.message}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <form className="bnx-chat-input-row" onSubmit={handleSend}>
            <InputField
              className="bnx-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              autoFocus
            />
            <Button type="submit" className="bnx-btn-gradient bnx-btn-chat">Send</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Chat; 