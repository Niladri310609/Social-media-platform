const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')



const jwt = require('jsonwebtoken');

const { isValid, isValidRequestBody, isValidObjectId,isValidName, isValidEmail, isValidPhone,validString,isValidPassword } = require('../validation/validation')

//REGISTER USER==========>
const createUser = async function (req, res) {
    try {

        let data = req.body
         

        // ====================================== Destructuring the request Body ======================================


        let { fname, lname, phone, email, password} = data

        //============================================validations for inputs================================

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Input Data for Creating User" })
        }

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required..." })
        }
        if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "Please Enter a valid First Name" })

        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required..." })
        }
        if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Please Enter a valid last Name" })

        if (!(phone)) {
            return res.status(400).send({ status: false, message: "Phone No. is required" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Email is required" })
        }


        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }
         if(!isValidPassword(password)){
             return res.status(400).send({status:false , messsage: "password is invalid (Should Contain Alphabets, numbers, quotation marks  & [@ , . ; : ? & ! _ - $], and the length should be between 8 to 15"})
         }



        //============================================= Validations for email and password ===============================
         if(phone =="") return res.status(400).send({status:false , message : "Phone Number cannot be empty"})
        
        if(phone){
        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "please enter a valid Phone no" });
        }
    }

        const isRegisteredphone = await userModel.findOne({ phone }).lean();

        if (isRegisteredphone) {
            return res.status(400).send({ status: false, message: "phoneNo number already registered" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid Email" });
        }

        const isRegisteredEmail = await userModel.findOne({ email }).lean();
        if (isRegisteredEmail) {
            return res.status(400).send({ status: false, message: "email id already registered" });
        }

        if (password=="" || password.trim().length < 8) {
            return res.status(400).send({ status: false, message: "Your password must be at least 8 characters" })
        }

        if (password.trim().length > 15) {
            return res.status(400).send({ status: false, message: "Password cannot be more than 15 characters" })
        }

        const bcryptPassword = await bcrypt.hash(password, 6)
        data.password = bcryptPassword

        

        const userCreated = await userModel.create(data)

        res.status(201).send({ status: true, message: "Success", data: userCreated })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, error: err.message });
    }
}

//LoGIN USER ========================================================


const loginUser = async (req, res) => {

    try {
        let requestBody = req.body;

        // structuring Body

        const { email, password } = requestBody;

        // Validation starts

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "Please enter login credentials" });
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "Enter an email" });
            return;
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "enter a password" });
            return;
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
        }
        // ===============================================Encrypting the password && create Token=============================

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ status: false, message: `Invalid login credentials, email id doesn't exist` });
        }

        let hashedPassword = user.password

        const checkPassword = await bcrypt.compare(password, hashedPassword)

        if (!checkPassword) return res.status(401).send({ status: false, message: `Invalid login credentials , Invalid password` });

        const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 168 * 60 * 60
        }, 'Hercules')


      

        res.status(200).send({ status: true, messsge: "User Login Successful", data: { userId: user._id, token: token } });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, error: error.message });
    }
}

// get User Details =========================
let getById = async (req, res) => {
    try {
        const UserIdData = req.params.userId

        if (!isValidObjectId(UserIdData)) return res.status(400).send({ status: false, message: 'userId is not valid' })

        let user = await userModel.findById(UserIdData)

        if (!user) return res.status(400).send({ status: false, messgage: ' user does not exists' })

        return res.status(200).send({ status: true, message: 'User pfofile details', data: user })
    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

//updateUser details ===================
const updateUser = async (req, res) => {

    try {
       
        let requestBody = req.body
        let { fname, lname, phone, email, password} = requestBody //destructing body
        let userId = req.params.userId
        let userIdFromToken = req.userId;  
    
       // ============================= validation for inputs =============================
        
        if ( Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Input field cannot be empty" })
        }
     if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
  
        }
        if (!isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `Token is not Valid` })
        }
  
        //============================== checking User Id and Authorization=============================
  
        const findUserProfile = await userModel.findOne({ _id: userId })
        if (!findUserProfile) {
            return res.status(400).send({
                status: false,
                message: `User doesn't exists by ${userId}`
            })
        }
        
        //====================================================validation for fname
        if (fname == "") {
            return res.status(400).send({ status: false, message: "fname cannot be empty" })
        }
        if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "Please Enter a valid First Name" })
  
        if (fname && !validString(fname)) {
            return res.status(400).send({ status: false, message: 'fname is Required' })
        }
        if (fname) {
            if (!isValid(fname)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide fname" })
            }
        }
  
        //=================================================validation for lname
  
        if (lname == "") {
            return res.status(400).send({ status: false, message: "lname cannot be empty" })
        }
        if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Please Enter a valid Last Name" })
  
        if (lname && !validString(lname)) {
            return res.status(400).send({ status: false, message: 'lname is Required' })
        }
        if (lname) {
            if (!isValid(lname)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide lname" })
            }
        }
        
        //=======================================================validation for email
        if (email == "") {
            return res.status(400).send({ status: false, message: "email cannot be empty" })
        }
        if (email) {
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide email" })
            }
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: `Email should be a valid email address` });
            }
            let isEmailAlredyPresent = await userModel.findOne({ email: email })
            if (isEmailAlredyPresent) {
                return res.status(400).send({ status: false, message: `Unable to update email. ${email} is already registered.` });
            }
        }
        //================================================ validation for phone
  
        if (phone == "") return res.status(400).send({ status: false, message: "phone Number cannot be empty" })
        if (phone) {
           /* if (!isValid(phone)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Phone number." })
            }*/
            if (!isValidPhone(phone)) {
                return res.status(400).send({ status: false, message: `Please enter a valid phone number` });
            }
            let isPhoneAlredyPresent = await userModel.findOne({ phone: phone })
            if (isPhoneAlredyPresent) {
                return res.status(400).send({ status: false, message: `Unable to update phone. ${phone} is already registered.` });
            }
        }
  
        //============================================== validation for Password
  
        if(password=="") return res.status(400).send({status:false ,message: "password must be present"})
        let tempPassword = password
        if (tempPassword) {
            if (!isValid(tempPassword)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide password" })
            }
            if(!isValidPassword(password)){
                return res.status(400).send({status:false , messsage: "password is invalid (Should Contain Alphabets, numbers, quotation marks  & [@ , . ; : ? & ! _ - $], and the length should be between 8 to 15"})
            }
            
            var encryptedPassword = await bcrypt.hash(tempPassword,6)
        }
 
        
  
        let changeProfileDetails = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                fname: fname,
                lname: lname,
                email: email,
              //  profileImage: updatedProfileImage,
                phone: phone,
                password: encryptedPassword,
                
            }
        }, { new: true })
        return res.status(200).send({ status: true, message:"User Profile Updated",data: changeProfileDetails })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
  };

//Follow User ===================
  const followUser = async(req,res) => {
      try{
         let {userId} = req.body  
         let userParams = req.params.userId
          let userIdFromToken = req.userId
                // ============================= validation for inputs =============================
        
        if ( Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Input field cannot be empty" })
        }
     if (!isValidObjectId(userId || userParams)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
  
        }
        if (!isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `Token is not Valid` })
        }
  
        //============================== checking User Id and Authorization=============================
  
        const findUserProfile = await userModel.findOne({ _id: userId })
        if (!findUserProfile) {
            return res.status(400).send({
                status: false,
                message: `User doesn't exists by ${userId}`
            })
        }

          if(userId !== userParams){

            const user = await userModel.findById(userParams);
             const currentUser = await userModel.findById(userId).select({"password":0,"followers":0,"followings":0,"createdAt": 0, "updatedAt":0,  "__v":0})

             if(!user.followers.includes(userId)){
                 await user.updateOne({$push:{followings:userId}});
                 await currentUser.updateOne({$push:{followers:userId}});

                 res.status(200).send({status:true, message: "User has been followed",data :currentUser})
             } else{
                   res.status(400).send({status:false, message: "You already followed this user"})
             }

          } else{
             res.status(400).send({status:false, message: "You can't follow yourself"})

          }
        } catch(error) {
            res.status(500).send({status:false, message: error.message})
        }    
  };
//Unfollow user =========================
  const unfollowUser = async(req,res) => {
    try{
       let {userId} = req.body  
       let userParams = req.params.userId
        let userIdFromToken = req.userId
              // ============================= validation for inputs =============================
      
      if ( Object.keys(req.body).length == 0) {
          return res.status(400).send({ status: false, message: "Input field cannot be empty" })
      }
   if (!isValidObjectId(userId || userParams)) {
          return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })

      }
      if (!isValidObjectId(userIdFromToken)) {
          return res.status(400).send({ status: false, message: `Token is not Valid` })
      }

      //============================== checking User Id and Authorization=============================

      const findUserProfile = await userModel.findOne({ _id: userId })
      if (!findUserProfile) {
          return res.status(400).send({
              status: false,
              message: `User doesn't exists by ${userId}`
          })
      }

        if(userId !== userParams){

          const user = await userModel.findById(userParams);
           const currentUser = await userModel.findById(userId).select({"password":0,"followers":0,"followings":0,"createdAt": 0, "updatedAt":0,  "__v":0})

           if(user.followings.includes(userId)){
               await user.updateOne({$pull:{followings:userId}});
               await currentUser.updateOne({$pull:{followers:userId}});

               res.status(200).send({status:true, message: "User has been unfollowed"})
           } else{
                 res.status(400).send({status:false, message: "You don't follow this user"})
           }

        } else{
           res.status(400).send({status:false, message: "You can't unfollow yourself"})

        }
      } catch(error) {
          res.status(500).send({status:false, message: error.message})
      }    
};
 





module.exports ={createUser,loginUser, getById,updateUser, followUser, unfollowUser}