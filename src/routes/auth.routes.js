import { Router } from "express";
import { register, login, refreshToken, logout } from "../controllers/auth.controller.js";
import { zValidator } from "../middleware/zValidator.js";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";

const r = Router();
r.post("/register", zValidator(registerSchema), register);
r.post("/login", zValidator(loginSchema), login);
r.post("/refresh", refreshToken);
r.post("/logout", logout);
export default r;
