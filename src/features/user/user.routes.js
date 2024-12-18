// manage routes/ paths to product controller
// 1. import express
import express from "express";
import UserController from "./user.controller.js";

// 2. initialize express router
const userRouter = express.Router();
const userController = new UserController();

// all the paths to contoller methods
//localhost/api/products

userRouter.post("/signup", userController.signUp);

userRouter.post("/signin", userController.signIn);

export default userRouter;
