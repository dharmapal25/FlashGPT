import express from "express";
import { testChat } from "../controllers/chat.controller";

const chatRoute = express.Router;


chatRoute.post("/chat/stream", testChat)

