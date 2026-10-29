const SpeakButton = ({ text }) => {
  const speak = () => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button type="button" className="speak-btn" onClick={speak} aria-label="Listen">
      🔊 Listen
    </button>
  );
};

export default SpeakButton;
