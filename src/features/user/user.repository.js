import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { log } from "../../middlewares/logger.middleware.js";

class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async signUp(newUser) {
    console.log("repo user signup", newUser);
    try {
      //1. get the database
      const db = getDB();
      //2 . get the collection
      const collection = db.collection(this.collection);

      // newUser.id = users.length + 1;
      // users.push(newUser);

      //3.  insert the document
      await collection.insertOne(newUser);

      return newUser;
    } catch (err) {
      console.log("err", err);
      await log(err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async signIn(email, password) {
    console.log("sign user repo", email, password);
    try {
      //1. get the database
      const db = getDB();
      //2 . get the collection
      const collection = db.collection(this.collection);

      //3.  find the document
      return await collection.findOne({ email, password });
    } catch (err) {
      console.log("err", err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    console.log("find email repo", email);
    try {
      //1. get the database
      const db = getDB();
      //2 . get the collection
      const collection = db.collection("users");

      //3.  find the document
      return await collection.findOne({ email });
    } catch (err) {
      console.log("err", err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }
}

export default UserRepository;
