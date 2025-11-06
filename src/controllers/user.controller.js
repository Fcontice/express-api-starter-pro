import User from "../models/user.model.js";
import createError from "http-errors";

// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email role").lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get self
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("name email role")
      .lean();
    if (!user) throw createError(404, "User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const updates = (({ name, role }) => ({ name, role }))(req.body);
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      projection: "name email role",
    }).lean();

    if (!user) throw createError(404, "User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) throw createError(404, "User not found");
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
