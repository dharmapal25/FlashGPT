import express from "express";
import { chatRoute } from "./routes/chat.route.js";
const app = express();
app.use(express.json());

app.use('/api',chatRoute)

export default app