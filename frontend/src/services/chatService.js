import api from '../api';

export const fetchChats = async () => {
  const res = await api.get('/api/chats');
  return res.data;
};

export const fetchChat = async (chatId) => {
  const res = await api.get(`/api/chat/${chatId}`);
  return res.data;
};

export const sendMessage = async (message, chatId) => {
  const res = await api.post('/api/chat', { message, chatId }, { timeout: 60000 });
  return res.data;
};

export const deleteChatById = async (chatId) => {
  await api.delete(`/api/chat/${chatId}`);
};

export const toggleChatBookmark = async (chatId) => {
  const res = await api.put(`/api/chat/${chatId}/bookmark`);
  return res.data;
};