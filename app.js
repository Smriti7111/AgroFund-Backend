import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import FarmerRoutes from "./routes/FarmerRoutes.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || "8888";
app.use(cors());
// This is required for json transmission and acceptance
app.use(express.json());

// Router setups
app.use("/api/farmer", FarmerRoutes);

mongoose.connect(process.env.DATABASE_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

let conn = mongoose.connection;

conn.on("open", () => {
  console.log("Connected to database");
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
