import mongoose from "mongoose";

const investorSchema = mongoose.Schema(
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

    associatedProjects: {
        type: String,
        required: false
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
    },
  },
  { timestamps: true }
);

export default mongoose.model("Investor", investorSchema);
