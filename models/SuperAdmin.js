import mongoose from "mongoose";

const superAdminSchema = mongoose.Schema(
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
  },
  { timestamps: true }
);

export default mongoose.model("Admin", superAdminSchema);
