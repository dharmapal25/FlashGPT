import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import { chatRoute } from "./routes/chat.route.js";
import authRoutes from "./routes/auth.routes.js";
import passport from "passport";
import connectDB from "./config/mongo.js";


const app = express();

app.use(express.json());
app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(cookieParser());

app.use(passport.initialize());

connectDB();

app.use("/api/auth", authRoutes);



app.use('/api', chatRoute)

export default app