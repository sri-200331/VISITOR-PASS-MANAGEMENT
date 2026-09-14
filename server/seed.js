import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

try {
  console.log("Connecting to MongoDB...");
  await connectDB();

  const accounts = [
    { name: "Aarav Admin", email: "admin@visitorpass.com", password: "Admin@123", role: "admin", department: "Administration" },
    { name: "Maya Reception", email: "reception@visitorpass.com", password: "Reception@123", role: "receptionist", department: "Front Desk" },
    { name: "Arjun Kumar", email: "employee@visitorpass.com", password: "Employee@123", role: "employee", department: "Engineering" },
    { name: "Priya Menon", email: "priya@visitorpass.com", password: "Employee@123", role: "employee", department: "Finance" },
    { name: "Rahul Shah", email: "rahul@visitorpass.com", password: "Employee@123", role: "employee", department: "Sales" }
  ];

  for (const item of accounts) {
    const hashedPassword = await bcrypt.hash(item.password, 10);
    const existing = await User.findOne({ email: item.email });
    if (!existing) {
      await User.create({ ...item, password: hashedPassword });
      console.log(`Created user: ${item.email}`);
    } else {
      // Update existing user password and active status
      existing.password = hashedPassword;
      existing.active = true;
      await existing.save();
      console.log(`Updated existing user: ${item.email}`);
    }
  }

  console.log("Seed successfully completed!");
  process.exit(0);
} catch (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
