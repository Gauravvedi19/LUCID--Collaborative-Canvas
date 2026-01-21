# Lucid: Real-Time Collaborative Whiteboard

A high-performance, real-time collaborative drawing platform featuring a "Glass OS" aesthetic. It allows multiple users to draw, chat, and interact on a shared infinite-feel canvas with zero latency.

## 🚀 Setup Instructions

This project is configured to run both the client and server from a single command.

### Prerequisites
* Node.js (v14 or higher)
* npm

### Installation & Startup
# Lucid: Real-Time Collaborative Whiteboard

A high-performance, real-time collaborative drawing platform featuring a "Glass OS" aesthetic. It allows multiple users to draw, chat, and interact on a shared infinite-feel canvas with zero latency.

## 🌐 Live Demo
**Click here to start a session immediately:**
### [🚀 Launch Lucid Canvas (Vercel)](https://lucid-collaborative-canvas.vercel.app)

*(Note: The backend runs on Render Free Tier. If it's the first time loading in a while, please allow 30-60 seconds for the server to wake up.)*

---

## 🛠️ Local Development Setup

If you want to run the project code on your own machine:

### Prerequisites
* Node.js (v14 or higher)
* npm

### Installation & Startup
This project uses a monorepo structure. You can install dependencies and start both the Client and Server with a single command.

```bash
npm install && npm start
### How to Test with Multiple Users

    Open the App: Open http://localhost:5173 in your main browser window. Enter a name (e.g., "Host").

    Simulate User 2: Open a New Incognito Window (or a different browser). Go to the same URL and enter a different name (e.g., "Guest").

    Interact:

        Draw in one window; watch it appear instantly in the other.

        Move your mouse to see the live cursor tracking.

        Test the Undo/Redo buttons—notice how it updates the state for everyone.

        Use the Chat feature to send messages between windows.

### Known Limitations & Bugs

    Global Undo: The Undo/Redo history is shared globally. If User A draws a line, User B can undo it. This is by design for this version but can be chaotic with many users.

    No Persistence: Drawing history is stored in the server's RAM. If the server restarts, the whiteboard is wiped.

    Network Jitter: On very slow connections, "live" drawing curves might appear slightly jagged before the final "smoothed" stroke is committed.