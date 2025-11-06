import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { env } from "../config/config.js";
import createError from "http-errors";

// Helper: generate tokens
const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "10m",
    algorithm: "HS256",
    audience: "api",
    issuer: "express-api-starter",
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  return { accessToken, refreshToken };
};

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email }).lean();
    if (existing) throw createError(400, "Email already registered");

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken,
    });
  } catch (err) {
    if (err.code === 11000)
      return next(createError(400, "Email already registered"));
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password").lean(false);
    if (!user || !(await user.matchPassword(password)))
      throw createError(401, "Invalid credentials");

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// Refresh
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw createError(401, "Missing refresh token");

    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) throw createError(401, "User not found");

    const { accessToken, refreshToken: newRefresh } = generateTokens(user);

    res.cookie("refreshToken", newRefresh, {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
