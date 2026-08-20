import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [closeErrorBar, setCloseErrorBar] = useState(false);

  const handleError = (err) => {
    setCloseErrorBar(true);
    if (err.response) {
      setError(err.response.data?.message || 'Server error');
    } else if (err.request) {
      setError('Server is not responding');
    } else {
      setError(err.message || 'Something went wrong');
    }
  };

  const loadAllChats = useCallback(async () => {
    try {
      const { data } = await chatService.getAllChats();
      if (data.success) setTitles(data.chats || []);
    } catch (err) {
      handleError(err);
    }
  }, []);

  const loadConversation = useCallback(async (id) => {
    if (!id) return;
    try {
      const { data } = await chatService.getConversation(id);
      if (data.success) {
        setMessages(data.messages || []);
        navigate(`/chat/${id}`);
      }
    } catch (err) {
      handleError(err);
    }
  }, [navigate]);

  const sendMessage = async (messageText, currentChatId) => {
    if (!messageText.trim()) return;
    setLoading(true);

    try {
      const { data } = await chatService.sendMessage(
        messageText,
        currentChatId,
        localStorage.getItem('model')
      );

      if (data.success) {
        await loadAllChats();
        await loadConversation(data.chatId);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChatById = async (id) => {
    try {
      await chatService.deleteChat(id);
      setMessages([]);
      navigate('/chat');
      await loadAllChats();
    } catch (err) {
      handleError(err);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setError(null);
    navigate('/chat');
  };

  return {
    titles,
    messages,
    loading,
    error,
    closeErrorBar,
    setCloseErrorBar,
    loadAllChats,
    loadConversation,
    sendMessage,
    deleteChatById,
    startNewChat,
    setMessages,
  };
};