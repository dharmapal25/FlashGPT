import { useEffect, useState, useRef, useCallback } from 'react';
import { Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import InputBox from '../components/InputBox';
import DeleteModal from '../components/DeleteModal';
import { fetchChat, sendMessage, deleteChatById } from '../services/chatService';

const ChatPage = () => {
  const { user, authLoading, theme, toggleTheme, loadChats, removeChat } = useApp();

  const [input, setInput]                   = useState('');
  const [chatLoading, setChatLoading]       = useState(false);
  const [error, setError]                   = useState('');
  const [messages, setMessages]             = useState([]);
  const [currentChatId, setCurrentChatId]   = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState('New Chat');
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [memorySavedVisible, setMemorySavedVisible] = useState(false);

  const memorySavedTimer = useRef(null);
  const params   = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /* ── Route handling ── */
  useEffect(() => {
    if (!user) return;
    const { id: routeId, action } = params;

    if (location.pathname === '/chat/new' || routeId === 'new') {
      newChat(); return;
    }
    if (routeId && action === 'delete') {
      setDeleteTargetId(routeId);
      setShowDeleteConfirm(true);
      return;
    }
    if (routeId) loadChat(routeId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, params.action, user, location.pathname]);

  const newChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentChatTitle('New Chat');
    setInput('');
    setError('');
  };

  const loadChat = async (chatId) => {
    try {
      const data = await fetchChat(chatId);
      if (data.success) {
        setCurrentChatId(chatId);
        setMessages(data.chat.messages);
        setCurrentChatTitle(data.chat.title);
      }
    } catch (err) { console.error('loadChat:', err); }
  };

  const showMemorySaved = useCallback(() => {
    setMemorySavedVisible(true);
    if (memorySavedTimer.current) clearTimeout(memorySavedTimer.current);
    memorySavedTimer.current = setTimeout(() => setMemorySavedVisible(false), 5000);
  }, []);

  const handleChat = async () => {
    if (!input.trim()) return;
    setChatLoading(true);
    setError('');
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const data = await sendMessage(userMessage, currentChatId);
      if (data.memorySaved) showMemorySaved();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        if (!currentChatId) {
          setCurrentChatId(data.chatId);
          setCurrentChatTitle(userMessage.substring(0, 50) + (userMessage.length > 50 ? '…' : ''));
        }
        loadChats();
      } else {
        setError(data.message || 'Failed to get response');
      }
    } catch (err) {
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.toLowerCase().includes('timeout');
      setError(isTimeout
        ? 'AI response timed out. Please try again.'
        : err.response?.data?.message || err.message || 'Error connecting to server'
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleDelete = async (chatId) => {
    try {
      await deleteChatById(chatId);
      removeChat(chatId);
      if (currentChatId === chatId) newChat();
      loadChats();
    } catch (err) { console.error('delete:', err); }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    await handleDelete(deleteTargetId);
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
    navigate('/chat/new');
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
    navigate('/chat/new');
  };

  /* ── Guards ── */
  if (authLoading) return (
    <div className="appShell" data-theme={theme}>
      <div className="loadingScreen">
        <div className="loadingSpinner" /><span>Loading…</span>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="appShell" data-theme={theme}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentChatId={currentChatId}
        onDeleteClick={(id) => { setDeleteTargetId(id); setShowDeleteConfirm(true); }}
      />

      <main className="main">
        <div className="chatContainer">
          <header className="chatHeader">
            <button className="menuToggle" onClick={() => setSidebarOpen(o => !o)}>
              <span className="hamburger" />
            </button>
            <h1 className="chatTitle">{currentChatTitle}</h1>
            <button className="themeToggleHeader" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </header>

          <MessageList messages={messages} chatLoading={chatLoading} />

          {error && (
            <div className="errorBanner">
              <span>{error}</span>
              <button onClick={() => setError('')}><X size={18} /></button>
            </div>
          )}

          {memorySavedVisible && (
            <div className="memorySavedPopup">
              <Check size={13} /> Memory saved
            </div>
          )}

          <InputBox input={input} setInput={setInput} onSend={handleChat} disabled={chatLoading} />
        </div>
      </main>

      {showDeleteConfirm && (
        <DeleteModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
};

export default ChatPage;