import Visitor from "../models/Visitor.js";
import User from "../models/User.js";

export async function dashboard(req, res) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const base = req.user.role === "employee" ? { employee: req.user._id } : {};

  const [pending, todayVisitors, inside, employees, scheduled] = await Promise.all([
    Visitor.countDocuments({ ...base, status: "pending" }),
    Visitor.countDocuments({ ...base, visitDate: today, status: { $nin: ["cancelled", "rejected"] } }),
    Visitor.countDocuments({ ...base, status: "checked-in" }),
    User.countDocuments({ role: "employee", active: true }),
    Visitor.countDocuments({ ...base, visitDate: { $gte: today }, status: "approved" })
  ]);

  res.json({ pending, todayVisitors, inside, employees, scheduled });
}
