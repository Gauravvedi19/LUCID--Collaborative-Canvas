# System Architecture

This document outlines the technical decisions, data flow, and protocols used in the Lucid Collaborative Whiteboard.

## 1. Data Flow Diagram

The application follows a unidirectional data flow for local actions and a broadcast model for remote actions.

graph TD
    User[User Input (Mouse/Touch)] -->|Events| ReactComp[Canvas Component]
    ReactComp -->|1. Calculate| CoordSystem[Virtual Coordinate System (1920x1080)]
    
    %% Local Drawing Path
    CoordSystem -->|2. Draw Immediately| LocalCanvas[HTML5 Canvas API]
    
    %% Network Path
    CoordSystem -->|3. Emit Data| SocketClient[Socket.io Client]
    SocketClient -->|WebSocket| Server[Node.js Server]
    
    %% Server Broadcast
    Server -->|Broadcast Event| OtherClients[Other Connected Users]
    
    %% Remote Drawing Path
    OtherClients -->|Receive Data| RemoteEngine[Canvas Engine]
    RemoteEngine -->|Draw| RemoteCanvas[HTML5 Canvas API]

## 2. WebSocket Protocol

We use `socket.io` for event-based communication. The payloads are minimized for performance to ensure low latency during concurrent drawing sessions.

| Event Name | Direction | Payload Data | Description |
| :--- | :--- | :--- | :--- |
| `join` | Client → Server | `{ name: string }` | Sent immediately upon connection to identify the user. |
| `drawing_live` | Bidirectional | `{ p1: {x,y}, p2: {x,y}, color, width }` | Real-time "drag" events. Used to draw temporary lines on other clients' screens while the mouse is moving. |
| `draw_stroke` | Bidirectional | `{ points: [{x,y}...], color, width }` | Sent on `mouseup`. Commits a full, completed stroke to the server's history. |
| `cursor_move` | Bidirectional | `{ x: 0-1, y: 0-1, name }` | Sends normalized coordinates (0% to 100%) rather than pixels to ensure correct positioning on different screen sizes. |
| `undo` / `redo` | Bidirectional | `null` | Triggers a state change on the server. The server then broadcasts the new history to all clients. |
| `clear` | Bidirectional | `null` | Wipes the entire canvas history on the server and updates all clients. |
| `canvas_state` | Server → Client | `[Array of Strokes]` | Sent automatically to a new user when they join, allowing them to see what has already been drawn. |
| `chat_message` | Bidirectional | `{ id, text, name, color, time }` | Handles real-time chat messages between users. |

## 3. Undo/Redo Strategy

We implement a **Global Server-Side History** strategy. This ensures that the state of the board remains consistent for all users at all times.

* **State Management:**
    The server maintains two persistent arrays in memory for each room:
    * `drawingHistory`: A chronological list of all active strokes currently visible on the canvas.
    * `redoStack`: A LIFO (Last-In-First-Out) stack containing strokes that have been undone.

* **Logic Flow:**
    * **Undo Action:** The server removes the last item from `drawingHistory`, pushes it onto the `redoStack`, and immediately broadcasts the updated `drawingHistory` to all connected clients.
    * **Redo Action:** The server pops the most recent item from `redoStack`, pushes it back onto `drawingHistory`, and broadcasts the update.
    * **New Stroke:** When a user draws a new line, it is pushed to `drawingHistory`, and the `redoStack` is strictly emptied. This prevents "branching history" conflicts.

* **Client Handling:**
    When a client receives a new history update (via the `canvas_state` event), it performs a full re-render:
    1.  `ctx.clearRect(0, 0, width, height)`: The local canvas is completely wiped.
    2.  The client iterates through the new array of strokes and redraws them sequentially.
    * *Why this approach?* While redrawing the whole canvas seems expensive, HTML5 Canvas is extremely fast at vector rasterization. This guarantees 100% synchronization without complex differential updates. 

## 4. Performance Decisions

To ensure a smooth, 60FPS experience even with multiple users drawing simultaneously, we made several specific architectural choices to bypass standard React rendering bottlenecks.

### A. `useRef` over `useState` for Drawing
React's virtual DOM is powerful, but the reconciliation process is too slow for high-frequency events like `mousemove`, which fires hundreds of times per second.
* **Problem:** Storing mouse coordinates in `useState` triggers a component re-render on every single pixel movement, causing significant lag and browser freezing.
* **Solution:** We utilize `useRef` to store mutable data (current coordinates, drawing state, socket instances). This allows us to interact directly with the HTML5 Canvas API imperatively, completely bypassing the React render cycle for the actual drawing logic.

### B. Virtual Coordinate System
Users connect with vastly different screen sizes (e.g., 4K Desktop vs. 13" Laptop vs. Mobile). A line drawn at pixel `(500, 500)` on a large monitor might appear off-screen on a smaller device.
* **Solution:** We implemented a **Virtual Standard Resolution of 1920x1080**.
    * **Input:** When a user clicks, we calculate the scale factor of their physical screen relative to the virtual grid and map the input coordinates to that grid.
    * **Output:** All drawing data is stored and broadcast in these "Virtual Coordinates," ensuring the whiteboard looks identical proportionally on every device.

### C. Normalized Cursors
Cursor overlays are DOM elements (HTML divs), not canvas pixels. Positioning them using absolute pixels causes misalignment when users resize their windows.
* **Solution:** We broadcast cursor positions as **Normalized Percentages (0.0 to 1.0)** rather than raw pixels.
    * *Example:* If User A is at the exact center of their screen, we send `{ x: 0.5, y: 0.5 }`. User B's client receives this and renders the cursor at `50%` of their own container's width/height. This guarantees perfect relative alignment regardless of window size.

### D. Canvas Rasterization vs. SVG
* **Decision:** We chose **HTML5 Canvas (Bitmap)** over SVG (Vector DOM).
* **Reasoning:** While SVG is easier to manipulate, it becomes extremely heavy when the DOM contains thousands of path elements (e.g., a long drawing session). Canvas rasterizes strokes into a single bitmap image immediately, keeping memory usage constant regardless of how many lines are drawn.