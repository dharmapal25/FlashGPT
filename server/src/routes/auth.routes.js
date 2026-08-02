import express from "express";
import passport from "../config/passport.js";
import { googleCallback, logout, profile } from "../controllers/auth.controller.js";
import authVerify from "../middleware/authToken.middleware.js";

const router = express.Router();

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
})
);

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "/failed",
}),
    googleCallback
);

router.get("/profile", authVerify, profile);

router.get("/logout", logout);

export default router;