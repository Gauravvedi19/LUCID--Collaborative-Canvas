const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// [1] DEFINITION: We name it 'httpServer'
const httpServer = http.createServer(app);

// [2] USAGE: We pass 'httpServer' to Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://lucid-collaborative-canvas.vercel.app" // No trailing slash!
    ],
    methods: ["GET", "POST"]
  }
});

// --- STATE ---
let users = {};
let drawingHistory = [];
let redoStack = [];

io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  socket.on('join', ({ name }) => {
    users[socket.id] = { id: socket.id, name };
    socket.emit('restore_history', drawingHistory);
    io.emit('user_list', users);
  });

  socket.on('draw_stroke', (stroke) => {
    drawingHistory.push(stroke);
    redoStack = [];
    socket.broadcast.emit('stroke_commited', stroke);
  });

  socket.on('drawing_live', (data) => {
    socket.broadcast.emit('drawing_live', data);
  });

  socket.on('undo', () => {
    if (drawingHistory.length > 0) {
      const lastStroke = drawingHistory.pop();
      redoStack.push(lastStroke);
      io.emit('canvas_state', drawingHistory);
    }
  });

  socket.on('redo', () => {
    if (redoStack.length > 0) {
      const strokeToRestore = redoStack.pop();
      drawingHistory.push(strokeToRestore);
      io.emit('canvas_state', drawingHistory);
    }
  });

  socket.on('clear', () => {
    drawingHistory = [];
    redoStack = [];
    io.emit('canvas_state', []);
  });

  socket.on('cursor_move', (data) => {
    socket.broadcast.emit('cursor_update', { ...users, [socket.id]: data });
  });

  socket.on('chat_message', (msg) => {
    socket.broadcast.emit('chat_message', { ...msg, id: socket.id });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user_list', users);
  });
});

// Use the Render PORT or 3001 locally
const PORT = process.env.PORT || 3001;

// [3] LISTEN: We tell 'httpServer' to start (NOT 'server')
httpServer.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});