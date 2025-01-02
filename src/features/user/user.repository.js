import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

//creating models from schema
const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async signUp(user) {
    console.log("user>>", user);
    try {
      // create instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log("err ???", err);
      if(err instanceof mongoose.Error.ValidationError){
        console.log("err mon", err);
        throw err;
      }else{
        throw new ApplicationError("something went wrong with database", 500);
      }
      
    }
  }

//   async signIn(email, password) {
//     try {
//         return await UserModel.findOne({email, password});
//       } catch (err) {
//         console.log("err", err);
//         throw new ApplicationError("something went wrong with database", 500);
//       }
//   }

  async findByEmail(email) {
    // console.log("find email repo", email);
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log("err", err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }

  async resetPassword(userID, newPassword){
    try{
        let user = await UserModel.findById(userID);
        if(user){
            user.password = newPassword;
            user.save();
            // save if no id it will create new one, but if id is already there it will update

        }else{
            throw new Error("user not found")
        }
    }catch (err) {
      console.log("err", err);
      throw new ApplicationError("something went wrong with database", 500);
    }
  }
}
