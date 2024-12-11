//1 import exprerss

import express from "express";
import productRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
//2 create server

const server = express();
server.use(bodyParser.json()); // application level middleware added for every req body

//for all requests related to product , redirect to product routes
server.use("/api/products", productRouter);

//3 default request handler
server.get("/", (req, res) => {
  res.send("welcome to ecommerce apis");
});

//4 specify port
server.listen(3400, () => {
  console.log("Server is running at 3400");
});
