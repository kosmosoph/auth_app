//Create the Connection File

import { config } from "dotenv";
import mysql from "mysql2";

config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to Data Base");
});

export default connection;
