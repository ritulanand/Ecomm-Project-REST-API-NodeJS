// manage routes/ paths to product controller
// 1. import express
import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middlware.js";

// 2. initialize express router
const productRouter = express.Router();
const productController = new ProductController();

productRouter.post("/rate", productController.rateProduct);

// all the paths to contoller methods
//localhost/api/products

//localhost:3400/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get("/filter", productController.filterProducts);

productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  upload.single("imageUrl"),
  productController.addProduct
);

productRouter.get("/:id", productController.getOneProduct);

export default productRouter;
