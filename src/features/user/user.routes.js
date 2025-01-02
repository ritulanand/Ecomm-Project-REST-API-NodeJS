// manage routes/ paths to product controller
// 1. import express
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// 2. initialize express router
const userRouter = express.Router();
const userController = new UserController();

// all the paths to contoller methods
//localhost/api/products

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.put("/resetPassword", jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
})

export default userRouter;
