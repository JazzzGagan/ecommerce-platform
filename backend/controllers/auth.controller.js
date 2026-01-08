import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import JWT_SECRET_KEY from "../config/constants.js";

//console.log(jwt);
const register = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    console.log(req.body);

    const { email, password, image, ...remaining } = req.body;

    // check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Create user
    await User.create({
      ...remaining,
      email,
      password: hashPassword,
      image: req?.file?.filename || image || "",
    });

    res.status(201).json({
      message: "User Successfully sign-up",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials!",
      });
    }

    // check password
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      JWT_SECRET_KEY,
      { expiresIn: "20d" }
    );

    // set cookie expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10);

    // set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: expiresAt,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Successfully signed in",
      token,
      user: userWithoutPassword,
      expiresAt,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
  });

  res.status(200).json({
    message: "User logout successfully",
  });
};

export { register, login, logOut };
