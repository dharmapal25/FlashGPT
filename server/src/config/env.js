import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT,

    FRONTEND_URL : process.env.FRONTEND_URL,


    MONGO_URI: process.env.MONGO_URI,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_AI_MODEL_1: process.env.GROQ_AI_MODEL_1,
    GROQ_AI_MODEL_2: process.env.GROQ_AI_MODEL_2,

    GROQ_AI_MODEL_3: process.env.GROQ_AI_MODEL_3,
    GROQ_AI_MODEL_4: process.env.GROQ_AI_MODEL_4,

    JWT_SECRET: process.env.JWT_SECRET,


};
console.log(env.PORT)

export default env;