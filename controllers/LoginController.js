import Farmer from "../models/Farmer.js";
import User from "../models/User.js";
import { Response, Check, ErrorResponse } from "../helpers/helpers.js";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";
// Login Controller
export const Login = async (req, res) => {
  try {
    // Validate
    let user = await User.findOne({ userWallet: req.body.walletAddress });
    // if user not found
    if (!user) {
      return res.status(404).send(ErrorResponse("User not registered"));
    } else {
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

          let token = jwt.sign(
            { _id: farmer._id, userType: user.userType },
            process.env.TOKEN_KEY
          );

          return res.send(
            Response("success", "Signed In as Farmer", farmer, {
              userType: 1,
              token: token,
            })
          );
        case 2:
          return res
            .header("auth-token", token)
            .send(Response("success", "Signed In as Patron", null));
        default:
          break;
      }
    }
    // Empty Field
    if (Check([req.body.wallet, req.body.password], "")) {
      return res.send(ErrorResponse("Empty Field"));
    }
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
