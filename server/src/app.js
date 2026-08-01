import express from "express";
import cors from "cors";
import env from "./config/env.js";

import { chatRoute } from "./routes/chat.route.js";


const app = express();
app.use(express.json());

app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    })
);


app.use('/api', chatRoute)

export default app