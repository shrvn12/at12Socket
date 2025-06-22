const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('join_session', (id) => socket.join(id));
  socket.on('playback_update', ({ sessionId, state }) => {
    socket.to(sessionId).emit('playback_update', state);
  });
  socket.on('control', ({ sessionId, action }) => {
    socket.to(sessionId).emit('control', action);
  });
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO server running at http://0.0.0.0:${PORT}`);
});
