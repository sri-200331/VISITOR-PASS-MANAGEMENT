import express from "express";
import { protect } from "../middleware/auth.js";
import { dashboard } from "../controllers/dashboardController.js";
const router = express.Router();
router.get("/", protect, dashboard);
export default router;
