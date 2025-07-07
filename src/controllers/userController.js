import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/User.js";

config();

// register new user controller
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  //checking if all data are send in request body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //TODO: checking if user already exists in DB
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await User.createUser(name, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // MySQL code for duplicated entry
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already in use" });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // TODO: check if user already exists in DB
    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (isMatch) {
        // Generate JWT token
        const accessToken = jwt.sign(
          {
            user: {
              username: existingUser.name,
              email: existingUser.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
          {
            user: {
              username: existingUser.name,
              email: existingUser.email,
            },
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true, // can't be accessed via JS
          secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
          sameSite: "Strict", // adjust to "Lax" or "None" if cross-site (CSRF protection)
          maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // can't be accessed via JS
          secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
          sameSite: "Strict", // adjust to "Lax" or "None" if cross-site
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "Login successfully" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging user", error: error.message });
  }
};

export { registerUser, loginUser };
