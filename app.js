import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT || "8888";

mongoose.connect(process.env.DATABASE_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let conn = mongoose.connection;

conn.on("open", () => {
  console.log("Connected to database");
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
});
