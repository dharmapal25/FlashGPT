import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {

        res.status(429).json({
            success: false,
            message: "Too many requests. Please wait a minute."
        });
    }

});

export const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    // message: {
    //     message: "Too many AI requests. Please wait a minute."
    // },

    handler: (req, res) => {

        res.status(429).json({
            success: false,
            message: "Too many AI requests. Please wait a minute."
        });
    }

});