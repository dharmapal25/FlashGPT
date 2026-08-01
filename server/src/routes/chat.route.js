import express from "express";
import { testChat } from "../controllers/chat.controller.js";

const chatRoute = express.Router();

// api/chat/stream
chatRoute.post("/chat/stream", testChat);


export {
    chatRoute
}