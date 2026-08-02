import dotenv from "dotenv";
dotenv.config();

const env = {

    // Server configuration
    PORT: process.env.PORT,
    FRONTEND_URL : process.env.FRONTEND_URL,

    // Database configuration
    MONGO_URI: process.env.MONGO_URI,

    // Services & LLM APIs
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_AI_MODEL_1: process.env.GROQ_AI_MODEL_1,
    GROQ_AI_MODEL_2: process.env.GROQ_AI_MODEL_2,

    GROQ_AI_MODEL_3: process.env.GROQ_AI_MODEL_3,
    GROQ_AI_MODEL_4: process.env.GROQ_AI_MODEL_4,

    // Authentication configuration
    JWT_SECRET: process.env.JWT_SECRET,

    // Google OAuth configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

};
console.log(env.PORT)

export default env;