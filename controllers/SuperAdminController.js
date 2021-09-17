import Admin from "../models/SuperAdmin.js";
import User from "../models/User.js";
import { Check, Response, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";

export const CreateAdmin = async (req, res) => {
  // Check if fields are empty

  if (
    Check(
      [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.walletAddress,
        req.body.contact,
        req.body.password,
        req.body.confirmPassword,
      ],
      ""
    )
  ) {
    return res.send(ErrorResponse("Empty Field"));
  }

  //   Checks if wallet is registered already
  let existingWallet = await User.findOne({
    userWallet: req.body.walletAddress,
  });
  if (existingWallet) {
    return res.send(ErrorResponse("Wallet already registered"));
  }

  // Checks if Phone number in use
  let existingContact = await Admin.findOne({ contact: req.body.contact });

  if (existingContact) {
    return res.send(ErrorResponse("Contact Number in use"));
  }

  // Creating Admin
  let newAdmin = new Admin(req.body);
  newAdmin.password = passwordHash.generate(newAdmin.password);
  // Creating new user
  let newUser = new User({
    userId: newAdmin._id,
    userWallet: newAdmin.walletAddress,
    userType: 0,
  });

  try {
    let data = await newAdmin.save();
    try {
      await newUser.save();
      return res.send(
        Response("success", "New admin has been added successfully", data)
      );
    } catch (error) {
      await Admin.findOneAndRemove({ walletAddress: data.walletAddress });
      return res.send(ErrorResponse(error.message));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
