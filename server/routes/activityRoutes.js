import express from "express";
import Activity from "../models/Activity.js";
import { protect, allow } from "../middleware/auth.js";
const router = express.Router();
router.get("/", protect, allow("admin"), async (req, res) => {
  const rows = await Activity.find().populate("visitor", "name visitDate").populate("performedBy", "name role").sort({ createdAt: -1 }).limit(250);
  
  res.json(rows);
});
export default router;
