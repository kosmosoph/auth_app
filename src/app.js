// Create the Server

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 8081;
const app = express();

// Potrebno za parsiranje JSON tela zahteva u registraciji i loginu
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
