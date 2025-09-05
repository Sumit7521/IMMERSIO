const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const { authMiddleware, authorizeRoles } = require("../middlewares/auth.middleware");

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

//logout
router.get("/logout", logout )

module.exports = router;