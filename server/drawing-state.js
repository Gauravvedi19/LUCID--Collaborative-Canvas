// server/drawing-state.js

// This class manages the state of the canvas for a specific room
class RoomState {
  constructor() {
    this.history = [];      // Array of all strokes: [{ id, points, color, width, userId }]
    this.redoStack = [];    // For global redo (optional, but good for bonus)
    this.users = new Map(); // Track active users: { userId: { color, name, x, y } }
  }

  addStroke(stroke) {
    // When a user finishes drawing, we add it to history
    this.history.push(stroke);
    // If a new action happens, the "redo" future is invalid
    this.redoStack = []; 
    return this.history;
  }

  undo() {
    if (this.history.length === 0) return null;
    
    // Remove the very last action (Global Undo)
    const lastStroke = this.history.pop();
    this.redoStack.push(lastStroke);
    
    return this.history;
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    
    const stroke = this.redoStack.pop();
    this.history.push(stroke);
    
    return this.history;
  }

  updateUserCursor(userId, x, y, name) {
    if (!this.users.has(userId)) {
      // Assign a random color if new
      this.users.set(userId, { name, color: '#000', x, y });
    }
    const user = this.users.get(userId);
    user.x = x;
    user.y = y;
    return Object.fromEntries(this.users); // Return as plain object
  }

  removeUser(userId) {
    this.users.delete(userId);
  }
}

module.exports = { RoomState };