import Farmer from "../models/Farmer.js";
import { Response, Check } from "../helpers/helpers.js";
import passwordHash from "password-hash";
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
      return res.send(Response("error", "Empty Field Sent", null));
    }

    //   Checks if wallet is registered already
    let existingWallet = await Farmer.findOne({
      walletAddress: req.body.walletAddress,
    });
    if (existingWallet) {
      return res.send(Response("error", "Wallet in use", null));
    }

    // Checks if Phone number in use
    let existingContact = await Farmer.findOne({ contact: req.body.contact });

    if (existingContact) {
      return res.send(Response("error", "Contact Number in use", null));
    }

    let newFarmer = new Farmer(req.body);
    newFarmer.password = passwordHash.generate(newFarmer.password);
    let data = await newFarmer.save();

    if (data) {
      return res.send(
        Response("success", "Your are successfully signed up", data)
      );
    } else {
      return res.send(Response("error", "Server Error", null));
    }
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};

// Get All Farmers
export const GetAllFarmers = async (req, res) => {
  try {
    let farmers = await Farmer.find();
    if (farmers) {
      return res.send(Response("success", "Received all farmers", farmers));
    } else {
      return res.send(Response("error", "Server Error", null));
    }
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};

// Get single farmer
export const GetSingleFarmer = async (req, res) => {
  try {
    let farmer = await Farmer.findOne({ _id: req.params.id });
    if (farmer) {
      return res.send(Response("success", "Farmer data fetched", farmer));
    } else {
      return res.send(Response("error", "Server Error", null));
    }
  } catch (e) {
    return res.send(Response("error", e.message, null));
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
          return res.send(Response("error", err.message, null));
        } else {
          return res.send(Response("success", "Update Success", farmer));
        }
      }
    );
  } catch (e) {
    return res.send(Response("error", e.message, null));
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
