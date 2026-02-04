import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");

    // Read from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ecommerce.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: adminEmail,
      password: hashedPassword,
      roles: ["admin"],
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
