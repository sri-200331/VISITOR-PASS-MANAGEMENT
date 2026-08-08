import express from "express";
import { protect, allow } from "../middleware/auth.js";
import { reports } from "../controllers/reportController.js";
const router = express.Router();
router.get("/", protect, allow("admin"), reports);
export default router;
