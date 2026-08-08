import express from "express";
import { protect, allow } from "../middleware/auth.js";
import { listVisitors, createVisitor, approveVisitor, rejectVisitor, checkIn, checkOut, cancelVisitor } from "../controllers/visitorController.js";

const router = express.Router();
router.get("/", protect, listVisitors);
router.post("/", protect, allow("receptionist"), createVisitor);
router.patch("/:id/approve", protect, allow("employee"), approveVisitor);
router.patch("/:id/reject", protect, allow("employee"), rejectVisitor);
router.patch("/:id/check-in", protect, allow("receptionist"), checkIn);
router.patch("/:id/check-out", protect, allow("receptionist"), checkOut);
router.patch("/:id/cancel", protect, allow("receptionist", "admin"), cancelVisitor);
export default router;
