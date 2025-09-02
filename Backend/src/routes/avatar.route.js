const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { createavatar, getavatar } = require('../controllers/avatar.controller');

// POST /api/avatar/save
router.post('/save', authMiddleware, createavatar);

// GET /api/avatar/get-avatar
router.get('/get-avatar', authMiddleware, getavatar);

module.exports = router;
