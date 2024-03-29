/** @format */

const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const path = require("path");

const rooRouter = require("./util/path");

const shopRoute = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const error404 = require("./controller/error");
const User = require("./model/user");

const app = express();

app.use(express.static(path.join(rooRouter, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  User.findById("65f6af336df01266c0003f4c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(error404.error404);

mongoose
  .connect(
    "mongodb+srv://dubagari:dubagari@dubagari1.nmpipjp.mongodb.net/?retryWrites=true&w=majority&appName=dubagari1"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "abubakar",
          email: " super@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
