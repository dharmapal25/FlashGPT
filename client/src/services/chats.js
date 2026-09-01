// chats.js
import API from "./api"

export const loadAllConversations = async () => {
    const { data } = await API.get("/chat/all-conversation");
    return data;
}


export const loadConversationById = async (id) => {
    const { data } = await API.get(`/chat/conversation/${id}`);
    return data;
}


export const sendMessage = async (message, chatId, model = localStorage.getItem("model")) => {

    const { data } = await API.post("/chat/conversation", {
        message, chatId, model
    });

    return data;
}


export const deleteConversation = async (id) => {
    const { data } = await API.delete(`/chat/conversation/${id}`);
    return data;
}