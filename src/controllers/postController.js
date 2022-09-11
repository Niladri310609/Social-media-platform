const postModel = require("../models/postModel")
const {isValid,isValidRequestBody,isValidObjectId,isValidtitle,isValidesc, isValidScripts} =  require("../validation/validation")
const userModel = require("../models/userModel")


//===================================createPost========================================
const createPost = async function(req,res){
    try{
           let data = req.body
           let userId = req.params.userId
         const {Title, Description} = req.body;

         

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: `${userId} is not valid` })

        let user = await userModel.findById(userId)

        if (!user) return res.status(400).send({ status: false, messgage: `${userId} does not exist` })
         
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Input Data to publish a Post" })
        }
        if (!isValid(Title)) {
            return res.status(400).send({ status: false, message: "Title is required... " })
        }
         if(!isValidtitle(Title)){
            return res.status(400).send({ status: false, message: "Your Title length must be between 5 to 50 characters and should be in valid format" })
         }
        

        if (!isValid(Description)) {
            return res.status(400).send({ status: false, message: "Description is required..." })
        }

        if(!isValidesc(Description)){
            return res.status(400).send({ status: false, message: "Your Description length must be between 15 to 1000 characters and should be in valid format" })
         }

        

             const PostCreated = await postModel.create(data)

             res.status(201).send({ status: true, message: "Success", data: PostCreated })
    }    catch(error){
        res.status(500).send({status:false, message: error.message })
    }
};


//===================================DeletePost========================================
const deletePostById = async (req, res) => {

    try {
         let postId = req.body.postId?.toString().trim()
        let userId = req.params.userId?.toString().trim()
        //============================================================================== validations for ObjectId==============================================================================


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user Id" })
        }

        //==============================================================================Checking the user's existance in the Db==============================================================================


        let checkuser = await userModel.findOne({ _id: userId })

        if (!checkuser) {
            return res.status(404).send({ status: false, message: "user doesn't exist" })
        }
        //==============================================================================after checking the deletion of the Post ==============================================================================
        const findDeletedPost = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!findDeletedPost) return res.status(404).send({ status: false, message: "post not found or it is already deleted" });

        let deletedPost = await postModel.findOneAndUpdate({ _id:postId }, { $set: { isDeleted: true, isDeletedAt: new Date() } }, { new: true })

        return res.status(200).send({ status: true, message: "Post Deleted Succesfully", data:deletedPost })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//===================================Like the post========================================
const likePostById = async(req,res) => {
    try{
        let postId = req.body.postId?.toString().trim()
        let userId = req.params.userId?.toString().trim()
        //============================================================================== validations for ObjectId==============================================================================


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user Id" })
        }

        //==============================================================================Checking the user's existance in the Db==============================================================================


        let checkuser = await userModel.findOne({ _id: userId })

        if (!checkuser) {
            return res.status(404).send({ status: false, message: "user doesn't exist" })
        }
        //==============================================================================after checking the deletion of the Post ==============================================================================
        const findDeletedPost = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!findDeletedPost) return res.status(404).send({ status: false, message: "post not found or it is already deleted" });
        const updatinglikeCount = await postModel.findOneAndUpdate({ _id: postId }, { $inc: { likes: +1 } }, { new: true }).select({ __v: 0 })

        res.status(200).send({status:true, message: "you just Like the post", data:updatinglikeCount })
        
    } catch(error){
        res.status(500).send({
            status:false, message: error.message
        })
    }
}


//===================================dislike the post========================================
const UnlikePostById = async(req,res) => {
    try{
        let postId = req.body.postId?.toString().trim()
        let userId = req.params.userId?.toString().trim()
        //============================================================================== validations for ObjectId==============================================================================


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid user Id" })
        }

        //==============================================================================Checking the user's existance in the Db==============================================================================


        let checkuser = await userModel.findOne({ _id: userId })

        if (!checkuser) {
            return res.status(404).send({ status: false, message: "user doesn't exist" })
        }
        //==============================================================================after checking the deletion of the Post ==============================================================================
        const findDeletedPost = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!findDeletedPost) return res.status(404).send({ status: false, message: "post not found or it is already deleted" });
        const updatinglikeCount = await postModel.findOneAndUpdate({ _id: postId }, { $inc: { likes: -1 } }, { new: true }).select({ __v: 0 })

        res.status(200).send({status:true, message: "you just UnLike the post", data:updatinglikeCount })
        
    } catch(error){
        res.status(500).send({
            status:false, message: error.message
        })
    }
}


//===================================Comment a Post========================================
const writeComment = async(req,res) => {
      try{
           let postIdParams = req.params.postId
           let data = req.body;
           const {userId,Comments} = req.body;

           if (!isValidObjectId(postIdParams)) return res.status(400).send({ status: false, message: `${postIdParams} is not valid` })
           if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: `${userId} is not valid` })

           
           if (!isValidRequestBody(data)) {
               return res.status(400).send({ status: false, message: "Input Data to post a comment" })
            }
            if(!isValidScripts(Comments)){
                return res.status(400).send({status:false, message: "Please write your comment in valid format"})
            }
            if (!isValid(Comments)) {
                return res.status(400).send({ status: false, message: "comment is required... " })
            }
            let getPost = await postModel.findOne({_id:postIdParams},{isDeleted:false})
    
            if (!getPost) return res.status(400).send({ status: false, messgage: `${postIdParams} does not exist` })
            else{
              
                 const commentAdded = await postModel.findOneAndUpdate({_id:postIdParams},{$push:{Comments:{userId:userId,commentByuser:Comments}}},{new:true});
                      
           res.status(200).send({ status: true, message: "Comment Succesfully added", data:commentAdded })
                };


      } catch(error){
         res.status(500).send({status:false, message: error.message})
      }

}


//===================================getPost by Id========================================
const getPostById = async (req, res) => {

    try {
         let postIdinParams = req.params.postId?.toString().trim()
        
        //============================================================================== validations for ObjectId==============================================================================


        if (!isValidObjectId(postIdinParams)) {
            return res.status(400).send({ status: false, message: "Invalid Post Id" })
        }

        
        //==============================================================================after checking the deletion of the Post ==============================================================================
        const getPostByIdPost = await postModel.findOne({ _id: postIdinParams, isDeleted: false }).select({"likes":1,"Comments":1});
        if (!getPostByIdPost) return res.status(404).send({ status: false, message: "post not found or it is already deleted" });


        return res.status(200).send({ status: true, message: "Post Details fetched Succesfully", data:getPostByIdPost })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};


//===================================get all the post posted by one user========================================
const getAllposts = async(req,res) => {
     try{

        let userId = req.body.userId?.toString().trim()

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid Post Id" })
        }

        
        let checkuser = await userModel.findOne({ _id: userId })

        if (!checkuser) {
            return res.status(404).send({ status: false, message: "user doesn't exist" })
        }          
       let allpost = await postModel.find({userId:userId}).sort( { 'timestamp': -1 } ).select({"_id":1,"Title":1,"Description":1,"Comments":1, "likes":1, "createdAt":1})

       if(allpost.length===0){
        return res.status(400).send({status:false, message: "There is no post available created by the User"})
       }
        return res.status(200).send({status:true,message:"All posts fetched succesfully", data: allpost})
     } catch(error){
        res.status(500).send({status:false, message:error.message})
     }
};

module.exports = {createPost,deletePostById,likePostById,UnlikePostById,writeComment,getPostById,getAllposts}