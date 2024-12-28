import CartItemModel from "./cartItems.model.js";
import CartItemsRepository from "./cartItems.repository.js";

export class CartItemsController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }
  async add(req, res) {
    try {
      const { productID, quantity } = req.body;
      // const quantity = Number(req.quantity);
      const userId = req.userID;

      console.log("cart req", req.body);
      await this.cartItemsRepository.add(productID, userId, quantity);
      res.status(201).send("Cart is updated");
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }

  async get(req, res) {
    try {
      const userID = req.userID;
      console.log("user", userID);
      const items = await this.cartItemsRepository.get(userID);
      console.log("items", items);
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }
  async delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const isDeleted = await this.cartItemsRepository.delete(userID, cartItemID);
    console.log(" isDeleted", isDeleted);
    if (!isDeleted) {
      return res.status(404).send("item not found");
    }
    return res.status(200).send("cart item is removed");
  }
}
