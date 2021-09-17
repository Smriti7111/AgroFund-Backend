import mongoose from "mongoose";

const farmerSchema = mongoose.Schema(
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

    confirmPassword: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    check: {
      type: Boolean,
    },

    walletAddress: {
      type: String,
      required: true,
    },
    citizenshipNo: {
      type: String,
      default: "",
    },

    panNo: {
      type: String,
      default: "",
    },

    citizenship: {
      type: String,
      default: "",
    },

    pan: {
      type: String,
      default: "",
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

    hasProject: {
      type: Boolean,
      default: false,
    },

    projectsCompleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
