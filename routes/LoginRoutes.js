import { Login } from "../controllers/LoginController.js";
import express from "express";

const LoginRouter = express.Router();

LoginRouter.post("/", Login);
//   LoginRouter.get("/", GetAllLogins);
//   LoginRouter.get("/:id", GetSingleLogin);
//   LoginRouter.put("/:id", UpdateLogin);
//   LoginRouter.delete("/:id", DeleteLogin);
export default LoginRouter;
