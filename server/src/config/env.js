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

    GROQAI_MODEL: process.env.GROQAI_MODEL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,

    LLAMA_MODEL: process.env.LLAMA_MODEL,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
    OPENAI_MODEL_MINI: process.env.OPENAI_MODEL_MINI,
    QWEN_MODEL: process.env.QWEN_MODEL,

    GROQ_AI_CONTEXT_WINDOW : process.env.GROQ_AI_CONTEXT_WINDOW,

    // Authentication configuration
    JWT_SECRET: process.env.JWT_SECRET,

    // Google OAuth configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

};
console.log(env.PORT)

export default env;