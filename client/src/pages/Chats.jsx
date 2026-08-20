import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { BiCommentAdd } from 'react-icons/bi';

import { useChat } from '../hooks/useChat.jsx';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import Multimodels from '../components/Multimodels';
import '../style/Chats.css';

const Chats = () => {
    const { chatId } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const {
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
    } = useChat();

    // Load chat titles on mount
    useEffect(() => {
        loadAllChats();
    }, [loadAllChats]);

    // Load conversation when URL parameter changes
    useEffect(() => {
        if (chatId) {
            loadConversation(chatId);
        } else {
            setMessages([]);
        }
    }, [chatId, loadConversation, setMessages]);

    // Auto-scroll on new messages or loading
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleNewChat = () => {
        setIsSidebarOpen(false);
        startNewChat();
    };

    return (
        <div className="main-container">
            {/* Sidebar Component */}
            <ChatSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                titles={titles}
                activeChatId={chatId}
                onSelectChat={loadConversation}
                onNewChat={handleNewChat}
                onDeleteChat={deleteChatById}
            />

            {/* Main Chat Viewport */}
            <main className="chat-viewport">
                <header className="chat-header">
                    <div className="mobile-model">
                        <Multimodels />
                    </div>

                    <div className="menu-models mobile-mode">
                        <div className="left-menu">
                            <button
                                className="toggle-sidebar-btn"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                            >
                                <HiOutlineMenu size={22} />
                            </button>

                            <button className="btn" onClick={handleNewChat}>
                                <BiCommentAdd size={23} />
                            </button>
                            <Multimodels />
                        </div>

                        <div className="right-menu">
                            <Link to="/profile">
                                <img
                                    src={localStorage.getItem('image') || 'qw.jpg'}
                                    alt="Profile"
                                    className="default"
                                />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Message Area Component */}
                <ChatMessages
                    messages={messages}
                    loading={loading}
                    error={error}
                    closeErrorBar={closeErrorBar}
                    onCloseError={() => setCloseErrorBar(!closeErrorBar)}
                    messagesEndRef={messagesEndRef}
                    isSidebarOpen={isSidebarOpen}

                    setIsSidebarOpen={setIsSidebarOpen}

                />

                {/* Input Bar Component */}
                <ChatInput
                    onSendMessage={(msg) => sendMessage(msg, chatId)}
                    disabled={loading}
                />
            </main>
        </div>
    );
};

export default Chats;