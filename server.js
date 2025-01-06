//1 import exprerss
import "./env.js";
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middlware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose, { mongo } from "mongoose";
import likeRouter from "./src/features/like/like.router.js";
//2 create server

const server = express();

//CORS policy configuration

var corsOptions = {
  origin: "http://localhost:5500",
  allowedHeaders: "*",
};

server.use(cors(corsOptions));

// server.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

server.use(bodyParser.json()); // application level middleware added for every req body
// Bearer <token>

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

server.use("/api/orders", jwtAuth, orderRouter);

//for all requests related to product , redirect to product routes
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/users", userRouter);
server.use("/api/likes", jwtAuth, likeRouter);

server.use("/api/cartItems", loggerMiddleware, jwtAuth, cartRouter);

//3 default request handler
server.get("/", (req, res) => {
  res.send("welcome to ecommerce apis");
});

// eror handler middleware
server.use((err, req, res, next) => {
  console.log("err", err);
  if(err instanceof mongoose.Error.ValidationError){
    console.log("hi mon")
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }
  //server errrors
  res.status(500).send("something went wrong, please try later");
});

// 500 server error
// 503 server is down

//4. middleware to handle 404 requests
server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found Please check our documentation for more inforamtion at localhost:3400/api-docs"
    );
});

//5 specify port
server.listen(3400, () => {
  console.log("Server is running at 3400");
  // connectToMongoDB();
  connectUsingMongoose();
});
