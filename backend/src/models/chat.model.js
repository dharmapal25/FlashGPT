const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
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

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;



// {
//   "_id": {
//     "$oid": "6a2a4a1defc488a57ef39e98"
//   },
//   "userId": {
//     "$oid": "6a22d8ec093063a57e9ff379"
//   },
//   "title": "hey",
//   "bookmark": false,

//   "messages": [
//     {
//       "role": "user",
//       "content": "python shortly explain",
//       "_id": {
//         "$oid": "6a2a4a4aefc488a57ef39ea7"
//       },
//       "createdAt": {
//         "$date": "2026-06-11T05:40:26.832Z"
//       }
//     },
//     {
//       "role": "assistant",
//       "content": "Python is a high-level, interpreted, general-purpose programming language known for its clear, readable syntax. It's widely used for web development, data science, AI, automation, and many other applications due to its versatility and extensive libraries.",
//       "_id": {
//         "$oid": "6a2a4a4aefc488a57ef39ea8"
//       },
//       "createdAt": {
//         "$date": "2026-06-11T05:40:26.832Z"
//       }
//     }
//   ],
//   "createdAt": {
//     "$date": "2026-06-11T05:39:41.573Z"
//   },
//   "updatedAt": {
//     "$date": "2026-06-11T05:40:26.832Z"
//   },
//   "__v": 0
// }