import {
  CreateFarmer,
  GetAllFarmers,
  GetSingleFarmer,
  UpdateFarmer,
  DeleteFarmer,
} from "../controllers/FarmerController.js";
import express from "express";

const FarmerRouter = express.Router();

FarmerRouter.post("/", CreateFarmer);
FarmerRouter.get("/", GetAllFarmers);
FarmerRouter.get("/:id", GetSingleFarmer);
FarmerRouter.put("/:id", UpdateFarmer);
FarmerRouter.delete("/:id", DeleteFarmer);
export default FarmerRouter;
