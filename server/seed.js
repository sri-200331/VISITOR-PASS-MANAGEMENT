import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

await connectDB();

const accounts = [
  { name: "Aarav Admin", email: "admin@visitorpass.com", password: "Admin@123", role: "admin", department: "Administration" },
  { name: "Maya Reception", email: "reception@visitorpass.com", password: "Reception@123", role: "receptionist", department: "Front Desk" },
  { name: "Arjun Kumar", email: "employee@visitorpass.com", password: "Employee@123", role: "employee", department: "Engineering" },
  { name: "Priya Menon", email: "priya@visitorpass.com", password: "Employee@123", role: "employee", department: "Finance" },
  { name: "Rahul Shah", email: "rahul@visitorpass.com", password: "Employee@123", role: "employee", department: "Sales" }
];

for (const item of accounts) {
  const exists = await User.findOne({ email: item.email });
  if (!exists) await User.create(
    { ...item, password: await bcrypt.hash(item.password, 10) });
}

console.log("Seed complete");
process.exit(0);
