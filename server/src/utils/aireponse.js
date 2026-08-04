import env from "../config/env.js";
import groq from "../config/groq.js";
import chooseModel from "./setModel.js";

const AiResponse = async (message, aiModel) => {
    
    const response = await groq.chat.completions.create({
        model: aiModel || env.OPENAI_MODEL,
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
        //   temperature: 0.7,  // creative answer 0, 0.2 .... 0.7, 1.0 +
        max_tokens: Number(env.GROQ_AI_CONTEXT_WINDOW)
    });

    return response.choices[0].message.content;
}

export default AiResponse;