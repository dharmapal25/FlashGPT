import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Chats = () => {
    const [message, setMessage] = useState("");
    const [chatId, setChatId] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();

    const getResponse = async () => {
        if (!message.trim()) return;

        // User message 
        const userMessage = {
            role: "user",
            content: message,
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentMessage = message;
        setMessage("");
        setLoading(true);

        try {
            const { data } = await API.post("/chat/conversation", {
                message: currentMessage,
                chatId,
            });

            console.log(data);

            if (data.success) {
                // after first request chatId save
                if (!chatId) {
                    setChatId(data.chatId);
                }

                // Assistant last message 
                const assistantMessage = data.response.messages[data.response.messages.length - 1];

                setMessages((prev) => [...prev, assistantMessage]);

                
                navigate(`/chat/${data.chatId}`)



            }
        } catch (error) {
            console.log(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: "700px", margin: "30px auto" }}>
            <h2>FlashGPT</h2>

            <div
                style={{
                    border: "1px solid gray",
                    padding: "20px",
                    height: "500px",
                    overflowY: "auto",
                    marginBottom: "20px",
                }}
            >
                {messages.map((msg, index) => (
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
                ))}

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