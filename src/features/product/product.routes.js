// manage routes/ paths to product controller
// 1. import express
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middlware.js";

// 2. initialize express router
const productRouter = express.Router();
const productController = new ProductController();

productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});

// all the paths to contoller methods
//localhost/api/products

//localhost:3400/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});

productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});

productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
