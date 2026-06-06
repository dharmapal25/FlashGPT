import { useEffect, useState } from 'react';
import api, { setAccessToken as setApiAccessToken } from './api';
import './styles.css';
import Login from './Login';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState('New Chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load chats when user logs in
  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data.user) {
        setUser(res.data.user);
      }
      // backend may return an accessToken; if not, try refresh endpoint
      if (res.data.accessToken) {
        setApiAccessToken(res.data.accessToken);
      } else {
        try {
          const r = await api.post('/auth/refresh-token');
          if (r.data.accessToken) setApiAccessToken(r.data.accessToken);
        } catch (e) {
          // no token available
        }
      }
    } catch (err) {
      console.log('Not logged in');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async () => {
    try {
      const res = await api.get('/api/chats');
      if (res.data.success) {
        setChats(res.data.chats);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const res = await api.get(`/api/chat/${chatId}`);
      if (res.data.success) {
        setCurrentChatId(chatId);
        setMessages(res.data.chat.messages);
        setCurrentChatTitle(res.data.chat.title);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const newChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setCurrentChatTitle('New Chat');
    setInput('');
    setError('');
  };

  const deleteChat = async (chatId) => {
    try {
      await api.delete(`/api/chat/${chatId}`);
      setChats(chats.filter(c => c._id !== chatId));
      if (currentChatId === chatId) {
        newChat();
      }
      loadChats();
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const handleChat = async () => {
    if (!input.trim()) return;

    setChatLoading(true);
    setError('');

    try {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      const userMessage = input;
      setInput('');

      const res = await api.post('/api/chat', { 
        message: userMessage,
        chatId: currentChatId 
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        
        // If this is a new chat, update chatId
        if (!currentChatId) {
          setCurrentChatId(res.data.chatId);
          setCurrentChatTitle(userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''));
        }
        
        loadChats();
      } else {
        setError(res.data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error connecting to server';
      setError(errorMsg);
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
      setApiAccessToken(null);
      setUser(null);
      setMessages([]);
      setChats([]);
      setInput('');
      setError('');
      setCurrentChatId(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  if (loading) {
    return (
      <div className="appShell">
        <div className="main">
          <div className="loadingContainer">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login API_URL={API_URL} />;
  }

  return (
    <div className="appShell">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebarTop">
          <button className="newChatBtn" onClick={newChat}>
            ➕ New Chat
          </button>
        </div>

        <div className="chatList">
          <div className="chatsLabel">Chat History</div>
          {chats.length === 0 ? (
            <p className="noChats">No chats yet</p>
          ) : (
            chats.map(chat => (
              <div 
                key={chat._id} 
                className={`chatItem ${currentChatId === chat._id ? 'active' : ''}`}
              >
                <button 
                  className="chatItemBtn"
                  onClick={() => loadChat(chat._id)}
                >
                  {chat.title}
                </button>
                <button 
                  className="deleteBtn"
                  onClick={() => deleteChat(chat._id)}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sidebarFooter">
          <div className="userProfile">
            {user.profilePicture && (
              <img src={user.profilePicture} alt={user.displayName} />
            )}
            <span>{user.displayName}</span>
          </div>
          <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>
      </div>

      <div className="main">
        <div className="chatContainer">
          <div className="chatHeader">
            <button 
              className="menuToggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1>{currentChatTitle}</h1>
          </div>
          
          <div className="messagesBox">
            {messages.length === 0 ? (
              <p className="placeholder">Start a conversation...</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <p>{msg.content}</p>
                </div>
              ))
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <div className="inputBox">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={chatLoading}
            />
            <button 
              onClick={handleChat} 
              disabled={chatLoading || !input.trim()}
            >
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
