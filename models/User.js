import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
