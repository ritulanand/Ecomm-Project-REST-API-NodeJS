import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";

export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
  }
  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(400).send("Incorrect credential");
    } else {
      // 1. crerqte tokem
      const token = jwt.sign(
        { userID: result.id, email: result.email },
        "D2cVZgKZ3eJTvCAr1Na3v9JRZ66JYz3C",
        {
          expiresIn: "1h",
        }
      );

      //2 send token

      return res.status(200).send(token);
    }
  }
}
