import express from "express";
import { Chat, getAllConversation, getConversation, setConversation, deleteConversation } from "../controllers/chat.controller.js";
import authVerify from "../middleware/authToken.middleware.js";

const chatRoute = express.Router();

// test route
// api/chat/stream
chatRoute.post("/chat/stream", Chat);


// api/chat/conversation
chatRoute.post("/chat/conversation", authVerify, setConversation)


// api/chat/conversation/:chatId
chatRoute.get("/chat/conversation/:chatId", authVerify, getConversation)


// api/chat/conversation/:chatId
chatRoute.delete("/chat/conversation/:chatId", authVerify, deleteConversation)


// api/chat/all-conversation
chatRoute.get("/chat/all-conversation", authVerify, getAllConversation)

export {
    chatRoute
}