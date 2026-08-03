import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    default: "New Chat"
  },

  bookmark: {
    type: Boolean,
    default: false
  },

  messages: [
    {
      role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
      },

      content: {
        type: String,
        required: true
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});


// TTL index to automatically delete chats after 30 days of inactivity
conversationSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation