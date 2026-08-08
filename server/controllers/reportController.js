import Visitor from "../models/Visitor.js";

export async function reports(req, res) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const from = req.query.from || today;
  const to = req.query.to || today;

  const rows = await Visitor.find({ visitDate: { $gte: from, $lte: to } })
    .populate("employee", "name")
    .sort({ visitDate: 1, expectedArrival: 1 });

  const stats = {
    total: rows.length,
    pending: rows.filter(x => x.status === "pending").length,
    approved: rows.filter(x => x.status === "approved").length,
    checkedIn: rows.filter(x => x.status === "checked-in").length,
    checkedOut: rows.filter(x => x.status === "checked-out").length,
    rejected: rows.filter(x => x.status === "rejected").length,
    cancelled: rows.filter(x => x.status === "cancelled").length
  };

  res.json({ stats, rows });
}
