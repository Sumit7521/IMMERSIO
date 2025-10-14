// src/routes/avatar.route.js
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { createavatar, getavatar } from '../controllers/avatar.controller.js';

const router = express.Router();

// POST /api/avatar/save
router.post('/save', authMiddleware, createavatar);

// GET /api/avatar/get-avatar
router.get('/get-avatar', authMiddleware, getavatar);

// ✅ Default export for ES module
export default router;
