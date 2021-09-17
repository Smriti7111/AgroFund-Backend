import {
  CreateAdmin,
  //   GetAllAdmins,
  //   GetSingleAdmin,
  //   UpdateAdmin,
  //   DeleteAdmin,
  //   GetVerificationCode,
  //   VerifyCode,
  // uploadCitizenship,
  // uploadPAN,
  // uploadFiles,
  //   PostVerificationInformation,
} from "../controllers/SuperAdminController.js";
import express from "express";
import { AuthenticateAsAdmin } from "../middlewares/Authentication.js";

const AdminRouter = express.Router();

AdminRouter.post("/", CreateAdmin);
// AdminRouter.get("/", GetAllAdmins);
// AdminRouter.get("/:id", GetSingleAdmin);
// AdminRouter.put("/:id", UpdateAdmin);
// AdminRouter.delete("/:id", DeleteAdmin);
// AdminRouter.get("/getVerificationCode/:adminId", GetVerificationCode);
// AdminRouter.post("/verifyCode/:adminId", VerifyCode);
// AdminRouter.post(
//   "/submitVerificationInfo",
//   AuthenticateAsAdmin,
//   uploadFiles,
//   (req, res) => {
//     PostVerificationInformation(req, res);
//   }
// );

export default AdminRouter;
