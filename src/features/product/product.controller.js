import ProductModel from "./product.model.js";

export default class ProductController {
  getAllProducts(req, res) {
    const products = ProductModel.GetAll();
    res.status(200).send(products);
  }

  addProduct(req, res) {
    // console.log(req.body);
    // console.log("this is post request");
    // res.status(200).send("post request received");
    const { name, price, sizes } = req.body;
    const newProduct = {
      name,
      price: parseFloat(price),
      sizes: sizes.split(","),
      imageUrl: req.file.filename,
    };

    const createdrecord = ProductModel.add(newProduct);
    res.status(201).send(createdrecord);
  }
  rateProduct(req, res, next) {
    console.log("rate", req.query);
    try {
      const userID = req.query.userID;
      const productID = req.query.productID;
      const rating = req.query.rating;

      ProductModel.rateProduct(userID, productID, rating);

      return res.status(200).send("rating has been added");
    } catch (err) {
      console.log("passing error to middleware");
      next(err);
    }
  }
  getOneProduct(req, res) {
    const id = req.params.id;
    const product = ProductModel.get(id);
    if (!product) {
      res.status(404).send("Product not found");
    } else {
      return res.status(200).send(product);
    }
  }

  filterProducts(req, res) {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;
    console.log("req qury", req.query);

    const result = ProductModel.filter(minPrice, maxPrice, category);
    res.status(200).send(result);
  }
}
