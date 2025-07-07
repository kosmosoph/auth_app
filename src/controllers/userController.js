import bcrypt from "bcrypt";
import User from "../models/User.js";

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
        res.status(200).json({ message: "Login successfull" });
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

  // TODO: generate JWT token
};

export { registerUser, loginUser };
