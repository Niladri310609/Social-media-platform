
const express = require('express')
const router = express.Router()


router.get('/', function(){
     res.end(console.log("hello world")) 
})






router.all("/*", function (req, res) {
    res.status(404).send({ status: false, msg: "The api you requested is not available" });
  });
  
  module.exports = router;