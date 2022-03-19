import Farmer from "../models/Farmer.js";
import Admin from "../models/SuperAdmin.js";
import Investor from "../models/Investor.js";
import User from "../models/User.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
// Login Controller
export const Login = async (req, res) => {
  // Empty Field
  if (Check([req.body.walletAddress, req.body.password], "")) {
    return res.send(ErrorResponse("Empty Field"));
  }
  try {
    // Validate
    // console.log(req.body);
    // console.log(req.body.walletAddress);
    let user = await User.findOne({ userWallet: req.body.walletAddress });

    // console.log(user);
    // if user not found
    if (!user) {
      return res
        .status(200)
        .send(ErrorResponse("User has not been registered"));
    } else {
      let token = "";
      switch (user.userType) {
        case 0:
          let admin = await Admin.findOne({ walletAddress: user.userWallet });
          if (!admin) {
            return res.send(ErrorResponse("User not registered"));
          }

          //   Password Verification
          let isAdminPasswordVerified = passwordHash.verify(
            req.body.password,
            admin.password
          );
          if (!isAdminPasswordVerified) {
            return res.send(ErrorResponse("Incorrect Password"));
          }

          // Token Verification
          token = jwt.sign(
            {
              _id: admin._id,
              userType: user.userType,
              isVerified: admin.isVerified,
            },
            process.env.TOKEN_KEY
          );

          return res.header("auth-token", token).send(
            Response("success", "Logged in as Super Admin", admin, {
              userType: 0,
              token: token,
            })
          );

        case 1:
          let farmer = await Farmer.findOne({ walletAddress: user.userWallet });
          if (!farmer) {
            return res.status(404).send(ErrorResponse("Farmer not registered"));
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
            return res
              .status(404)
              .send(ErrorResponse("Investor not registered"));
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
            Response("success", "Logged in as investor", investor, {
              userType: 2,
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
