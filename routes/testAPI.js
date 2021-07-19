import express from "express";

const testAPIrouter = express.Router();

testAPIrouter.get("/", (req, res, next) => {
  res.send("API is working properly");
});

export default testAPIrouter;
