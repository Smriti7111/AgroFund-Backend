import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    investmentToBeRaised: {
      type: Number,
      required: true,
    },

    minimumInvestment: {
      type: Number,
      required: true,
    },

    maximumInvestment: {
      type: Number,
      required: true,
    },

    returnPerMinimumInvestment: {
      type: String,
      required: true,
    },

    lastDateOfInvestment: {
      type: Date,
      required: true,
    },

    expectedDateOfProjectCompletion: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["In Process", "Accepted", "Terminated"],
      default: "In Process",
    },

    projectDescription: {
      type: String,
      required: true,
    },

    projectBanner: {
      type: String,
      required: false,
    },

    attachment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
