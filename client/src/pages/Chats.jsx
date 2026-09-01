import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HiOutlineMenu } from "react-icons/hi";
import { BiCommentAdd, BiPlus, BiX } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import gsap from "gsap";
import "../style/Chats.css";
import Multimodels from "../components/Multimodels";
import { useChats } from "../context/chatsContext";

const Chats = () => {
    const {
        chatId,
        message,
        setMessage,
        messages,
        titles,
        loading,
        error,
        closeErrorBar,
        closeError,
        isSidebarOpen,
        toggleSidebar,
        loadConversation,
        getResponse,
        deleteChat,
        newChat
    } = useChats();

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            // Smooth scroll using GSAP
            gsap.to(messagesContainerRef.current, {
                scrollTop: messagesContainerRef.current.scrollHeight,
                duration: 0.6,
                ease: "power2.inOut"
            });
        }
    }, [messages, loading]);

    // console.log("Messages : ",messages,message)

    return (
        <div className="main-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-header" style={{ flexDirection: !isSidebarOpen ? "column-reverse" : "" }}>
                    <button className="new-chat-btn" onClick={newChat}>
                        <span className="plus-icon">
                            {isSidebarOpen ? <BiPlus size={20} /> : <BiCommentAdd size={20} />}
                        </span>
                        {isSidebarOpen && <span>New Chat</span>}
                    </button>

                    <button
                        className="toggle-sidebar-btn"
                        onClick={toggleSidebar}
                        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <HiOutlineMenu size={20} />
                    </button>
                </div>

                {isSidebarOpen && (
                    <div className="chat-history-list">
                        {titles.map((chat) => (
                            <div
                                key={chat._id}
                                title={chat.title}
                                className={`chat-item ${chat._id === chatId ? "active" : ""}`}
                                onClick={() => loadConversation(chat._id)}
                            >
                                <span className="chat-title-text">{chat.title || "Untitled Chat"}</span>
                                <AiOutlineDelete
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat._id);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Profile Section */}
                <div className="sidebar-footer">
                    <Link to="/profile">
                        <div className="user-profile">
                            <div className="avatar">
                                <img
                                    src={localStorage.getItem("image") || "qw.jpg"}
                                    alt="profile"
                                    className="default"
                                />
                            </div>
                            {isSidebarOpen && (
                                <div className="user-info">
                                    <span className="user-name">Profile</span>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="chat-viewport">
                <header className="chat-header">
                    <div className="mobile-model">
                        <Multimodels />
                    </div>

                    <div className="menu-models mobile-mode">
                        <div className="left-menu">
                            <button
                                className="toggle-sidebar-btn"
                                onClick={toggleSidebar}
                                title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                <HiOutlineMenu size={22} />
                            </button>

                            <button className="btn" onClick={newChat}>
                                <BiCommentAdd size={23} />
                            </button>
                            <Multimodels />
                        </div>

                        <div className="right-menu">
                            <Link to="/profile">
                                <img
                                    src={localStorage.getItem("image") || "qw.jpg"}
                                    alt="profile"
                                    className="default"
                                />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="messages-container">
                    {error && (
                        <div className={`error-message ${!closeErrorBar ? "error-box" : ""}`}>
                            <p>{error}</p>
                            <button onClick={closeError}>
                                <BiX size={20} fill="#ccc" style={{ cursor: "pointer" }} />
                            </button>
                        </div>
                    )}

                    {messages.length === 0 && !loading && (
                        <div className="empty-state">
                            <h3>What can I help with today?</h3>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        
                        <div
                            key={index}
                            className={`message-row ${msg.role === "user" ? "user-row" : "ai-row"}`}
                        >
                            <div className="message-avatar"></div>
                            <div className="message-bubble markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="message-row ai-row">
                            <div className="message-bubble loading-bubble">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-wrapper">
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Message Flashpilot..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    getResponse();
                                }
                            }}
                        />
                        <button className="send-btn" onClick={getResponse} disabled={!message.trim()}>
                            <IoIosSend size={19} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chats;