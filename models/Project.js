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

    cropName: {
      type: String,
      required: true,
    },

    investmentRaised: {
      type: Number,
      default: 0,
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
      enum: ["Initial", "Ready", "Planted", "Harvested", "Shipped"],
      default: "Ready",
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

    isActive: {
      type: Boolean,
      required: false,
    },

    investors: Array(String),
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
