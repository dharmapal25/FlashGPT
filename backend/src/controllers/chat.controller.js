const { GoogleGenAI } = require("@google/genai");
const Chat = require("../models/chat.model");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

exports.chat = async (req, res) => {
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

    let history = "";

    if (chatId) {
      const existingChat = await Chat.findById(chatId);

      if (existingChat) {
        history = existingChat.messages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");
      }
    }

    const prompt = `
Previous Conversation:

${history}

Current User Message:

${message}
`;

    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL,
      contents: prompt,
    });

    const aiResponse = response.text || "No response";

    const userId = req.user._id || req.user.id;

    let chat;

    if (chatId) {
      chat = await Chat.findByIdAndUpdate(
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
                content: aiResponse,
              },
            ],
          },
        },
        { new: true }
      );
    } else {
      chat = await Chat.create({
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
            content: aiResponse,
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      response: aiResponse,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong with AI chat",
      error: error.message,
    });
  }
};

exports.getChats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const userId = req.user._id || req.user.id;
    const chats = await Chat.find({ userId: userId })
      .select('_id title bookmark createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
    });
  }
};

exports.getChat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { chatId } = req.params;
    const userId = req.user._id || req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat',
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { chatId } = req.params;
    const userId = req.user._id || req.user.id;

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.json({
      success: true,
      message: 'Chat deleted',
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
    });
  }
};

exports.updateChatTitle = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user._id || req.user.id;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: userId },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error updating chat title:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat title',
    });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { chatId } = req.params;
    const userId = req.user._id || req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    chat.bookmark = !chat.bookmark;
    await chat.save();

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle bookmark',
    });
  }
};
