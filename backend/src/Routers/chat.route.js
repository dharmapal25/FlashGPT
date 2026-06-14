const express = require('express');
const { chat, getChats, getChat, deleteChat, updateChatTitle, toggleBookmark } = require('../controllers/chat.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');
const { chatRateLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

router.use(isLoggedIn);

router.post('/chat', chatRateLimiter, chat);

router.get('/chats', chatRateLimiter, getChats);

router.get('/chat/:chatId', chatRateLimiter, getChat);

router.delete('/chat/:chatId', chatRateLimiter, deleteChat);

router.put('/chat/:chatId/title', chatRateLimiter, updateChatTitle);

router.put('/chat/:chatId/bookmark', chatRateLimiter, toggleBookmark);

module.exports = router;
