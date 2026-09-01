import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { deleteConversation, loadAllConversations, loadConversationById, sendMessage } from "../services/chats";

const ChatsContext = createContext();

export const ChatsProvider = ({ children }) => {
    const navigate = useNavigate();

    const { chatId } = useParams();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [closeErrorBar, setCloseErrorBar] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const closeError = () => {
        setCloseErrorBar((prev) => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const handleError = (err) => {
        setCloseErrorBar(false);
        if (err.response) {
            setError(err.response.data.message || "Server error");
        } else if (err.request) {
            setError("Server is not responding");
        } else {
            setError(err.message || "Something went wrong");
        }
    };

    // Load all sidebar chat titles
    const loadAllChats = async () => {
        try {
            const data = await loadAllConversations();
            if (data.success) {
                setTitles(data.chats);
            }
        } catch (err) {
            handleError(err);
        }
    };

    // Load messages of a specific conversation
    const loadConversation = async (id) => {
        if (!id) return;
        try {
            const data = await loadConversationById(id);
            if (data.success) {
                setMessages(data.messages);
                navigate(`/chat/${id}`);
            }
        } catch (err) {
            handleError(err);
        }
    };

    // Send message and get AI response
    const getResponse = async () => {
        if (!message.trim()) return;

        const currentMessage = message;
        setMessage("");

        setMessages((prev) => [...prev, { role: "user", content: currentMessage }]);
        setLoading(true);

        try {
            const data = await sendMessage(currentMessage, chatId);

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

    // Delete a chat
    const deleteChat = async (id) => {
        try {
            await deleteConversation(id);
            newChat();
            await loadAllChats();
        } catch (err) {
            handleError(err);
        }
    };

    // Reset for new chat
    const newChat = () => {
        setMessages([]);
        setMessage("");
        setError(null);
        navigate("/chat");
    };

    useEffect(() => {
        loadAllChats();
    }, []);

    useEffect(() => {
        if (chatId) {
            loadConversation(chatId);
        } else {
            setMessages([]);
        }
    }, [chatId]);

    return (
        <ChatsContext.Provider
            value={{
                chatId,
                message,
                setMessage,
                messages,
                setMessages,
                titles,
                loading,
                error,
                closeErrorBar,
                closeError,
                isSidebarOpen,
                toggleSidebar,
                loadAllChats,
                loadConversation,
                getResponse,
                deleteChat,
                newChat
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
};

export const useChats = () => {
    const context = useContext(ChatsContext);
    if (!context) {
        throw new Error("useChats must be used within a ChatsProvider");
    }
    return context;
};