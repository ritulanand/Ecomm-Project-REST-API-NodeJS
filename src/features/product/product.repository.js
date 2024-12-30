import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      // 1. get the db
      const db = getDB();
      //get the collection
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
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

  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // remove exsiting entries
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        {
          $pull: { ratings: { userID: new ObjectId(userID) } },
        }
      );
      //add new entries
      await collection.updateOne(
        { _id: new ObjectId(productID) },
        { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      );
    } catch (err) {
      console.log(err);
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
