import { useEffect, useRef, useState } from 'react';
import { View, PanResponder, Pressable, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { connectSocket, disconnectSocket, getSocket } from '../api/socket';
import { colors } from '../theme/colors';

const PEN_COLORS = [colors.text, colors.secondary, colors.primary, colors.accent];
const WIDTHS = { pen: 3, eraser: 22 };
const BOARD_BG = '#ffffff';

const Whiteboard = ({ sessionId }) => {
  const [segments, setSegments] = useState([]);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState(PEN_COLORS[0]);

  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const lastPoint = useRef(null);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    let cancelled = false;

    const handleBoardState = (strokes) => setSegments(strokes);
    const handleDraw = (segment) => setSegments((prev) => [...prev, segment]);
    const handleClear = () => setSegments([]);

    const setup = async () => {
      const socket = await connectSocket();
      if (cancelled) return;

      socket.on('connect', () => socket.emit('join-session', sessionId));
      socket.on('board-state', handleBoardState);
      socket.on('draw', handleDraw);
      socket.on('clear-board', handleClear);
      if (socket.connected) socket.emit('join-session', sessionId);
    };

    setup();

    return () => {
      cancelled = true;
      const socket = getSocket();
      socket.off('board-state', handleBoardState);
      socket.off('draw', handleDraw);
      socket.off('clear-board', handleClear);
      disconnectSocket();
    };
  }, [sessionId]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        lastPoint.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
      },
      onPanResponderMove: (e) => {
        const to = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY };
        const activeTool = toolRef.current;
        const segment = {
          tool: activeTool,
          color: activeTool === 'eraser' ? BOARD_BG : colorRef.current,
          width: WIDTHS[activeTool],
          from: lastPoint.current,
          to,
        };
        setSegments((prev) => [...prev, segment]);
        getSocket().emit('draw', { sessionId, segment });
        lastPoint.current = to;
      },
    })
  ).current;

  const handleClear = () => {
    setSegments([]);
    getSocket().emit('clear-board', sessionId);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => setTool('pen')}
          style={[styles.toolBtn, tool === 'pen' && styles.toolBtnActive]}
        >
          <Text style={styles.toolLabel}>✏️ Pen</Text>
        </Pressable>
        <Pressable
          onPress={() => setTool('eraser')}
          style={[styles.toolBtn, tool === 'eraser' && styles.toolBtnActive]}
        >
          <Text style={styles.toolLabel}>🧽 Eraser</Text>
        </Pressable>
        <View style={styles.swatchRow}>
          {PEN_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                setColor(c);
                setTool('pen');
              }}
              style={[
                styles.swatch,
                { backgroundColor: c },
                color === c && tool === 'pen' && styles.swatchActive,
              ]}
            />
          ))}
        </View>
        <Pressable onPress={handleClear} style={[styles.toolBtn, styles.clearBtn]}>
          <Text style={styles.toolLabel}>🗑️ Clear</Text>
        </Pressable>
      </View>

      <View style={styles.canvas} {...panResponder.panHandlers}>
        <Svg style={StyleSheet.absoluteFill}>
          {segments.map((s, i) => (
            <Line
              key={i}
              x1={s.from.x}
              y1={s.from.y}
              x2={s.to.x}
              y2={s.to.y}
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  toolBtn: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toolBtnActive: { borderColor: colors.primary, backgroundColor: '#f0eefc' },
  toolLabel: { fontWeight: '700', fontSize: 12.5, color: colors.text },
  clearBtn: { marginLeft: 'auto' },
  swatchRow: { flexDirection: 'row', gap: 6 },
  swatch: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  swatchActive: { borderColor: colors.text },
  canvas: { flex: 1, backgroundColor: BOARD_BG, minHeight: 280 },
});

export default Whiteboard;
