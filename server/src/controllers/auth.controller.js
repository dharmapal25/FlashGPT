import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const googleCallback = (req, res) => {


  const token = jwt.sign(
    {
      id: req.user._id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/chat`);
};


export const profile = async (req, res) => {

  const user = req.user;

  try {

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let userData = await User.findById(user.id);
    const TotalChats = await Conversation.find({ userId: user.id }).populate("userId");

    res.json({
      success: true,
      user: userData,
      TotalChats 
    });


  } catch (err) {

    res.json({
      success: false,
      message: "Something went wrong"
    })
  }
}


export const checkAuth = (req, res) => {

  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.json({
    success: true,
    user
  });



}


export const logout = (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logout Success",
  });

};