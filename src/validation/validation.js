const mongoose = require('mongoose')

//email validation
const isValidEmail = function (email) {
    const emailRegex = /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/
    return emailRegex.test(email)
}
// mobile validation
const isValidPhone = function (Phone) {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(Phone)
}
//validation for Value
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value !== 'string' || value.trim().length === 0 || value=="") return false
    return true;
}
//title validation
const isValidScripts= function(title){
    const scriptRegex = /^(?![0-9]*$)[A-Za-z0-9\s\-_,\.;:()]+$/
    return scriptRegex.test(title)
}
const isValidName = function(name){
    const nameRegex =/^[A-Za-z]+$/i
    return nameRegex.test(name)
}

//validation of  empty string
const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
//validation for Request Body
const isValidRequestBody = function (request) {
    return (Object.keys(request).length > 0)
}
//validation for ObjectId
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
//password validation
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
}

  const isValidNumber=function(number){
    if(!number || number.toString().trim().length==0) return false;
    if(isNaN(Number(number.toString().trim()))) return false
    return true
}
const isValidtitle = function (name) {
    const nameRegex = /^[a-zA-Z , ]{5,50}$/
    return nameRegex.test(name)
}
const isValidesc = function (name) {
    const nameRegex = /^[a-zA-Z , ]{15,1000}$/
    return nameRegex.test(name)
}


module.exports={isValid,isValidRequestBody,isValidObjectId,isValidEmail, isValidScripts,isValidNumber,isValidPhone,isValidPassword,isValidName,validString,isValidtitle,isValidesc}