import Farmer from "../models/Farmer.js";
import Investor from "../models/Investor.js";
import User from "../models/User.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
// Login Controller
export const Login = async (req, res) => {
  try {
    // Empty Field
    if (Check([req.body.walletAddress, req.body.password], "")) {
      return res.send(ErrorResponse("Empty Field"));
    }

    // Validate
    let user = await User.findOne({ userWallet: req.body.walletAddress });
    // if user not found
    if (!user) {
      return res.status(404).send(ErrorResponse("User not registered"));
    } else {
      let token = "";
      switch (user.userType) {
        case 0:
          return res.send(
            Response("success", "Signed In as Super Admin", null)
          );

        case 1:
          let farmer = await Farmer.findOne({ walletAddress: user.userWallet });
          if (!farmer) {
            return res.status(404).send(ErrorResponse("User not registered"));
          }
          //   Password Verification
          let isPasswordVerified = passwordHash.verify(
            req.body.password,
            farmer.password
          );
          if (!isPasswordVerified) {
            return res.send(ErrorResponse("Incorrect Password"));
          }

          token = jwt.sign(
            {
              _id: farmer._id,
              userType: user.userType,
              isVerified: farmer.isVerified,
            },
            process.env.TOKEN_KEY
          );

          return res.header("auth-token", token).send(
            Response("success", "Logged in as farmer", farmer, {
              userType: 1,
              token: token,
            })
          );
        case 2:
          let investor = await Investor.findOne({
            walletAddress: user.userWallet,
          });
          if (!investor) {
            return res.status(404).send(ErrorResponse("User not registered"));
          }
          //   Password Verification
          let isInvestorPasswordVerified = passwordHash.verify(
            req.body.password,
            investor.password
          );
          if (!isInvestorPasswordVerified) {
            return res.send(ErrorResponse("Incorrect Password"));
          }
          token = jwt.sign(
            {
              _id: investor._id,
              userType: user.userType,
              isVerified: investor.isVerified,
            },
            process.env.TOKEN_KEY
          );

          return res.header("auth-token", token).send(
            Response("success", "Logged in as patron", investor, {
              userType: 1,
              token: token,
            })
          );
        default:
          return res.send(ErrorResponse("Invalid User"));
      }
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
