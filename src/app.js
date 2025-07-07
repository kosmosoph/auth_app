// Create the Server

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

config();

const PORT = process.env.PORT || 8081;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
