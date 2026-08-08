import express from "express";
import { listUsers, createUser } from "../controllers/userController.js";
import { protect, allow } from "../middleware/auth.js";
const router = express.Router();
router.get("/", protect, allow("admin"), listUsers);
router.post("/", protect, allow("admin"), createUser);
export default router;
