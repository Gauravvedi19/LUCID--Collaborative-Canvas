import { useRef, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

const VIRTUAL_WIDTH = 1920;
const VIRTUAL_HEIGHT = 1080;

export const useCanvasEngine = (userName, isDarkMode) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const socketRef = useRef(null);
  
  const isDarkModeRef = useRef(isDarkMode);
  const isDrawing = useRef(false);
  const currentStroke = useRef([]);
  const history = useRef([]);
  
  const [cursors, setCursors] = useState({});
  const [users, setUsers] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {isDarkModeRef.current = isDarkMode;}, [isDarkMode]);

  const getEffectiveColor = useCallback((color) => {
    const dark = isDarkModeRef.current;
    if (dark && color === '#000000') return '#FFFFFF';
    if (!dark && color === '#FFFFFF') return '#000000';
    return color;
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    const scaleX = VIRTUAL_WIDTH / rect.width;
    const scaleY = VIRTUAL_HEIGHT / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const drawStroke = useCallback((ctx, points, color, width) => {
    if (points.length < 1) return;
    ctx.beginPath();
    
    if (color === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = width * 1.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = getEffectiveColor(color);
      ctx.lineWidth = width;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length === 1) {
      ctx.fillStyle = color === 'erase' ? 'rgba(0,0,0,1)' : getEffectiveColor(color);
      ctx.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2);
      if (color !== 'erase') ctx.fill(); else ctx.stroke();
    } else {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }, [getEffectiveColor]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history.current.forEach(stroke => {
      drawStroke(ctx, stroke.points, stroke.color, stroke.width);
    });
  }, [drawStroke]);

  useEffect(() => {
    if (ctxRef.current) redrawCanvas();
  }, [isDarkMode, redrawCanvas]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = VIRTUAL_WIDTH;
    canvas.height = VIRTUAL_HEIGHT;


    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    if (history.current.length > 0) redrawCanvas();

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join', { name: userName });
    });

    socket.on('canvas_state', (serverHistory) => {
      history.current = serverHistory;
      redrawCanvas();
    });

    socket.on('stroke_commited', (stroke) => {
      history.current.push(stroke);
      drawStroke(ctxRef.current, stroke.points, stroke.color, stroke.width);
    });

    socket.on('drawing_live', ({ p1, p2, color, width }) => {
      const ctx = ctxRef.current;
      ctx.beginPath();
      if (color === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = width * 1.5;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = getEffectiveColor(color);
        ctx.lineWidth = width;
      }
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    });

    socket.on('cursor_update', (serverCursors) => {
      setUsers(serverCursors);
      const { [socket.id]: myCursor, ...others } = serverCursors;
      setCursors(others);
    });

    socket.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [redrawCanvas, drawStroke, getEffectiveColor, userName]);


  const startDrawing = (e, color, width) => {
    isDrawing.current = true;
    const { x, y } = getCoordinates(e); // Use Scaled Coords
    currentStroke.current = [{ x, y }];
    
    const ctx = ctxRef.current;
    ctx.beginPath();
    if (color === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = width * 1.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = getEffectiveColor(color);
    }
    ctx.arc(x, y, width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const draw = (e, color, width) => {
    const { x, y } = getCoordinates(e);

    if (socketRef.current) {
        const normX = x / VIRTUAL_WIDTH; 
        const normY = y / VIRTUAL_HEIGHT;
        
        socketRef.current.emit('cursor_move', { 
            x: normX, y: normY, name: userName 
        });
    }

    if (!isDrawing.current) return;

    currentStroke.current.push({ x, y });
    const points = currentStroke.current;
    const lastPoint = points[points.length - 2];
    const ctx = ctxRef.current;
    
    ctx.beginPath();
    if (color === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = width * 1.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = getEffectiveColor(color);
      ctx.lineWidth = width;
    }
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';

    if (socketRef.current) {
      socketRef.current.emit('drawing_live', {
        p1: lastPoint,
        p2: { x, y },
        color, 
        width
      });
    }
  };

  const endDrawing = (color, width) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentStroke.current.length > 0) {
      const newStroke = {
        points: [...currentStroke.current],
        color, width
      };
      history.current.push(newStroke);
      if (socketRef.current) socketRef.current.emit('draw_stroke', newStroke);
    }
    currentStroke.current = [];
  };

  const sendChat = (text) => {
    if (!text.trim()) return;
    const msgData = {
      id: Date.now(), text, name: userName,
      color: '#' + Math.floor(Math.random()*16777215).toString(16), 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, { ...msgData, isMe: true }]);
    if (socketRef.current) socketRef.current.emit('chat_message', msgData);
  };
  const undo = () => { if (socketRef.current) socketRef.current.emit('undo'); };
  const redo = () => { if (socketRef.current) socketRef.current.emit('redo'); };
  const clearCanvas = () => { if (socketRef.current) socketRef.current.emit('clear'); };

  return {
    canvasRef, startDrawing, draw, endDrawing, undo, redo, clearCanvas,
    cursors, users, messages, sendChat
  };
};