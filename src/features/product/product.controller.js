import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }

  async addProduct(req, res) {
    // console.log(req.body);
    // console.log("this is post request");
    // res.status(200).send("post request received");
    try {
      const { name, desc, category, price, sizes } = req.body;
      const newProduct = new ProductModel(
        name,
        desc,
        parseFloat(price),
        req.file.filename,
        category,
        sizes.split(",")
      );

      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }
  async rateProduct(req, res, next) {
    console.log("rate", req.query);
    try {
      const userID = req.userID;
      const productID = req.body.productID;
      const rating = req.body.rating;

      await this.productRepository.rate(userID, productID, rating);

      return res.status(200).send("rating has been added");
    } catch (err) {
      console.log("err0", err);
      console.log("passing error to middleware");
      next(err);
    }
  }
  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send("Product not found");
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const categories = req.query.categories;
      console.log("req qury", req.query);

      const result = await this.productRepository.filter(minPrice, categories);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }

  async averagePrice(req, res, next) {
    try {
      const result =
        await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }
}
