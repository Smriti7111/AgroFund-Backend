import {
  CreateInvestor,
  GetAllInvestors,
  GetSingleInvestor,
  UpdateInvestor,
  DeleteInvestor,
  GetVerificationCode,
  VerifyCode,
  PostVerificationInformation,
} from "../controllers/InvestorController.js";
import express from "express";
import { Authenticate } from "../middlewares/Authentication.js";
import multer from "multer";
import path from "path";

// Checks whether the uploaded file is pdf or not
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /pdf/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (extName && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Pdf Only");
  }
};

// Init Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "citizenship") {
      cb(null, "./public/uploads/investor/citizenship");
    } else if (file.fieldname === "pan") {
      cb(null, "./public/uploads/investor/pan");
    } else {
      cb(null, "./public/uploads/investor/others");
    }
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "-" +
        req.user._id +
        path.extname(file.originalname)
    );
  },
});

// Init Upload

const uploadFiles = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  {
    name: "citizenship",
    maxCount: 1,
  },
  {
    name: "pan",
    maxCount: 1,
  },
]);

const investorRouter = express.Router();

investorRouter.post("/", CreateInvestor);
investorRouter.get("/", GetAllInvestors);
investorRouter.get("/:id", GetSingleInvestor);
investorRouter.put("/:id", UpdateInvestor);
investorRouter.delete("/:id", DeleteInvestor);
investorRouter.get("/getVerificationCode/:investorId", GetVerificationCode);
investorRouter.post("/verifyCode/:investorId", VerifyCode);
investorRouter.post(
  "/submitVerificationInfo",
  Authenticate,
  uploadFiles,
  (req, res) => {
    PostVerificationInformation(req, res);
  }
);

export default investorRouter;
