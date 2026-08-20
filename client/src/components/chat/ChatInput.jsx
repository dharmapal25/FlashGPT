import React, { useState } from 'react';
import { IoIosSend } from 'react-icons/io';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-wrapper">
      <div className="input-box">
        <input
          type="text"
          placeholder="Message Flashpilot..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
        >
          <IoIosSend size={19} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;