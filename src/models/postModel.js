const mongoose = require("mongoose");

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
        Comments: {
            type: Array,
            default : []
        },
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
