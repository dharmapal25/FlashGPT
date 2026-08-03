import express from "express";
import { Chat, getAllConversation, getConversation, setConversation } from "../controllers/chat.controller.js";
import authVerify from "../middleware/authToken.middleware.js";

const chatRoute = express.Router();

// api/chat/stream
chatRoute.post("/chat/stream", Chat);


// api/chat/conversation
chatRoute.post("/chat/conversation", authVerify, setConversation)


// api/chat/conversation/:chatId
chatRoute.get("/chat/conversation/:chatId", authVerify, getConversation)


// api/chat/all-conversation
chatRoute.get("/chat/all-conversation", authVerify, getAllConversation)

export {
    chatRoute
}