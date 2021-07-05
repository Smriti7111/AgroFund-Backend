import Farmer from "../models/Farmer.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import User from "../models/User.js";
// Create Farmer
export const CreateFarmer = async (req, res) => {
  try {
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
    let existingWallet = await Farmer.findOne({
      walletAddress: req.body.walletAddress,
    });
    if (existingWallet) {
      return res.send(ErrorResponse("Wallet already registered"));
    }

    // Checks if Phone number in use
    let existingContact = await Farmer.findOne({ contact: req.body.contact });

    if (existingContact) {
      return res.send(ErrorResponse("Contact Number in use"));
    }

    let newFarmer = new Farmer(req.body);
    newFarmer.password = passwordHash.generate(newFarmer.password);
    let data = await newFarmer.save();

    if (data) {
      let newUser = new User({
        userWallet: newFarmer.walletAddress,
        userType: 1,
      });
      let userData = await newUser.save();
      if (!userData) {
        return res.send(ErrorResponse("Cannot Register"));
      }
      return res.send(
        Response("success", "Your are successfully signed up", data)
      );
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get All Farmers
export const GetAllFarmers = async (req, res) => {
  try {
    let farmers = await Farmer.find();
    if (farmers) {
      return res.send(Response("success", "Received all farmers", farmers));
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Get single farmer
export const GetSingleFarmer = async (req, res) => {
  try {
    let farmer = await Farmer.findOne({ _id: req.params.id });
    if (farmer) {
      return res.send(Response("success", "Farmer data fetched", farmer));
    } else {
      return res.send(ErrorResponse("Server Error"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Update farmer
export const UpdateFarmer = async (req, res) => {
  try {
    Farmer.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      function (err, farmer) {
        if (err) {
          return res.send(ErrorResponse(err.message));
        } else {
          return res.send(Response("success", "Update Success", farmer));
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Delete farmer
export const DeleteFarmer = async (req, res) => {
  try {
    Farmer.findOneAndRemove(
      { _id: req.params.id },

      function (err, farmer) {
        if (err) {
          return res.send(Response("error", err.message, null));
        } else {
          return res.send(Response("success", "Deleted Successfully", farmer));
        }
      }
    );
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};
