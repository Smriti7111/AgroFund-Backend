import {
  CreateFarmer,
  GetAllFarmers,
  GetSingleFarmer,
  UpdateFarmer,
  DeleteFarmer,
  GetVerificationCode,
  VerifyCode,
} from "../controllers/FarmerController.js";
import express from "express";

const FarmerRouter = express.Router();

FarmerRouter.post("/", CreateFarmer);
FarmerRouter.get("/", GetAllFarmers);
FarmerRouter.get("/:id", GetSingleFarmer);
FarmerRouter.put("/:id", UpdateFarmer);
FarmerRouter.delete("/:id", DeleteFarmer);
FarmerRouter.get("/getVerificationCode/:farmerId", GetVerificationCode);
FarmerRouter.post("/verifyCode/:farmerId", VerifyCode);

export default FarmerRouter;
