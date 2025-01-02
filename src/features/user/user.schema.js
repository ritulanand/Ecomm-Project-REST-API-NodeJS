import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {type: String,maxLength:[25, "Name can't be greater than 25 characters"]},
  email: { type: String, unique: true,required: true, match: [/.+\@.+\../, "Please enter a valid email"]},
  password: {
    type: String,
    validate : {
        validator : function(value){
            let c =  /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value);
          console.log("c", c);
          return c
        },
        message : "Password should be between 8-12 characters and have a special charater"
    }
  },
  type: { type: String, enum: ["Customer", "Seller"] },
});
