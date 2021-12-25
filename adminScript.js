import SuperAdmin from "./models/SuperAdmin.js";
import User from "./models/User.js";
import passwordHash from "password-hash";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

mongoose.connect(process.env.DATABASE_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

let conn = mongoose.connection;

conn.on("open", () => {
  console.log("Connected to database");
});

const createAdmin = async () => {
  let data = {
    name: "Sagar Subedi",
    email: "codeevil69@gmail.com",
    walletAddress: "0x2ee99243bb37065295b40F789F545bd1B03828e2",
    address: "Kathmandu",
    contact: "9841509916",
    password: passwordHash.generate("helloworld"),
    confirmPassword: "helloworld",
  };

  let {
    name,
    email,
    walletAddress,
    address,
    contact,
    password,
    confirmPassword,
  } = data;

  let admin = await new SuperAdmin({
    name,
    email,
    walletAddress: walletAddress.toLowerCase(),
    address,
    contact,
    password,
    confirmPassword,
  });

  let myadmin = await admin.save();
  console.log(myadmin);

  let user = await new User({
    userId: myadmin._id,
    userWallet: myadmin.walletAddress,
    userType: 0,
  });
  await user.save();

  console.log("New Super Admin has been added");
};

createAdmin();
