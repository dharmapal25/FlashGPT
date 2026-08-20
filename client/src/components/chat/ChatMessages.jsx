import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BiX } from 'react-icons/bi';

const ChatMessages = ({
    messages,
    loading,
    error,
    closeErrorBar,
    onCloseError,
    messagesEndRef,
    setIsSidebarOpen,
    isSidebarOpen

}) => {
    return (
        <div className="messages-container" onClick={() => setIsSidebarOpen(!isSidebarOpen)} >
            {error && (
                <div className={`error-message ${!closeErrorBar ? 'error-box' : ''}`}>
                    <p>{error}</p>
                    <button onClick={onCloseError}>
                        <BiX size={20} fill="#ccc" style={{ cursor: 'pointer' }} />
                    </button>
                </div>
            )}

            {messages.length === 0 && !loading && (
                <div className="empty-state">
                    <h3>What can I help with today?</h3>
                </div>
            )}

            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message-row ${msg.role === 'user' ? 'user-row' : 'ai-row'}`}
                >
                    <div className="message-avatar"></div>
                    <div className="message-bubble markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="message-row ai-row">
                    <div className="message-bubble loading-bubble">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;