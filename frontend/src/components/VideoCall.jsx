const VideoCall = ({ roomUrl, token }) => (
  <div className="video-call-wrap">
    <iframe
      title="Live class video"
      src={`${roomUrl}?t=${token}`}
      allow="camera; microphone; fullscreen; speaker; display-capture; autoplay"
      className="video-call-frame"
    />
  </div>
);

export default VideoCall;
