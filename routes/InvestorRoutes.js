import {
  CreateInvestor,
  GetAllInvestors,
  GetSingleInvestor,
  UpdateInvestor,
  DeleteInvestor,
} from "../controllers/InvestorController.js";
import express from "express";

const investorRouter = express.Router();

investorRouter.post("/", CreateInvestor);
investorRouter.get("/", GetAllInvestors);
investorRouter.get("/:id", GetSingleInvestor);
investorRouter.put("/:id", UpdateInvestor);
investorRouter.delete("/:id", DeleteInvestor);
export default investorRouter;
