import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res, next) {
    console.log("sign up controler");
    const { name, email, password, type } = req.body;
    console.log("pass", password);
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      console.log("user sign", user);
      await this.userRepository.signUp(user);
      const userwithoutpassword = {
        name: user.name,
        email: user.email,
        type: user.type,
      };
      res.status(201).send(userwithoutpassword);
    } catch (err) {
      next(err);
      // console.log(err);
      // return res.status(404).send("something went wrong");
    }
  }

  async signIn(req, res, next) {
    console.log("sign in controller");
    try {
      // 1 find user by email
      const user = await this.userRepository.findByEmail(req.body.email);
      console.log("user sign in", user);

      if (!user) {
        return res.status(400).send("Incorrect credential");
      } else {
        //compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // . create tokem
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          // send token

          return res.status(200).send(token);
        } else {
          return res.status(400).send("incorrect credentails");
        }
      }
    } catch (err) {
      next(err);
      console.log(err);
      return res.status(404).send("something went wrong");
    }
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const userID = req.userID;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is reset");
    } catch (err) {
      console.log(err);
      return res.status(200).send("something went wrong");
    }
  }
}
