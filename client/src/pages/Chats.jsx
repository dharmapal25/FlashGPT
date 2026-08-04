import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiMessageSquare } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { BiCommentAdd, BiPlus } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import "../style/Chats.css";
import { useAuth } from "../context/AuthContext";
import Multimodels from "../components/Multimodels";

const Chats = () => {
    const navigate = useNavigate();
    const { chatId } = useParams();

    let { user } = useAuth()
    console.log(user)
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef(null);

    const loadAllChats = async () => {
        try {
            const { data } = await API.get("/chat/all-conversation");
            if (data.success) {
                setTitles(data.chats);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadConversation = async (id) => {
        if (!id) return;
        try {
            const { data } = await API.get(`/chat/conversation/${id}`);
            if (data.success) {
                setMessages(data.messages);
                navigate(`/chat/${id}`);
            }
        } catch (err) {
            console.log(err);
        }
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

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const getResponse = async () => {
        if (!message.trim()) return;
        const currentMessage = message;
        setMessage("");
        setLoading(true);

        try {
            const { data } = await API.post("/chat/conversation", {
                message: currentMessage,
                chatId,
                model : localStorage.getItem("model")
            });

            if (data.success) {
                await loadAllChats();
                await loadConversation(data.chatId);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const newChat = () => {
        setMessages([]);
        setMessage("");
        navigate("/chat");
    };

    return (
        <div className="main-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>

                <div className="sidebar-header" style={{ flexDirection: !isSidebarOpen ? "column-reverse" : "" }} >

                    <button className="new-chat-btn" onClick={newChat}>
                        <span className="plus-icon">
                            {
                                (isSidebarOpen) ?

                                    <BiPlus size={20} />
                                    :
                                    <BiCommentAdd size={20} />
                            }
                        </span>
                        {isSidebarOpen && <span>New Chat</span>}
                    </button>


                    <button
                        className="toggle-sidebar-btn"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                                className={`chat-item ${chat._id === chatId ? "active" : ""}`}
                                onClick={() => loadConversation(chat._id)}
                            >
                                <span className="chat-icon"><FiMessageSquare /></span>
                                <span className="chat-title-text">{chat.title || "Untitled Chat"}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Profile Section at Bottom Left */}
                <div className="sidebar-footer">
                    <Link to={"/profile"} >
                        <div className="user-profile">
                            <div className="avatar">
                                {
                                    localStorage.getItem("image") && <img src={localStorage.getItem("image")} className="default" /> || <img src="qw.jpg" alt="deafult" className="default" />
                                }
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
                    {/* <h2>FlashGPT</h2> */}
                    <Multimodels />
                </header>

                <div className="messages-container">
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
                            <div className="message-avatar">
                            </div>
                            <div className="message-bubble markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="message-row ai-row">
                            {/* <div className="message-avatar">⚡</div> */}
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