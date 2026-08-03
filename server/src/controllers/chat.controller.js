import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
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


const setConversation = async (req, res) => {

    try {

        console.log("req.user : ", req.user)

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


        let history = "";

        if (chatId) {
            const existingChat = await Conversation.findById(chatId);

            if (existingChat) {
                history = existingChat.messages
                    .map((msg) => `${msg.role}: ${msg.content}`)
                    .join("\n");
            }
        }

        const prompt = `
You are FlashGPT, a smart and friendly AI assistant.
CONTEXT:
- Previous Conversation: ${history || "None"}
- User's current Message: ${message}
YOUR TASKS:
1. ANSWER: Respond to the user's message clearly. Use markdown for code, lists, etc. 
   At the very end, add one short follow-up suggestion (e.g., "Want me to show a real example?" or "Should I explain X next?")
`;

        const response = await AiResponse(prompt);
        let queryResponse = response || "No response";


        const userId = req.user.id;
        console.log("response : ", response)
        let chat;

        // If chatId is provided, update the existing chat, otherwise create a new one

        if (chatId) {
            chat = await Conversation.findByIdAndUpdate(
                chatId,
                {
                    $push: {
                        messages: [
                            {
                                role: "user",
                                content: message,
                            },
                            {
                                role: "assistant",
                                content: queryResponse,
                            },
                        ],
                    },
                },
                { new: true }
            );
        }

        if (!chat) {

            // new chat
            chat = await Conversation.create({
                userId,
                title:
                    message.substring(0, 50) +
                    (message.length > 50 ? "..." : ""),

                messages: [
                    {
                        role: "user",
                        content: message,
                    },
                    {
                        role: "assistant",
                        content: queryResponse,
                    },
                ],
            });
        }

        res.status(200).json({
            success: true,
            response: chat,
            chatId: chat._id,
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


const getConversation = async (req, res) => {
    try {

        const { chatId } = req.params;

        const chatData = await Conversation.findById(chatId);

        if (!chatData) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        res.json({
            success: true,
            messages: chatData.messages,
            title: chatData.title
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


const getAllConversation = async (req, res) => {
    console.log(req.user.id)
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const AllChats = await Conversation.find({ userId: req.user.id })
            .populate("userId")
            .sort({ updatedAt: -1 }); // Change to createdAt if preferred

        res.json({
            success: true,
            chats: AllChats
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong with AI chat",
            error: err.message,
        });
    }
}


export { Chat, setConversation, getConversation, getAllConversation };