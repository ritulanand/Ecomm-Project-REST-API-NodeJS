import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
// import { ObjectId } from "mongodb";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
 
      const db = getDB();
      session.startTransaction();
      // 1. get cartitems and calculate total amount

      const items = await this.getTotalAmount(userId, session);

      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      console.log("finalTotalAmount", finalTotalAmount);

      //2, create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );

      await db.collection(this.collection).insertOne(newOrder, { session });

      //3. reduce the stock
      for (let item of items) {
        await db.collection("products").updateOne(
          {
            _id: item.productID
          },
          {
            $inc: { stock: -item.quantity }
          },
          { session }
        );
      }
      // throw new Error("Something went wrong in place order");
      //write confict error mongoserver error if we comment above line
      //4 clear the cart item
      await db
        .collection("cartItems")
        .deleteMany({ userId: new ObjectId(userId) }, {session});
        session.commitTransaction();
        session.endSession();
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    console.log("get");
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          //1. get cart items for the user
          {
            $match: { userId: new ObjectId(userId) },
          },
          // 2. get the products form products collection
          // add nested object inside cartitem
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

          // {
          //   $addFields: {
          //     productDetails: { $arrayElemAt: ["$productInfo", 0] },
          //   },
          // },

          // {
          //   $addFields: {
          //     totalAmount: {
          //       $multiply: ["$productDetails.price", "$quantity"],
          //     },
          //   },
          // },
          {
            $addFields: {
              "totalAmount": {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },

          //prashik code
          // {
          //   $addFields: {
          //     productInfo: { $arrayElemAt: ["$productInfo", 0] },
          //     totalAmount: {
          //       $cond: {
          //         if: { $gt: ["$productInfo", null] },
          //         then: { $multiply: ["$productInfo.price", "$quantity"] },
          //         else: 0,
          //       },
          //     },
          //   },
          // },
        ],
        { session }
      )
      .toArray();

    console.log("unwind lookup", items);
    return items;
  }
}

