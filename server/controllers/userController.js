import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function listUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

export async function createUser(req, res) {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json(
    { message: "Name, email, password and role are required" }
  );

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const user = await User.create({
    name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), role, department
  });

  res.status(201).json(
    { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
  );
}
