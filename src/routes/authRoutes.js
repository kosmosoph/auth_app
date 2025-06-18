// Implement User Registration

import express from "express";
import bcrypt from "bcrypt";
import database from "../config/database.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    database.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        throw err;
      }

      res.status(201).send("User registered successfully");
    });
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

// User login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const query = "SELECT * FROM users WHERE email = ?";
  database.query(query, [email], async (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      const user = results[0];

      // Compare password from the request and the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  });
});

// module.exports = router;
export default router;