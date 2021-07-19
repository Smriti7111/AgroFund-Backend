import jwt from "jsonwebtoken";
import { ErrorResponse } from "../helpers/helpers.js";

// This middleware is used to make route private
export const Authenticate = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send(ErrorResponse("UnAuthorized access"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = verified;
    next();
  } catch (e) {
    return res(ErrorResponse(e.message));
  }
};

export const AuthenticateAsFarmer = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send(ErrorResponse("UnAuthorized access"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    if (verified.userType !== 1) {
      return res
        .status(401)
        .send(ErrorResponse("You don't have permission to create project"));
    }
    req.user = verified;
    next();
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
