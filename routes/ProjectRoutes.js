import {
  CreateProject,
  GetAllProjects,
  GetProjectsOfFarmer,
  GetSingleProject,
  // UpdateProject,
  // DeleteProject,
} from "../controllers/ProjectController.js";
import express from "express";
import { AuthenticateAsFarmer } from "../middlewares/Authentication.js";
import { ErrorResponse, Response } from "../helpers/helpers.js";

import multer from "multer";
import path from "path";
// File uploads with multer

// Checks whether the uploaded file is pdf or not
const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpg|jpeg|png/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (extName && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Image Only");
  }
};

// Init Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/farmer/project");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload

const upload = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("upload");

const projectRouter = express.Router();

projectRouter.post("/", AuthenticateAsFarmer, CreateProject);
projectRouter.get("/", GetAllProjects);
projectRouter.get("/:projectId", GetSingleProject);
projectRouter.get("/allProjects/:farmerId", GetProjectsOfFarmer);
projectRouter.post("/uploads", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.send(ErrorResponse("Failed to upload files", err.message));
    } else {
      return res.send({
        uploaded: true,
        url: `http://localhost:8888/uploads/farmer/project/${req.file.filename}`,
      });
    }
  });
});
//   projectRouter.get("/:id", GetSingleProject);
//   projectRouter.put("/:id", UpdateProject);
//   projectRouter.delete("/:id", DeleteProject);
export default projectRouter;
