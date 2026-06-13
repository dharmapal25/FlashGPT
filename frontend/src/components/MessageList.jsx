import { useRef, useEffect, useState } from 'react';
import { Bot, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import 'highlight.js/styles/github-dark.css';

const mdComponents = { code: CodeBlock };

const MessageList = ({ messages, chatLoading }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const copyMessage = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="messagesBox">
      {messages.length === 0 ? (
        <div className="emptyState">
          <Bot size={40} strokeWidth={1.2} />
          <p>Start a conversation</p>
          <span>Ask me anything — code, concepts, or questions.</span>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isTyping = !isUser && idx === messages.length - 1 && chatLoading;

          return (
            <article key={`${msg.role}-${idx}`} className={`message ${isUser ? 'fromUser' : 'fromAssistant'}`}>
              <div className="messageBody">
                {isTyping ? (
                  <div className="loadingDots" aria-label="Thinking"><span /><span /><span /></div>
                ) : isUser ? (
                  <p className="userText">{msg.content}</p>
                ) : (
                  <div className="markdownResponse">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={mdComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {!isUser && !isTyping && (
                  <div className="messageActions">
                    <button
                      type="button"
                      className={copiedIdx === idx ? 'active' : ''}
                      onClick={() => copyMessage(msg.content, idx)}
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <Check size={13} /> : <Copy size={13} />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })
      )}

      {/* Loading dots when awaiting first token */}
      {chatLoading && messages.at(-1)?.role === 'user' && (
        <article className="message fromAssistant">
          <div className="messageBody">
            <div className="loadingDots" aria-label="Thinking"><span /><span /><span /></div>
          </div>
        </article>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;