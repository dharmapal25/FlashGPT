import express from "express";
import { Chat, setConversation } from "../controllers/chat.controller.js";

const chatRoute = express.Router();

// api/chat/stream
chatRoute.post("/chat/stream", Chat);


chatRoute.post("/chat/conversation",setConversation)


export {
    chatRoute
}