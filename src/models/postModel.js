
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const PostSchema = new mongoose.Schema(

    {
       Title: {
               type :String,
               min : 5,
               max: 50,
               trim: true
        },
        Description: {
            type: String,
             min:15,
            max: 1000, 
            trim: true 
        },
        Comments: [{
        userId: {type:ObjectId,
        required:true,
        ref: "User"},
        commentByuser:{
            type:String,
            trim:true,
            required:true
        }
        }],
        likes : {
            type:Number,
            default : 0,
        },
        isDeleted: {
            type: Boolean,
            default : false
        },
        isDeletedAt: {
            type: Date,
            default : null
        }
    },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
