import groq from "../config/groq.js"


const testChat = async (req, res) => {
    try {
        const { message } = req.body;

        // Validation
        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Message is required.",
            });
        }

        const response = await groq.chat.completions.create({
            model: process.env.GROQ_AI_MODEL_2,
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            //   temperature: 0.7,  // creative answer 0, 0.2 .... 0.7, 1.0 +
              max_tokens: 2000, // context window
        });

        return res.status(200).json({
            success: true,
            data: response.choices[0].message.content,
        });
    } catch (err) {
        console.error("Groq Error:", err);

        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong.",
        });
    }
};

export { testChat };