import jwt from "jsonwebtoken";
import env from "../config/env.js";

const authVerify = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    req.user = decoded;

    next();
    
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authVerify;