const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors()); // Allow all origins for CORS
app.use(express.json()); // Middleware to parse JSON requests

// Handle socket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('chat message', (msg) => {
    console.log('Message received: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Correct /chat/check route to return chat group IDs
app.get('/chat/check', (req, res) => {
  const chatGroups = ['group1', 'group2', 'group3']; // Example groups
  res.json({ chatGroupIDs: chatGroups });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
