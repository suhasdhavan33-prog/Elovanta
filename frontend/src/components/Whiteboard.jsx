import { useEffect, useRef, useState } from 'react';
import { connectSocket, disconnectSocket } from '../api/socket';

const COLORS = ['#2D2D3A', '#FF6B6B', '#6C63FF', '#4ECDC4', '#FFD93D'];
const WIDTHS = { pen: 3, eraser: 24 };

const drawSegment = (ctx, segment) => {
  ctx.globalCompositeOperation = segment.tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = segment.color;
  ctx.lineWidth = segment.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(segment.from.x, segment.from.y);
  ctx.lineTo(segment.to.x, segment.to.y);
  ctx.stroke();
};

const Whiteboard = ({ sessionId }) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      const prev = ctx.getImageData(0, 0, canvas.width || 1, canvas.height || 1);
      canvas.width = width;
      canvas.height = height;
      ctx.putImageData(prev, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    const ctx = canvasRef.current.getContext('2d');

    const handleBoardState = (strokes) => {
      strokes.forEach((segment) => drawSegment(ctx, segment));
    };
    const handleDraw = (segment) => drawSegment(ctx, segment);
    const handleClear = () => ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    socket.on('connect', () => socket.emit('join-session', sessionId));
    socket.on('board-state', handleBoardState);
    socket.on('draw', handleDraw);
    socket.on('clear-board', handleClear);

    if (socket.connected) socket.emit('join-session', sessionId);

    return () => {
      socket.off('board-state', handleBoardState);
      socket.off('draw', handleDraw);
      socket.off('clear-board', handleClear);
      disconnectSocket();
    };
  }, [sessionId]);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const point = getPoint(e);
    const segment = {
      tool,
      color,
      width: WIDTHS[tool],
      from: lastPointRef.current,
      to: point,
    };
    drawSegment(canvasRef.current.getContext('2d'), segment);
    connectSocket().emit('draw', { sessionId, segment });
    lastPointRef.current = point;
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleClear = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    connectSocket().emit('clear-board', sessionId);
  };

  return (
    <div className="whiteboard">
      <div className="whiteboard-toolbar">
        <button
          type="button"
          className={`wb-tool ${tool === 'pen' ? 'active' : ''}`}
          onClick={() => setTool('pen')}
        >
          ✏️ Pen
        </button>
        <button
          type="button"
          className={`wb-tool ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => setTool('eraser')}
        >
          🧽 Eraser
        </button>
        <div className="wb-colors">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`wb-swatch ${color === c && tool === 'pen' ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => {
                setColor(c);
                setTool('pen');
              }}
            />
          ))}
        </div>
        <button type="button" className="wb-tool wb-clear" onClick={handleClear}>
          🗑️ Clear
        </button>
      </div>
      <div className="whiteboard-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
