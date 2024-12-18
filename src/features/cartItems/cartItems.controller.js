import CartItemModel from "./cartItems.model.js";

export class CartItemsController {
  add(req, res) {
    const { productID, quantity } = req.query;
    // const quantity = Number(req.quantity);
    const userId = req.userID;

    console.log("cart req", req.query);
    CartItemModel.add(productID, userId, quantity);
    res.status(201).send("Cart is updated");
  }

  get(req, res) {
    const userID = req.userID;
    const items = CartItemModel.get(userID);
    return res.status(200).send(items);
  }
  delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const error = CartItemModel.delete(cartItemID, userID);
    console.log("deleet eror", error);
    if (error) {
      return res.status(404).send(error);
    }
    return res.status(200).send("cart item is removed");
  }
}
