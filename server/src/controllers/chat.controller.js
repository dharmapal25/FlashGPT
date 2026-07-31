

const testChat = (req, res) => {
    const { message } = req.body
}


chat = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const { message, chatId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error("Groq Error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong with AI chat",
            error: error.message,
        });
    }
};

export {
    testChat
};
