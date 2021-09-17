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

const projectRouter = express.Router();

projectRouter.post("/", AuthenticateAsFarmer, CreateProject);
projectRouter.get("/", GetAllProjects);
projectRouter.get("/:projectId", GetSingleProject);
projectRouter.get("/allProjects/:farmerId", GetProjectsOfFarmer);
//   projectRouter.get("/:id", GetSingleProject);
//   projectRouter.put("/:id", UpdateProject);
//   projectRouter.delete("/:id", DeleteProject);
export default projectRouter;
