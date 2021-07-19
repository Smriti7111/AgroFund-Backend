import {
  CreateProject,
  GetAllProjects,
  // GetSingleProject,
  // UpdateProject,
  // DeleteProject,
} from "../controllers/ProjectController.js";
import express from "express";
import { AuthenticateAsFarmer } from "../middlewares/Authentication.js";

const projectRouter = express.Router();

projectRouter.post("/", AuthenticateAsFarmer, CreateProject);
projectRouter.get("/", GetAllProjects);
//   projectRouter.get("/:id", GetSingleProject);
//   projectRouter.put("/:id", UpdateProject);
//   projectRouter.delete("/:id", DeleteProject);
export default projectRouter;
