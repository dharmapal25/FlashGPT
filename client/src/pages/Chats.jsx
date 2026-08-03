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

    // Refresh support

    useEffect(() => {

        if (chatId) {
            localStorage.setItem("chatId", chatId);
            loadConversation(chatId);

        } else {
            const savedId = localStorage.getItem("chatId");

            if (savedId) {
                navigate(`/chat/${savedId}`, { replace: true });
            }
        }

    }, [chatId]);


    // All chats

    useEffect(() => {
        API.get("/chat/all-conversation",{withCredentials : true})
            .then((res) => {
                console.log(res.data)
                // setTitles(res.data)
            }).catch((err) => {
                console.log("ERROR", err)
            })
    }, [])


    // Load conversation

    const loadConversation = async (id) => {

        try {

            const { data } = await API.get(`/chat/conversation/${id}`);
            if (data.success) {
                setMessages(data.messages);
                setTitles(data.title);
            }

        } catch (err) {
            console.log(err);
        }
    };

    console.log(titles)

    // -----------------------
    // Send Message
    // -----------------------

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
            console.log("data : ", data.response.title)
            if (data.success) {

                // New chat
                if (!chatId) {

                    localStorage.setItem("chatId", data.chatId);
                    navigate(`/chat/${data.chatId}`);

                } else {
                    loadConversation(chatId);
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    };


    // New Chat

    const newChat = () => {

        localStorage.removeItem("chatId");
        setMessages([]);
        setMessage("");
        navigate("/chat");

    };



    return (

        <div style={{ width: "700px", margin: "30px auto", color: "#afafaf" }}>
            <h2>FlashGPT</h2>

            <button onClick={newChat}>
                New Chat
            </button>

            <div
                style={{
                    border: "1px solid gray",
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                    marginBottom: "20px",
                }}
            >
                {
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: "15px",
                                textAlign: msg.role === "user" ? "right" : "left",
                            }}
                        >
                            <b>{msg.role === "user" ? "You" : "FlashGPT"}</b>
                            <p>{msg.content}</p>
                        </div>
                    ))
                }

                {loading && <p>Thinking...</p>}

            </div>

            <input
                type="text"
                placeholder="Ask something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        getResponse();
                    }
                }}

                style={{
                    width: "100%",
                    padding: "12px",
                }}
            />
        </div>

    );
};

export default Chats;