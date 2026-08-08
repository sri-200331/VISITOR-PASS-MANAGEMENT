import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import { logActivity } from "../utils/activity.js";

function dateOnly(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
}

function timeOnly(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false
  }).format(date);
}

function validDateAndTime(visitDate, expectedArrival) {
  const today = dateOnly();
  if (visitDate < today) return "Visit date cannot be earlier than today";
  if (visitDate === today && expectedArrival < timeOnly()) return "Expected arrival cannot be earlier than the current time";
  return null;
}

export async function listVisitors(req, res) {
  const { search = "", status = "", date = "" } = req.query;
  const query = {};
  if (status) query.status = status;
  if (date) query.visitDate = date;

  const visitors = await Visitor.find(query)
    .populate("employee", "name department")
    .populate("createdBy", "name")
    .sort({ visitDate: -1, expectedArrival: -1 });

  const term = search.toLowerCase();
  const filtered = term
    ? visitors.filter(v =>
        v.name.toLowerCase().includes(term) ||
        v.phone.toLowerCase().includes(term) ||
        v.employee?.name?.toLowerCase().includes(term))
    : visitors;

  res.json(filtered);
}

export async function createVisitor(req, res) {
  const { name, email, phone, company, employee, visitDate, expectedArrival, purpose } = req.body;
  if (!name || !phone || !employee || !visitDate || !expectedArrival || !purpose) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const dateError = validDateAndTime(visitDate, expectedArrival);
  if (dateError) return res.status(400).json({ message: dateError });

  const active = await Visitor.findOne({
    phone,
    status: { $in: ["pending", "approved", "checked-in"] }
  });
  if (active) return res.status(409).json({ message: "This visitor already has an active visit" });

  const duplicate = await Visitor.findOne({ phone, visitDate });
  if (duplicate) return res.status(409).json(
    { message: "Duplicate visitor registration for the same date is not allowed" });

  const employeeUser = await User.findById(employee);
  if (!employeeUser || employeeUser.role !== "employee") return res.status(400).json(
    { message: "Select a valid employee" });

  const pendingCount = await Visitor.countDocuments({ employee, status: "pending" });
  if (pendingCount >= 3) return res.status(400).json(
    { message: "This employee already has 3 pending visitor requests" });

  const visitor = await Visitor.create({
    name, email, phone, company, employee, visitDate, expectedArrival, purpose, createdBy: req.user._id
  });
  await logActivity(visitor._id, "Created", req.user._id, "Visitor request registered");
  res.status(201).json(await Visitor.findById(visitor._id).populate("employee", "name department"));
}

export async function approveVisitor(req, res) {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  if (visitor.employee.toString() !== req.user._id.toString()) return res.status(403).json(
    { message: "You can only review requests assigned to you" });
  if (visitor.status !== "pending") return res.status(400).json(
    { message: "Only pending requests can be approved" });

  visitor.status = "approved";
  visitor.remarks = req.body.remarks || visitor.remarks;
  await visitor.save();
  await logActivity(visitor._id, "Approved", req.user._id, visitor.remarks);
  res.json(visitor);
}

export async function rejectVisitor(req, res) {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  if (visitor.employee.toString() !== req.user._id.toString()) return res.status(403).json(
    { message: "You can only review requests assigned to you" });
  if (visitor.status !== "pending") return res.status(400).json(
    { message: "Only pending requests can be rejected" });

  visitor.status = "rejected";
  visitor.remarks = req.body.remarks || "Rejected by employee";
  await visitor.save();
  await logActivity(visitor._id, "Rejected", req.user._id, visitor.remarks);
  res.json(visitor);
}

export async function checkIn(req, res) {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  if (visitor.status !== "approved") return res.status(400).json(
    { message: "Only approved visitors can be checked in" });

  visitor.status = "checked-in";
  visitor.checkedInAt = new Date();
  await visitor.save();
  await logActivity(visitor._id, "Checked In", req.user._id);
  res.json(visitor);
}

export async function checkOut(req, res) {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  if (visitor.status !== "checked-in" || !visitor.checkedInAt) return res.status(400).json(
    { message: "Visitor is not currently checked in" });

  const now = new Date();
  if (now <= visitor.checkedInAt) return res.status(400).json(
    { message: "Check-out time must be later than check-in time" });

  visitor.status = "checked-out";
  visitor.checkedOutAt = now;
  await visitor.save();
  await logActivity(visitor._id, "Checked Out", req.user._id);
  res.json(visitor);
}

export async function cancelVisitor(req, res) {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Visitor not found" });
  if (!["pending", "approved"].includes(visitor.status)) return res.status(400).json(
    { message: "Only pending or approved visits can be cancelled" });

  visitor.status = "cancelled";
  await visitor.save();
  await logActivity(visitor._id, "Cancelled", req.user._id);
  res.json(visitor);
}
