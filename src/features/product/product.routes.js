// manage routes/ paths to product controller
// 1. import express
import express from "express";
import ProductController from "./product.controller.js";

// 2. initialize express router
const productRouter = express.Router();
const productController = new ProductController();

// all the paths to contoller methods
//localhost/api/products
productRouter.get("/", productController.getAllProducts);
productRouter.post("/", productController.addProduct);

export default productRouter;
