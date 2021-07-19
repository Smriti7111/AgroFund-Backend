import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userWallet: {
    type: String,
    required: true,
  },

  userType: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
