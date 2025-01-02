import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;

// export const connectUsingMongoose = async () => {
//   try {
//     await mongoose.connect(url, {useNewUrlParser : true, useUnifiedTopology : true});
//     console.log("Mongodb using mongoose is connected");
//   } catch (err) {
//     console.log(err);
//   }
// };

export const connectUsingMongoose = () => {
  try {
    mongoose
      .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("Mongodb using mongoose is connected");
      })
      .catch((err) => {
        console.log(" err mongose", err);
      });
  } catch (err) {
    console.log(err);
  }
};
