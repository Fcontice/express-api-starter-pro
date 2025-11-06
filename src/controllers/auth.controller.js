import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { signAccess, signRefresh } from "../utils/tokens.js";
import { sendAuthCookies } from "../utils/sendCookie.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email }).lean();
    if (exists) throw createError(400, "Email already registered");
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const access = signAccess({ id: user._id, role: user.role });
    const refresh = signRefresh({ id: user._id });
    sendAuthCookies(res, access, refresh);
    res.status(201).json({ id: user._id, name, email, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) throw createError(400, "Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw createError(400, "Invalid credentials");
    const access = signAccess({ id: user._id, role: user.role });
    const refresh = signRefresh({ id: user._id });
    sendAuthCookies(res, access, refresh);
    res.json({ id: user._id, name: user.name, email, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw createError(401, "Missing refresh token");
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id).select("role").lean();
    if (!user) throw createError(401, "User not found");
    const access = signAccess({ id: user._id, role: user.role });
    res.cookie("accessToken", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ ok: true });
  } catch (err) {
    next(createError(401, "Invalid refresh token"));
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
