const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://your-vercel-app-name.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// --- STATE ---
let users = {}; 
let drawingHistory = []; // Active lines
let redoStack = [];      // Undone lines (waiting to be Redone)

io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  // 1. Join
  socket.on('join', ({ name }) => {
    users[socket.id] = { id: socket.id, name };
    // Send current history to new user
    socket.emit('restore_history', drawingHistory);
    io.emit('user_list', users);
  });

  // 2. Draw Stroke (Commit)
  socket.on('draw_stroke', (stroke) => {
    drawingHistory.push(stroke);
    // IMPORTANT: If you draw something new, you can't Redo anymore
    redoStack = []; 
    // Broadcast just this stroke to others (efficient)
    socket.broadcast.emit('stroke_commited', stroke);
  });

  // 3. Live Drawing
  socket.on('drawing_live', (data) => {
    socket.broadcast.emit('drawing_live', data);
  });

  // 4. Undo
  socket.on('undo', () => {
    if (drawingHistory.length > 0) {
      const lastStroke = drawingHistory.pop();
      redoStack.push(lastStroke);
      // Send the WHOLE new history to everyone to ensure sync
      io.emit('canvas_state', drawingHistory);
    }
  });

  // 5. Redo (NEW)
  socket.on('redo', () => {
    if (redoStack.length > 0) {
      const strokeToRestore = redoStack.pop();
      drawingHistory.push(strokeToRestore);
      // Send the WHOLE new history to everyone
      io.emit('canvas_state', drawingHistory);
    }
  });

  // 6. Clear
  socket.on('clear', () => {
    drawingHistory = [];
    redoStack = [];
    io.emit('canvas_state', []);
  });

  // 7. Cursors & Chat
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

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});