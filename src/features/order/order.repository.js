import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
// import { ObjectId } from "mongodb";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    // 1. get cartitems and calculate total amount
    await this.getTotalAmount(userId);
    //2, create an order record
    //3. reduce the stock
    //4 clear the cart item
  }

  async getTotalAmount(userId) {
    const db = getDB();
    console.log("get");
    const items = await db
      .collection("cartItems")
      .aggregate([
        //1. get cart items for the user
        {
          $match: { userId: new ObjectId(userId) },
        },
        // 2. get the products form products collection
        {
          $lookup: {
            from: "products",
            localField: "productID",
            foreignField: "_id",
            as: "productInfo",
          },
        },

        // 3. unwind the productInfo
        {
          $unwind: "$productInfo",
        },
        //4. calcualte totalAmount for each cartItem
        {
          $addFields: {
            "totalAmount": {
              $multiply: ["$productInfo.price", "$quantity"],
            },
          },
        },
      ])
      .toArray();
      const finalTotalAmount = items.reduce((acc, item) => acc+item.totalAmount,0)
    console.log("unwind lookup", items);
    console.log("finalTotalAmount", finalTotalAmount);
  }
}

