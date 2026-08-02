import jwt from "jsonwebtoken";

export const googleCallback = (req, res) => {

  const token = jwt.sign(
    {
      id: req.user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.redirect("/profile");
};

export const profile = (req, res) => {

  res.json({
    success: true,
    user: req.user,
  });

};

export const logout = (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logout Success",
  });

};