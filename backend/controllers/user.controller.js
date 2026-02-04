import User from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// id check
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles, image } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      roles: roles && roles.length ? roles : ["customer"],
      image: image || "",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating user" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching user" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const { firstName, lastName, email, password, roles, image } = req.body;
    const update = {
      firstName,
      lastName,
      email,
      roles,
      image,
    };

    Object.keys(update).forEach((key) => {
      if (update[key] === undefined) {
        delete update[key];
      }
    });

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      update.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting user" });
  }
};
