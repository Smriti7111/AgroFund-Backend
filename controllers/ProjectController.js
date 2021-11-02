import Project from "../models/Project.js";
import Farmer from "../models/Farmer.js";
import { Response, ErrorResponse, Check } from "../helpers/helpers.js";
// Create Project
export const CreateProject = async (req, res) => {
  // Destructing the request body
  const {
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
        returnPerMinimumInvestment,
      ],
      ""
    )
  ) {
    return res.send(ErrorResponse("Empty Fields"));
  }
  // Checking Zero Value
  if (Check([investmentToBeRaised, minimumInvestment, maximumInvestment], 0)) {
    return res.send(ErrorResponse("Zero Value detected"));
  }

  // Checking if farmer has project
  let farmer = await Farmer.findOne({ _id: req.user._id });
  if (farmer.hasProject) {
    return res.send(
      ErrorResponse("You have a ongoing project.Cannot create new project")
    );
  }

  if (farmer.isVerified === false) {
    return res.send(
      ErrorResponse("You are not verified. Please verify to post a project")
    );
  }

  // Creating Project
  let newProject = new Project({
    owner: req.user._id,
    title,
    investmentToBeRaised,
    minimumInvestment,
    maximumInvestment,
    returnPerMinimumInvestment,
    lastDateOfInvestment,
    expectedDateOfProjectCompletion,
    projectDescription,
  });

  if (maximumInvestment < minimumInvestment) {
    return res.send(
      ErrorResponse(
        "Maximum Investment should be greater than minimum investment"
      )
    );
  }

  if (
    maximumInvestment > investmentToBeRaised ||
    minimumInvestment > investmentToBeRaised
  ) {
    return res.send(
      ErrorResponse(
        "Investment to be raise is smaller than minimum or maximum investment. Check the value carefully"
      )
    );
  }

  try {
    let data = await newProject.save();
    try {
      await Farmer.findByIdAndUpdate(req.user._id, {
        $set: { hasProject: true },
      });
      return res.send(
        Response("success", "Project has been added successfully", data)
      );
    } catch (error) {
      await Project.findOneAndDelete({ owner: req.user._id });
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
export const GetSingleProject = async (req, res) => {
  try {
    let project = await Project.findOne({ _id: req.params.projectId });
    if (project) {
      return res.send(Response("success", "Project has been fetched", project));
    } else {
      return res.send(ErrorResponse("Failed to get project"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get Project of a farmer
export const GetProjectsOfFarmer = async (req, res) => {
  try {
    let allProjects = await Project.find({ owner: req.params.farmerId });

    if (allProjects) {
      return res.send(
        Response(
          "success",
          "All projects has been fetched successfully",
          allProjects
        )
      );
    } else {
      return res.send(ErrorResponse("Could not fetch projects"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Accept or Terminate Project
export const SetProjectStatus = () => {};
