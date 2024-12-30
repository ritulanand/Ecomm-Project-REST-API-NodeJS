import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class CartItemsRepository {
  constructor() {
    this.collection = "cartItems";
  }

  async add(productID, userId, quantity) {
    try {
      // 1. get the db
      const db = getDB();   
      //get the collection
      const collection = db.collection(this.collection);
      const id = await this.getNextCounter(db);
      console.log("id", id);
      // find the document
      // either insert or update
      // insertion
      await collection.updateOne(
        {
          productID: new ObjectId(productID),
          userId: new ObjectId(userId),
        },
        {
          $setOnInsert: { _id: id }, // use only on insert new doc not on update
          $inc: {
            quantity: quantity,
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async get(userID) {
    try {
      // 1. get the db
      const db = getDB();
      //get the collection
      const collection = db.collection(this.collection);
      console.log(
        "find",
        await collection.find({ userId: new ObjectId(userID) }).toArray()
      );
      return await collection.find({ userId: new ObjectId(userID) }).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async delete(userID, cartItemID) {
    try {
      // 1. get the db
      const db = getDB();
      //get the collection
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({
        _id: new ObjectId(cartItemID),
        userId: new ObjectId(userID),
      });
      return result.deletedCount > 0;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async getNextCounter(db) {
    const resultDocument = await db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "cartItemId" },
        { $inc: { value: 1 } },
        { returnDocument: "after" }
      );
    console.log("resultDocument", resultDocument);
    return resultDocument.value;
  }
}
