import AiResponse from "../utils/aireponse.js";


const Chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Message is required.",
            });
        }

        const response = await AiResponse(message);

        return res.status(200).json({
            success: true,
            data: response,
        });

    } catch (err) {
        console.error("Groq Error:", err);

        return res.status(500).json({
            success: false,
            error: err.message || "Something went wrong.",
        });
    }
};

export { Chat };