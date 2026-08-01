import express from "express";
import Groq from "groq-sdk";
import env from "../config/env.js";
// import env from "../config/env";

const router = express.Router();

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

router.get("/", async (req, res) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;