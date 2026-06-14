const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.user?.id?.toString() || req.ip,
  message: {
    success: false,
    message: 'Too many chat requests. Please try again after 1 minute.',
  },
});

module.exports = {
  chatRateLimiter,
};
