const DAILY_API_BASE = 'https://api.daily.co/v1';

const dailyRequest = async (path, options = {}) => {
  if (!process.env.DAILY_API_KEY) {
    const err = new Error(
      'Live classes are not configured yet: DAILY_API_KEY is missing from backend/.env'
    );
    err.statusCode = 503;
    throw err;
  }

  const res = await fetch(`${DAILY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.info || data.error || 'Daily.co API request failed');
    err.statusCode = res.status;
    throw err;
  }

  return data;
};

const createRoom = async (name, expUnixSeconds) => {
  return dailyRequest('/rooms', {
    method: 'POST',
    body: JSON.stringify({
      name,
      privacy: 'private',
      properties: {
        exp: expUnixSeconds,
        eject_at_room_exp: true,
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: false,
        start_audio_off: false,
      },
    }),
  });
};

const deleteRoom = async (name) => {
  try {
    await dailyRequest(`/rooms/${name}`, { method: 'DELETE' });
  } catch (err) {
    // Room may already be gone — not fatal.
  }
};

const createMeetingToken = async (roomName, { userName, isOwner, expUnixSeconds }) => {
  const data = await dailyRequest('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: !!isOwner,
        exp: expUnixSeconds,
      },
    }),
  });
  return data.token;
};

module.exports = { createRoom, deleteRoom, createMeetingToken };
