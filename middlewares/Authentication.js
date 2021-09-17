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

// Authenticate as super admin
export const AuthenticateAsAdmin = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send(ErrorResponse("UnAuthorized access"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    if (verified.userType !== 0) {
      return res.status(401).send(ErrorResponse("UnAuthorized"));
    }
    req.user = verified;
    next();
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};

// Authenticate as farmer
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

// Authenticate as Investor
export const AuthenticateAsInvestor = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send(ErrorResponse("UnAuthorized access"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    if (verified.userType !== 2) {
      return res
        .status(401)
        .send(ErrorResponse("Your are not authorized as investor"));
    }
    req.user = verified;
    next();
  } catch (e) {
    return res.send(ErrorResponse(e.message));
  }
};
