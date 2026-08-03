import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const Chats = () => {

    const navigate = useNavigate();
    const { chatId } = useParams();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);

    // ----------------------------
    // Load all conversations
    // ----------------------------

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


    // Load one conversation

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


    // First Load

    useEffect(() => {
        loadAllChats();
    }, []);


    // Refresh Support

    useEffect(() => {
        if (chatId) {
            loadConversation(chatId);

        } else {
            setMessages([]);
        }
    }, [chatId]);


    // Send Message

    const getResponse = async () => {

        if (!message.trim()) return;
        const currentMessage = message;
        setMessage("");
        setLoading(true);

        try {
            const { data } = await API.post("/chat/conversation", {
                message: currentMessage,
                chatId,
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



    // New Chat

    const newChat = () => {
        setMessages([]);
        setMessage("");

        navigate("/chat");
    };



    return (

        <div className="main-container" style={{ display: "flex", gap: "20px", }}>

            {/* Sidebar */}

            <div style={{
                width: "250px",
                borderRight: "1px solid gray",
                padding: "20px"
            }}>

                <button onClick={newChat}> + New Chat</button>

                <br />

                {

                    titles.map((chat) => (
                        <div key={chat._id}
                            onClick={() => loadConversation(chat._id)}
                            style={{
                                cursor: "pointer",
                                padding: "10px",
                                borderBottom: "1px solid #444",
                            }}
                        >{chat.title}</div>
                    ))

                }
            </div>


            {/* Chat */}

            <div style={{ width: "700px", color: "#afafaf", }}>
                <h2>FlashGPT</h2>

                <div style={{
                    border: "1px solid gray",
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                    marginBottom: "20px",
                }}>
                    {
                        messages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: "15px", textAlign: msg.role === "user" ? "right" : "left", }}>
                                <p>{msg.content}</p>
                            </div>
                        ))

                    }

                    {loading && <p>Thinking...</p>}

                </div>

                <input type="text"
                    placeholder="Ask something..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            getResponse();
                        }

                    }}
                    style={{ width: "100%", padding: "12px" }}
                />

            </div>
        </div>
    );
};

export default Chats;