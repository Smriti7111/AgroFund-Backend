import Investor from "../models/Investor.js";
import Farmer from "../models/Farmer.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import User from "../models/User.js";
// Create Investor
export const CreateInvestor = async (req, res) => {
  // Check if fields are empty

  if (
    Check([
      req.body.name,
      req.body.address,
      req.body.walletAddress,
      req.body.contact,
      req.body.password,
    ])
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
  let existingContactInvestor = await Investor.findOne({
    contact: req.body.contact,
  });
  let existingContactFarmer = await Farmer.findOne({
    contact: req.body.contact,
  });

  if (existingContactInvestor || existingContactFarmer) {
    return res.send(ErrorResponse("Contact Number in use"));
  }

  // Creating Investor
  let newInvestor = new Investor(req.body);
  newInvestor.password = passwordHash.generate(newInvestor.password);

  // Creating User
  let newUser = new User({
    userId: newInvestor._id,
    userWallet: newInvestor.walletAddress,
    userType: 2,
  });
  try {
    let data = await newInvestor.save();
    try {
      await newUser.save();
      return res.send(Response("success", "Registration successfull", data));
    } catch (error) {
      await Investor.findOneAndRemove({ walletAddress: data.walletAddress });
      return res.send(ErrorResponse(error.message));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get All Investors
export const GetAllInvestors = async (req, res) => {
  try {
    let Investors = await Investor.find();
    if (Investors) {
      return res.send(
        Response("success", "Received all Investors", Investors, {
          size: Investors.length,
        })
      );
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get single Investor
export const GetSingleInvestor = async (req, res) => {
  try {
    let Investor = await Investor.findOne({ _id: req.params.id });
    if (Investor) {
      return res.send(Response("success", "Investor data fetched", Investor));
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Update Investor
export const UpdateInvestor = async (req, res) => {
  try {
    Investor.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      function (err, Investor) {
        if (err) {
          return res.send(ErrorResponse(err.message));
        } else {
          return res.send(Response("success", "Update Success", Investor));
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Delete Investor
export const DeleteInvestor = async (req, res) => {
  try {
    Investor.findOneAndRemove(
      { _id: req.params.id },

      function (err, Investor) {
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
          return res.send(
            Response("success", "Deleted Successfully", Investor)
          );
        }
      }
    );
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};
