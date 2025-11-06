import { Router } from "express";
import { me, adminOnly } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const r = Router();
r.get("/me", requireAuth, me);
r.get("/admin", requireAuth, authorize(["admin"]), adminOnly);
export default r;
