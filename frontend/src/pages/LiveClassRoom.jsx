import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Loading from '../components/Loading';
import VideoCall from '../components/VideoCall';
import Whiteboard from '../components/Whiteboard';

const LiveClassRoom = () => {
  const { id } = useParams();
  const [joinInfo, setJoinInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/sessions/${id}/join`)
      .then((res) => setJoinInfo(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not join this session.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading label="Connecting to your live class..." />;

  if (error) {
    return (
      <div className="page-container">
        <div className="form-error">{error}</div>
        <Link to="/sessions" className="back-link">
          ← Back to sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="live-room">
      <div className="live-room-header">
        <Link to="/sessions" className="back-link">
          ← Leave class
        </Link>
        <h1>{joinInfo.session.topic}</h1>
      </div>
      <div className="live-room-grid">
        <VideoCall roomUrl={joinInfo.roomUrl} token={joinInfo.token} />
        <Whiteboard sessionId={id} />
      </div>
    </div>
  );
};

export default LiveClassRoom;
