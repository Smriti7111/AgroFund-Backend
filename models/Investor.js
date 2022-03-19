import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
    },

    contact: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    walletAddress: {
      type: String,
      required: true,
    },

    citizenshipNo: {
      type: String,
      required: false,
    },

    citizenship: {
      type: String,
      required: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    investedProjects: [
      {
        projectId: String,
        investedAmount: Number,
      },
    ],

    requestedForVerification: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Investor", investorSchema);
