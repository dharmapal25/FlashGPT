import express from "express";
import { Chat } from "../controllers/chat.controller.js";

const chatRoute = express.Router();

// api/chat/stream
chatRoute.post("/chat/stream", Chat);


export {
    chatRoute
}