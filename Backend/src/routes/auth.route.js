// src/routes/auth.route.js
import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===== Public routes =====
router.post("/register", register);
router.post("/login", login);

// ===== Protected routes examples =====
// Any logged-in user
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Only admin
router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Admin + Manager
router.get("/manage", authMiddleware, authorizeRoles("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome Manager/Admin!" });
});

// Logout
router.get("/logout", logout);

// ✅ Default export for ES module compatibility
export default router;
