import Project from "../models/Project.js";
import Farmer from "../models/Farmer.js";
import { Response, ErrorResponse, Check } from "../helpers/helpers.js";
// Create Project
export const CreateProject = async (req, res) => {
  // Destructing the request body
  const {
    owner,
    title,
    investmentToBeRaised,
    minimumInvestment,
    maximumInvestment,
    returnPerMinimumInvestment,
    lastDateOfInvestment,
    expectedDateOfProjectCompletion,
    projectDescription,
  } = req.body;

  // Checking Empty Field
  if (
    Check(
      [
        title,
        projectDescription,
        lastDateOfInvestment,
        expectedDateOfProjectCompletion,
      ],
      ""
    )
  ) {
    return res.send(ErrorResponse("Empty Fields"));
  }
  // Checking Zero Value
  if (
    Check(
      [
        investmentToBeRaised,
        minimumInvestment,
        maximumInvestment,
        returnPerMinimumInvestment,
      ],
      0
    )
  ) {
    return res.send(ErrorResponse("Zero Value detected"));
  }

  // Checking if farmer has project
  let farmer = await Farmer.findOne({ _id: owner });
  if (farmer.hasProject) {
    return res.send(
      ErrorResponse("You have a ongoing project.Cannot create new project")
    );
  }

  // Creating Project
  let newProject = new Project(req.body);

  try {
    let data = await newProject.save();
    try {
      await Farmer.findByIdAndUpdate(owner, {
        $set: { hasProject: true },
      });
      return res.send(
        Response("success", "Project has been added successfully", data)
      );
    } catch (error) {
      Project.findOneAndDelete({ owner: owner });
      return res.send(ErrorResponse(error));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get all Projects
export const GetAllProjects = async (req, res) => {
  try {
    let allProjects = await Project.find();
    if (allProjects) {
      return res.send(Response("success", "All Projects fetched", allProjects));
    }
    return res.send(ErrorResponse("Failed to get projects"));
  } catch (e) {
    return res.send(Response(e.message));
  }
};

// Get Individual Project
export const GetSingleProject = () => {};

// Get Project of a farmer
export const GetProjectOfFarmer = () => {};

// Accept or Terminate Project
export const SetProjectStatus = () => {};
