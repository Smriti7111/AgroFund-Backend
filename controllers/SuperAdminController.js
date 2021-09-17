import Admin from "../models/SuperAdmin.js";
import User from "../models/User.js";
import Farmer from "../models/Farmer.js";
import Investor from "../models/Investor.js";
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

// Get All Admins
export const GetAllAdmins = async (req, res) => {
  try {
    let admins = await Admin.find();
    if (admins) {
      return res.send(
        Response("success", "Received all admins", admins, {
          size: admins.length,
        })
      );
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get single admin
export const GetSingleAdmin = async (req, res) => {
  try {
    let admin = await Admin.findOne({ _id: req.params.id });
    if (admin) {
      return res.send(Response("success", "Admin data fetched", admin));
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Update admin
export const UpdateAdmin = async (req, res) => {
  try {
    Admin.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      function (err, admin) {
        if (err) {
          return res.send(ErrorResponse(err.message));
        } else {
          return res.send(Response("success", "Update Success", admin));
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Delete admin
export const DeleteAdmin = async (req, res) => {
  try {
    Admin.findOneAndRemove(
      { _id: req.params.id },

      function (err, Admin) {
        if (err) {
          return res.send(ErrorResponse(err.message));
        } else {
          // Deleting from users table as well
          User.findOneAndRemove(
            {
              userId: req.params.id,
            },
            function (err1) {
              if (err1) {
                return res.send(ErrorResponse(err1.message));
              }
            }
          );
          return res.send(Response("success", "Deleted Successfully", Admin));
        }
      }
    );
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};

// Verify Farmer

export const VerifyFarmer = async (req, res) => {
  let farmer = await Farmer.findOne({ _id: req.params.farmerId });
  if (!farmer) {
    return res.send(ErrorResponse("Farmer not found!"));
  } else {
    if (farmer.isVerified) {
      return res.send(ErrorResponse("User has already been verified"));
    }
  }

  try {
    Farmer.findOneAndUpdate(
      { _id: req.params.farmerId },
      {
        $set: {
          isVerified: true,
        },
      },
      (err, data) => {
        if (err) {
          return res.send(ErrorResponse(e.message));
        } else {
          return res.send(
            Response("success", "User has been verified successfully", data)
          );
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Verify Investor

export const VerifyInvestor = async (req, res) => {
  let investor = await Investor.findOne({ _id: req.params.investorId });
  if (!investor) {
    return res.send(ErrorResponse("Investor not found!"));
  } else {
    if (investor.isVerified) {
      return res.send(ErrorResponse("User has already been verified"));
    }
  }
  try {
    Investor.findOneAndUpdate(
      { _id: req.params.investorId },
      {
        $set: {
          isVerified: true,
        },
      },
      (err, data) => {
        if (err) {
          return res.send(ErrorResponse(e.message));
        } else {
          return res.send(
            Response("success", "User has been verified successfully", data)
          );
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
