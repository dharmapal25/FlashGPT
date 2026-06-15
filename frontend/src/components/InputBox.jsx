import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

const InputBox = ({ input, setInput, onSend, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setMicSupported(true);
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = e =>
      setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recRef.current = rec;
  }, [setInput]);

  const toggleMic = () => {
    if (!recRef.current) return;
    if (isListening) { recRef.current.stop(); setIsListening(false); }
    else { recRef.current.start(); setIsListening(true); }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };

  return (
    <div className="inputBox">
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={handleKey}
        placeholder="Message…"
        disabled={disabled}
        rows={1}
      />
      <div className="inputActions">
        {micSupported && (
          <button
            className={`micBtn ${isListening ? 'listening' : ''}`}
            onClick={toggleMic}
            title={isListening ? 'Stop' : 'Speak'}
            type="button"
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
        <button
          className="sendBtn"
          onClick={onSend}
          disabled={disabled || !input.trim()}
          type="button"
        >
          {disabled ? <span className="sendSpinner" /> : <Send size={17}/>}
        </button>
      </div>
    </div>
  );
};

export default InputBox;