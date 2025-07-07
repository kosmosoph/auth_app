// Implement User Registration

import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// User login
router.post('/login', loginUser)

export default router;