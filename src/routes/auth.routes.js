import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  noopSchema,
} from "../validation/auth.schema.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @body { name, email, password }
 */
router.post("/register", validate(registerSchema), register);

/**
 * @route POST /api/auth/login
 * @body { email, password }
 */
router.post("/login", validate(loginSchema), login);

/**
 * @route POST /api/auth/refresh
 * no body; uses refreshToken cookie
 */
router.post("/refresh", validate(noopSchema), refreshToken);

/**
 * @route POST /api/auth/logout
 * clears cookies
 */
router.post("/logout", validate(noopSchema), logout);

export default router;
