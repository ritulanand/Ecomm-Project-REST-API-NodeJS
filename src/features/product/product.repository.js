import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(productData) {
    try {
      // // 1. get the db
      // const db = getDB();
      // //get the collection
      // const collection = db.collection(this.collection);
      // await collection.insertOne(newProduct);
      // return newProduct;


      //1. add the product
      console.log("productData before", productData);
      productData.categories = productData.category.split(',').map(e => e.trim());
      console.log("productData after", productData);
      const newProduct = new ProductModel(productData);
      console.log("newproduct", newProduct);
      const savedProduct = await newProduct.save();


      //2. update the categories
      await CategoryModel.updateMany({
        _id : {$in : productData.categories}
      },{$push : {products : new ObjectId(savedProduct._id)}})


    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const products = await collection.find().toArray();
      console.log("producst", products);
      return products;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  //product should have min price specified and category
  async filter(minPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      //   console.log("filet", minPrice, maxPrice, category);
      if (minPrice) {
        console.log("min");
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      //['Cat1', 'Cat2']
      console.log("catgeories before", categories);
      //   categories = categories.replace(/"/g, "o");
      //   console.log("cat", categories);
      categories = categories.replace(/'/g, '"');
      console.log("cat repla", categories);
      categories = JSON.parse(categories);
      console.log("catgeories", categories);

      if (categories) {
        filterExpression = {
          //   $and: [{ category: category }, filterExpression],
          $or: [{ category: { $in: categories } }, filterExpression],
        };
        // filterExpression.category = category;
      }
      console.log("filteresd express", filterExpression);
      return collection
        .find(filterExpression)
        .project({ name: 1, price: 1, _id: 0, ratings: { $slice: -1 } })
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  //   async rate(userID, productID, rating) {
  //     try {
  //       const db = getDB();
  //       const collection = db.collection(this.collection);
  //       //1 find the product
  //       const product = await collection.findOne({
  //         _id: new ObjectId(productID),
  //       });
  //       console.log("prod", product);
  //       //2. find the rating
  //       const userRating = product?.ratings?.find((r) => r.userID == userID);
  //       console.log("user", userRating);
  //       if (userRating) {
  //         // 3. update the  rating
  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productID),
  //             "ratings.userID": new ObjectId(userID),
  //           },
  //           { $set: { "ratings.$.rating": rating } }
  //         );
  //       } else {
  //         await collection.updateOne(
  //           { _id: new ObjectId(productID) },
  //           { $push: { ratings: { userID: new ObjectId(userID), rating } } }
  //         );
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       throw new ApplicationError("something went wrong with database", 500);
  //     }
  //   }

  // async rate(userID, productID, rating) {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection(this.collection);
  //     // remove exsiting entries
  //     await collection.updateOne(
  //       {
  //         _id: new ObjectId(productID),
  //       },
  //       {
  //         $pull: { ratings: { userID: new ObjectId(userID) } },
  //       }
  //     );
  //     //add new entries
  //     await collection.updateOne(
  //       { _id: new ObjectId(productID) },
  //       { $push: { ratings: { userID: new ObjectId(userID), rating } } }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     throw new ApplicationError("something went wrong with database", 500);
  //   }
  // }

  async rate(userID, productID, rating) {
    try {

      if (!ObjectId.isValid(productID)) {
        throw new Error("Invalid Product ID");
    }
      // check if product exists
      const productToUpdate = await ProductModel.findById(productID);
      console.log("producttouppdate", productToUpdate);
      if (!productToUpdate) {
        throw new Error("Product not found");
      }

      // 2. get the existing reviews
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),

        user: new ObjectId(userID),
      });
      console.log("user frevie", userReview);
      if (userReview) {
        userReview.rating = rating;
        await userReview.save();
      } else {
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        newReview.save();
      }
    } catch (err) {
      console.log("err >>", err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            //stage1: get average price per category
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }
}

export default ProductRepository;
