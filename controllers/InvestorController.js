import Investor from "../models/Investor.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import User from "../models/User.js";
import Client from "twilio";
import dotenv from "dotenv";
import Farmer from "../models/Farmer.js";

dotenv.config();

// Twilio Setup

const client = Client(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
  {
    lazyLoading: true,
  }
);

// Farmer Verification info posting

export const PostVerificationInformation = async (req, res) => {
  try {
    // let myFarmer = await Farmer.findOne({ _id: req.user._id });
    // if (!myFarmer) {
    //   return res.send(ErrorResponse("No user found"));
    // }

    Investor.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          citizenship: `uploads/investor/citizenship/${req.files.citizenship[0].filename}`,
          pan: `uploads/investor/citizenship/${req.files.pan[0].filename}`,
          panNo: req.body.panNo,
          citizenshipNo: req.body.citizenshipNo,
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

// Create Investor
export const CreateInvestor = async (req, res) => {
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

// Get Verification code

export const GetVerificationCode = async (req, res) => {
  try {
    let investor = await Investor.findOne({ _id: req.params.investorId });

    // Checking if phone number is verified already
    if (investor.isPhoneVerified) {
      return res.send(ErrorResponse("Your phone number is already verified"));
    }
    // Creates a verification code
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({
        to: `+977${investor.contact}`,
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
    let investor = await Investor.findOne({ _id: req.params.investorId });

    // Verifying the code
    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: `+977${investor.contact}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          Investor.findByIdAndUpdate(
            req.params.investorId,
            {
              $set: { isPhoneVerified: true },
            },
            (err) => {
              if (!err) {
                return res.send(
                  Response("success", "Phone number verified", data)
                );
              } else {
                return res.send(
                  ErrorResponse("Failed to update investor data")
                );
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
