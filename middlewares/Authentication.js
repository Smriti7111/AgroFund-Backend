import jwt from "jsonwebtoken";
import { ErrorResponse } from "../helpers/helpers";

// This middleware is used to make route private
const Authenticate = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send(ErrorResponse("UnAuthorized access"));
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    return res(ErrorResponse(e.message));
  }
};
