import Farmer from "../models/Farmer.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import User from "../models/User.js";
import Client from "twilio";
import dotenv from "dotenv";
import Investor from "../models/Investor.js";
import multer from "multer";
import path from "path";

dotenv.config();

// Twilio Setup

const client = Client(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

// Create Farmer
export const CreateFarmer = async (req, res) => {
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
        req.body.check,
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
  let existingContact = await Farmer.findOne({ contact: req.body.contact });
  let existingContact1 = await Investor.findOne({ contact: req.body.contact });

  if (existingContact || existingContact1) {
    return res.send(ErrorResponse("Contact Number in use"));
  }

  // Creating Farmer
  let newFarmer = new Farmer(req.body);
  newFarmer.password = passwordHash.generate(newFarmer.password);
  // Creating new user
  let newUser = new User({
    userId: newFarmer._id,
    userWallet: newFarmer.walletAddress,
    userType: 1,
  });

  try {
    let data = await newFarmer.save();
    try {
      await newUser.save();
      return res.send(Response("success", "Registration successfull", data));
    } catch (error) {
      await Farmer.findOneAndRemove({ walletAddress: data.walletAddress });
      return res.send(ErrorResponse(error.message));
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
      return res.send(
        Response("success", "Received all farmers", farmers, {
          size: farmers.length,
        })
      );
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

      function (err, Farmer) {
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
          return res.send(Response("success", "Deleted Successfully", Farmer));
        }
      }
    );
  } catch (e) {
    return res.send(Response("error", e.message, null));
  }
};

// Get Verification code

export const GetVerificationCode = async (req, res) => {
  try {
    let farmer = await Farmer.findOne({ _id: req.params.farmerId });

    // Checking if phone number is verified already
    if (farmer.isPhoneVerified) {
      return res.send(ErrorResponse("Your phone number is already verified"));
    }
    // Creates a verification code
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({
        to: `+977${farmer.contact}`,
        channel: "sms",
      })
      .then((response) =>
        res.send(
          Response(
            "success",
            "Code has been sent to your mobile. Please wait for few seconds before pressing resend code",
            response
          )
        )
      )
      .catch((error) => {
        // Checking for valid mobile number
        if (error.status === 400) {
          return res.send(ErrorResponse("Invalid Mobile Number"));
        } else {
          return res.send(ErrorResponse("Error Occured"));
        }
      });
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Verify Code
export const VerifyCode = async (req, res) => {
  try {
    let farmer = await Farmer.findOne({ _id: req.params.farmerId });

    // Verifying the code
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: `+977${farmer.contact}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          Farmer.findByIdAndUpdate(
            req.params.farmerId,
            {
              $set: { isPhoneVerified: true },
            },
            (err) => {
              if (!err) {
                return res.send(
                  Response("success", "Phone number verified", data)
                );
              } else {
                return res.send(ErrorResponse("Failed to update farmer data"));
              }
            }
          );
        } else {
          return res.send(ErrorResponse("Code didnot match"));
        }
      })
      .catch((error) => res.send(ErrorResponse("Error! Try again later")));
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Farmer Verification info posting

export const PostVerificationInformation = async (req, res) => {
  try {
    Farmer.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          citizenship: `uploads/farmer/citizenship/${req.files.citizenship[0].filename}`,
          pan: `uploads/farmer/citizenship/${req.files.pan[0].filename}`,
          panNo: req.body.panNo,
          citizenshipNo: req.body.citizenshipNo,
          requestedForVerification: true,
        },
      },
      function (err, data) {
        if (err) {
          return res.send(ErrorResponse("Error encountered. Please try again"));
        } else {
          return res.send(
            Response(
              "success",
              "Verification Request has been submitted. You will soon be notified",
              data
            )
          );
        }
      }
    );
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
