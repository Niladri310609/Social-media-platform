const express = require("express");
const bodyParser = require("body-parser");
const CORS = require("cors")

const mongoose = require("mongoose");

const route = require("./routes/routes.js");

const app = express();
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(CORS());
mongoose
  .connect(
    "mongodb+srv://REYNIL310609:OnIYmcfVuOkV0Dkr@cluster0.csvzw.mongodb.net/Reunionassignment?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongodb Rock n Roll on 3000"))
  .catch((err) => console.log(err));

app.use("/", route);


app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

