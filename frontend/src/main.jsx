import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Archive,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Edit3,
  FileText,
  Image,
  LayoutGrid,
  Menu,
  Mic,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
import './styles.css';

const conversations = [
  'React dashboard polish',
  'Landing page copy ideas',
  'Database schema review',
  'Travel plan for Kyoto',
  'Bug bash checklist',
  'CSS grid layout fixes',
];

const starters = [
  { icon: Sparkles, title: 'Create', text: 'Draft a product launch plan for a small design tool' },
  { icon: FileText, title: 'Summarize', text: 'Turn meeting notes into decisions and next steps' },
  { icon: LayoutGrid, title: 'Design', text: 'Sketch a clean analytics dashboard layout' },
  { icon: Image, title: 'Imagine', text: 'Describe a visual direction for a cozy reading app' },
];

const initialMessages = [
  {
    role: 'assistant',
    text:
      'Hi! I can help with writing, coding, planning, analysis, and design. Pick a prompt below or start with your own.',
  },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';

function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebarTop">
        <button className="newChat" type="button">
          <Plus size={18} />
          <span>New chat</span>
        </button>
        <button className="iconButton sidebarClose" type="button" aria-label="Close sidebar" onClick={onClose}>
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="searchBox">
        <Search size={17} />
        <input aria-label="Search chats" placeholder="Search chats" />
      </div>

      <nav className="chatList" aria-label="Recent chats">
        <p className="sectionLabel">Recent</p>
        {conversations.map((item, index) => (
          <button className={index === 0 ? 'chatItem active' : 'chatItem'} type="button" key={item}>
            <span>{item}</span>
            <MoreHorizontal size={16} />
          </button>
        ))}
      </nav>

      <div className="sidebarFooter">
        <button className="footerItem" type="button">
          <Archive size={18} />
          <span>Archived chats</span>
        </button>
        <button className="footerItem" type="button">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <div className="profile">
          <div className="avatar userAvatar">F</div>
          <div>
            <strong>Flash</strong>
            <span>Free plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Message({ role, text, isLoading }) {
  const isUser = role === 'user';

  return (
    <article className={`message ${isUser ? 'fromUser' : 'fromAssistant'}`}>
      <div className={isUser ? 'avatar userAvatar' : 'avatar assistantAvatar'}>
        {isUser ? <UserRound size={17} /> : <Bot size={18} />}
      </div>
      <div className="messageBody">
        {isLoading ? (
          <div className="loadingDots" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        ) : isUser ? (
          <p>{text}</p>
        ) : (
          <div className="markdownResponse">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {text}
            </ReactMarkdown>
          </div>
        )}
        {!isUser && !isLoading && (
          <div className="messageActions" aria-label="Message actions">
            <button type="button" aria-label="Copy response">
              <Copy size={15} />
            </button>
            <button type="button" aria-label="Mark useful">
              <Check size={15} />
            </button>
            <button type="button" aria-label="Edit response">
              <Edit3 size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  const canSend = input.trim().length > 0 && !isSending;
  const characterCount = useMemo(() => input.trim().length, [input]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  async function sendMessage(text = input) {
    const cleanText = text.trim();
    if (!cleanText || isSending) return;

    const pendingMessage = {
      role: 'assistant',
      text: 'Thinking...',
      isLoading: true,
    };

    setIsSending(true);
    setMessages((current) => [
      ...current,
      { role: 'user', text: cleanText },
      pendingMessage,
    ]);
    setInput('');

    try {
      const { data } = await axios.post(
        API_URL,
        { message: cleanText },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!data.success) {
        throw new Error(data.message || 'Backend response failed');
      }

      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? { role: 'assistant', text: data.response || 'No response' }
            : message
        )
      );
    } catch (error) {
      setMessages((current) =>
        current.map((message, index) =>
          index === current.length - 1
            ? {
                role: 'assistant',
                text:
                  error.response?.data?.message ||
                  error.message ||
                  'Backend se response nahi aa paaya. Please try again.',
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="appShell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="scrim" aria-label="Close sidebar overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="mainPanel">
        <header className="topBar">
          <div className="topLeft">
            <button className="iconButton menuButton" type="button" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <button className="modelPicker" type="button">
              <span>ChatGPT</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="topActions">
            <button className="ghostButton" type="button">
              <Sparkles size={16} />
              <span>Explore GPTs</span>
            </button>
            <button className="iconButton" type="button" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </header>

        <section className="conversation" aria-live="polite">
          <div className="conversationInner">
            <div className="hero">
              <div className="heroMark">
                <Bot size={27} />
              </div>
              <h1>What can I help with?</h1>
            </div>

            <div className="starterGrid">
              {starters.map(({ icon: Icon, title, text }) => (
                <button className="starter" type="button" key={title} onClick={() => sendMessage(text)}>
                  <Icon size={19} />
                  <span>
                    <strong>{title}</strong>
                    {text}
                  </span>
                </button>
              ))}
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <Message key={`${message.role}-${index}`} {...message} />
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        </section>

        <form className="composerWrap" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
          <div className="composer">
            <textarea
              aria-label="Message ChatGPT"
              placeholder="Message ChatGPT"
              value={input}
              rows="1"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="composerFooter">
              <div className="composerTools">
                <button className="toolButton" type="button" aria-label="Attach file">
                  <Plus size={18} />
                </button>
                <button className="toolButton textTool" type="button">
                  <Sparkles size={16} />
                  <span>Tools</span>
                </button>
              </div>
              <div className="sendGroup">
                <span className="counter">{characterCount}</span>
                <button className="toolButton" type="button" aria-label="Voice input">
                  <Mic size={18} />
                </button>
                <button className="sendButton" type="submit" aria-label="Send message" disabled={!canSend}>
                  <Send size={17} />
                </button>
              </div>
            </div>
          </div>
          <p className="disclaimer">ChatGPT can make mistakes. Check important info.</p>
        </form>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
