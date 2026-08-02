import express from "express";
import passport from "../config/passport.js";
import { checkAuth, googleCallback, logout, profile } from "../controllers/auth.controller.js";
import authVerify from "../middleware/authToken.middleware.js";

const router = express.Router();

// @route GET /api/auth/google
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
})
);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl}/login`,
}),
    googleCallback
);

router.get("/profile", authVerify, profile);

router.get("/protected", authVerify, checkAuth);

router.get("/logout", logout);

export default router;