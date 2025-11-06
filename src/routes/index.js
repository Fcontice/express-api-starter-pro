import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import aiRoutes from "./ai.routes.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/ai", aiRoutes);
};
