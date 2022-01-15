import {
  CreateFarmer,
  GetAllFarmers,
  GetSingleFarmer,
  UpdateFarmer,
  DeleteFarmer,
  GetVerificationCode,
  VerifyCode,
  // uploadCitizenship,
  // uploadPAN,
  // uploadFiles,
  PostVerificationInformation,
} from "../controllers/FarmerController.js";
import express from "express";
import {
  AuthenticateAsAdmin,
  AuthenticateAsFarmer,
} from "../middlewares/Authentication.js";
import { ErrorResponse, Response } from "../helpers/helpers.js";
import multer from "multer";
import path from "path";
// File uploads with multer

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
      cb(null, "./public/uploads/farmer/citizenship");
    } else if (file.fieldname === "pan") {
      cb(null, "./public/uploads/farmer/pan");
    } else {
      cb(null, "./public/uploads/farmer/others");
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
const FarmerRouter = express.Router();

FarmerRouter.post("/", CreateFarmer);
FarmerRouter.get("/", GetAllFarmers);
FarmerRouter.get("/:id", GetSingleFarmer);
FarmerRouter.put("/:id", UpdateFarmer);
FarmerRouter.delete("/:id", AuthenticateAsAdmin, DeleteFarmer);
FarmerRouter.get("/getVerificationCode/:farmerId", GetVerificationCode);
FarmerRouter.post("/verifyCode/:farmerId", VerifyCode);
FarmerRouter.post(
  "/submitVerificationInfo",
  AuthenticateAsFarmer,
  uploadFiles,
  (req, res) => {
    // console.log(req.files);
    PostVerificationInformation(req, res);
  }
);

export default FarmerRouter;
