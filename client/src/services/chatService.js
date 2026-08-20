import API from './api';

export const chatService = {

    
    getAllChats: () => API.get('/chat/all-conversation'),

    getConversation: (id) => API.get(`/chat/conversation/${id}`),

    sendMessage: (message, chatId, model) =>
        API.post('/chat/conversation', { message, chatId, model }),


    deleteChat: (id) => API.delete(`/chat/conversation/${id}`),
};