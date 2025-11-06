import jwt from "jsonwebtoken";
import createError from "http-errors";

export const requireAuth = (req, _res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
  if (!token) return next(createError(401, "Unauthorized"));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(createError(401, "Invalid or expired token"));
  }
};
