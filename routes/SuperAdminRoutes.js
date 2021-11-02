import {
  CreateAdmin,
  GetAllAdmins,
  GetSingleAdmin,
  UpdateAdmin,
  DeleteAdmin,
  VerifyFarmer,
  VerifyInvestor,
  GetAllFarmerVerificationRequest,
  GetAllInvestorVerificationRequest,
} from "../controllers/SuperAdminController.js";
import express from "express";
import { AuthenticateAsAdmin } from "../middlewares/Authentication.js";

const AdminRouter = express.Router();

AdminRouter.post("/", CreateAdmin);
AdminRouter.get("/", GetAllAdmins);
AdminRouter.get("/:id", GetSingleAdmin);
AdminRouter.put("/:id", UpdateAdmin);
AdminRouter.delete("/:id", DeleteAdmin);
AdminRouter.put("/verifyFarmer/:farmerId", VerifyFarmer);
AdminRouter.put("/verifyInvestor/:investorId", VerifyInvestor);
AdminRouter.get(
  "/verificationRequests/farmer",
  GetAllFarmerVerificationRequest
);
AdminRouter.get(
  "/verificationRequests/investor",
  GetAllInvestorVerificationRequest
);

export default AdminRouter;
