import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Daily, { DailyMediaView } from '@daily-co/react-native-daily-js';
import LoadingView from '../components/LoadingView';
import Whiteboard from '../components/Whiteboard';
import api from '../api/axios';
import { colors } from '../theme/colors';

const LiveClassRoomScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState({});
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [view, setView] = useState('call');
  const [isTutor, setIsTutor] = useState(false);
  const [recording, setRecording] = useState(false);
  const callRef = useRef(null);

  useEffect(() => {
    let active = true;

    const updateParticipants = () => {
      if (callRef.current) setParticipants({ ...callRef.current.participants() });
    };

    const start = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}/join`);
        if (!active) return;
        setIsTutor(!!data.isTutor);

        const callObject = Daily.createCallObject();
        callRef.current = callObject;

        callObject.on('participant-updated', updateParticipants);
        callObject.on('participant-joined', updateParticipants);
        callObject.on('participant-left', updateParticipants);
        callObject.on('recording-started', () => setRecording(true));
        callObject.on('recording-stopped', () => setRecording(false));

        await callObject.join({ url: data.roomUrl, token: data.token });
        updateParticipants();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Could not start the video call. Live video requires a custom Expo dev build (eas build --profile development) — it will not run inside Expo Go.'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    start();

    return () => {
      active = false;
      callRef.current?.leave();
      callRef.current?.destroy();
      callRef.current = null;
    };
  }, [id]);

  const toggleMute = () => {
    const next = !muted;
    callRef.current?.setLocalAudio(!next);
    setMuted(next);
  };

  const toggleCamera = () => {
    const next = !cameraOff;
    callRef.current?.setLocalVideo(!next);
    setCameraOff(next);
  };

  const leaveCall = () => {
    callRef.current?.leave();
    navigation.goBack();
  };

  const toggleRecording = () => {
    if (recording) {
      callRef.current?.stopRecording();
    } else {
      callRef.current?.startRecording();
    }
  };

  if (loading) return <LoadingView label="Connecting to your live class..." />;

  if (error) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const localParticipant = participants.local;
  const remoteKey = Object.keys(participants).find((key) => key !== 'local');
  const remoteParticipant = remoteKey ? participants[remoteKey] : null;

  return (
    <View style={styles.room}>
      <View style={styles.switcher}>
        <Pressable
          onPress={() => setView('call')}
          style={[styles.switchBtn, view === 'call' && styles.switchBtnActive]}
        >
          <Text style={styles.switchLabel}>📹 Call</Text>
        </Pressable>
        <Pressable
          onPress={() => setView('board')}
          style={[styles.switchBtn, view === 'board' && styles.switchBtnActive]}
        >
          <Text style={styles.switchLabel}>🖊️ Whiteboard</Text>
        </Pressable>
        {recording && (
          <View style={styles.recordingBadge}>
            <Text style={styles.recordingBadgeText}>⏺ Recording</Text>
          </View>
        )}
      </View>

      {view === 'call' ? (
        <View style={styles.videoArea}>
          {remoteParticipant?.videoTrack ? (
            <DailyMediaView
              videoTrack={remoteParticipant.videoTrack}
              audioTrack={remoteParticipant.audioTrack}
              mirror={false}
              style={styles.remoteVideo}
              zOrder={0}
            />
          ) : (
            <View style={styles.waitingBox}>
              <Text style={styles.waitingText}>Waiting for the other person to join...</Text>
            </View>
          )}
          {localParticipant?.videoTrack && !cameraOff && (
            <DailyMediaView
              videoTrack={localParticipant.videoTrack}
              mirror
              style={styles.localVideo}
              zOrder={1}
            />
          )}
        </View>
      ) : (
        <Whiteboard sessionId={id} />
      )}

      <View style={styles.controls}>
        <Pressable onPress={toggleMute} style={[styles.controlBtn, muted && styles.controlBtnOff]}>
          <Text style={styles.controlLabel}>{muted ? '🔇 Unmute' : '🎤 Mute'}</Text>
        </Pressable>
        <Pressable onPress={toggleCamera} style={[styles.controlBtn, cameraOff && styles.controlBtnOff]}>
          <Text style={styles.controlLabel}>{cameraOff ? '📷 Turn on' : '📷 Turn off'}</Text>
        </Pressable>
        {isTutor && (
          <Pressable onPress={toggleRecording} style={[styles.controlBtn, recording && styles.controlBtnOff]}>
            <Text style={styles.controlLabel}>{recording ? '⏹ Stop rec.' : '⏺ Record'}</Text>
          </Pressable>
        )}
        <Pressable onPress={leaveCall} style={[styles.controlBtn, styles.leaveBtn]}>
          <Text style={styles.leaveLabel}>Leave</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  room: { flex: 1, backgroundColor: '#000' },
  switcher: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  switchBtn: { borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#fff1e2' },
  switchBtnActive: { backgroundColor: colors.primary },
  switchLabel: { fontWeight: '700', color: colors.primaryDark },
  recordingBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.danger,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  recordingBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  videoArea: { flex: 1, backgroundColor: '#111' },
  remoteVideo: { flex: 1 },
  localVideo: {
    position: 'absolute',
    width: 110,
    height: 150,
    right: 14,
    bottom: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  waitingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  waitingText: { color: '#fff', textAlign: 'center', fontSize: 15 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: colors.surface,
  },
  controlBtn: { backgroundColor: '#fff1e2', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 },
  controlBtnOff: { backgroundColor: '#fdeceb' },
  controlLabel: { fontWeight: '700', color: colors.primaryDark },
  leaveBtn: { backgroundColor: colors.danger },
  leaveLabel: { fontWeight: '700', color: '#fff' },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.bg },
  errorText: { color: colors.danger, textAlign: 'center', marginBottom: 16, fontSize: 15 },
  backBtn: { backgroundColor: '#fff1e2', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20 },
  backBtnText: { color: colors.primaryDark, fontWeight: '700' },
});

export default LiveClassRoomScreen;
