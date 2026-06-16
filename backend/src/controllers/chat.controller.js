const Groq = require("groq-sdk");
const Chat = require("../models/chat.model");
const { getEmbedding } = require("../services/embedding");
const { searchMemories, storeMemory } = require("../services/Pinecone");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateGroqJson = async (prompt) => {
  const payload = {
    model: process.env.GROQ_AI_MODEL || "groq/compound",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    return await groq.chat.completions.create({
      ...payload,
      response_format: {
        type: "json_object",
      },
    });
  } catch (error) {
    const status = error.status || error.statusCode;
    if (status !== 400) throw error;

    console.warn("Groq JSON mode skipped:", error.message);
    return groq.chat.completions.create(payload);
  }
};

const parseAiJson = (rawText) => {
  const fallback = {
    save: false,
    memory: "",
    answer: rawText || "I could not generate a response.",
    nextQuestion: ""
  };

  if (!rawText) return fallback;

  const cleaned = rawText
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return { ...fallback, ...JSON.parse(cleaned) };
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;

    try {
      return { ...fallback, ...JSON.parse(jsonMatch[0]) };
    } catch {
      return fallback;
    }
  }
};

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

    let relevantData = "";

    try {
      const vector = await getEmbedding(message);
      const searchResults = await searchMemories(
        "users_memories",
        req.user._id || req.user.id,
        vector
      );

      relevantData = (searchResults.matches || [])
        .map((match) => match.metadata?.text)
        .filter(Boolean)
        .join("\n");
    } catch (memoryError) {
      console.error("Memory search skipped:", memoryError.message);
    }

    // context for the LLM (relevant data + user message)
    const context = `Relevant data:\n${relevantData}\n\n user message: ${message}`;


    let history = "";

    if (chatId) {
      const existingChat = await Chat.findById(chatId);

      if (existingChat) {
        history = existingChat.messages
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");
      }
    }

const prompt = `You are FlashGPT, a smart and friendly AI assistant.

CONTEXT:
- Previous Conversation: ${history || "None"}
- Known User Memories: ${context || "None"}
- User's Message: ${message}

YOUR TASKS:
1. ANSWER: Respond to the user's message clearly. Use markdown for code, lists, etc. 
   At the very end, add one short follow-up suggestion (e.g., "Want me to show a real example?" or "Should I explain X next?")

2. MEMORY: Check if the message reveals something worth remembering long-term:
   - YES: name, profession, goals, preferences, important events
   - NO: casual questions, one-off queries, greetings

Return ONLY raw valid JSON. No markdown. No explanation. No backticks:
{
  "save": true,
  "memory": "Concise fact to remember (empty string if save is false)",
  "answer": "Full helpful response here with markdown support, ending with a follow-up suggestion"
}`;

    const response = await generateGroqJson(prompt);

    const aiResponse = response.choices?.[0]?.message?.content || "No response";

    const aiResponseData = parseAiJson(aiResponse);
    let queryResponse = aiResponseData.answer;

    const userId = req.user._id || req.user.id;

    let chat;

    // If chatId is provided, update the existing chat, otherwise create a new one

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
            content: queryResponse,
          },
        ],
      });
    }

    if (aiResponseData.save && aiResponseData.memory) {
      try {
        const memoryEmbedding = await getEmbedding(aiResponseData.memory);
        await storeMemory(
          "users_memories",
          userId,
          `${chat._id}-${Date.now()}`,
          memoryEmbedding,
          aiResponseData.memory
        );
      } catch (memoryError) {
        console.error("Memory store skipped:", memoryError.message);
      }
    }

    res.status(200).json({
      success: true,
      response: queryResponse,
      chatId: chat._id,
      memorySaved: !!(aiResponseData.save && aiResponseData.memory),
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
