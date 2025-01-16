import mongoose, { mongo } from "mongoose";


export const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    likeable : {
        type: mongoose.Schema.Types.ObjectId,
        refPath : 'types'
    },
    
        types : {
            type: String,
            enum : ['Product', 'Category']
        }
    
}).pre("save", (next) => {
    console.log("new like coming in");
    next();
}).post("save" ,(doc) => {
    console.log("like is saved");
    console.log("doc", doc);
}).pre("find", (next) => {
    console.log("retreiving likes");
    next();
}).post("find", (docs) => {
    console.log("find is completed")
console.log("docs", docs);
})



