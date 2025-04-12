import jwt from "jsonwebtoken";

export const generateCookie = (res, user) => {
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.id }, secretKey, {
    expiresIn: "1h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
    // secure: true,
    // sameSite: "None",
  });
};
