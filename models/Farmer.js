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
    address: {
      type: String,
      required: true,
    },

    rating: {
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

    panNo: {
      type: String,
      required: false,
    },

    citizenship: {
      type: String,
      required: false,
    },

    pan: {
      type: String,
      required: false,
    },

    isVerified: {
      type: Boolean,
    },

    hasProject: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Farmer", farmerSchema);
