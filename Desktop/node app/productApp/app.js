/** @format */

const express = require("express");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const path = require("path");
const flash = require("connect-flash");

const rooRouter = require("./util/path");

const shopRoute = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const error404 = require("./controller/error");
const User = require("./model/user");
const csrfProtection = csrf();

const MONGODB_URI =
  "mongodb+srv://dubagari:dubagari@dubagari1.nmpipjp.mongodb.net/?retryWrites=true&w=majority&appName=dubagari1";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(express.static(path.join(rooRouter, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: " my secret",
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

app.use(csrfProtection);

app.use(flash());

app.set("view engine", "ejs");

app.set("views", "views");

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoute);
app.use(authRoutes);

app.use(error404.error404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
