import express from "express";
import cors from "cors";
import env from "./config/env.js";

import { chatRoute } from "./routes/chat.route.js";
import router from "./routes/test.route.js";


const app = express();
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true,
    })
);

app.use("/api/test", router);

app.use('/api', chatRoute)

export default app