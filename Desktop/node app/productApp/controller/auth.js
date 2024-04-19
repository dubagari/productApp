/** @format */

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../model/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "d2024abubakar@gmail.com",
    pass: "rmbnbjplyuxfssbv",
  },
});

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMassage: req.flash("errorMassage"),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/signup",
    errorMassage: req.flash("errorMassage"),
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const passweord = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("errorMassage", " Email Already Exists");
        return res.redirect("/signup");
      }

      return bcrypt
        .hash(passweord, 12)
        .then((hashpassword) => {
          const user = new User({
            email: email,
            password: hashpassword,
            cart: { items: [] },
          });
          user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            from: {
              name: "dubagari",
              address: "d2024abubakar@gmail.com",
            }, // sender address
            to: email, // list of receivers
            subject: "signup succeeded", // Subject line

            html: "<h1>you successfully sign up</h1>", // html body
          });
        })

        .catch((err) => {
          console.log(err);
        });
    })

    .catch((err) => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("errorMassage", "Invalid Email or Password");
        return res.redirect("/login");
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getRest = (req, res, next) => {
  res.render("auth/reset", {
    pageTitle: "reset password",
    path: "/reset",
    errorMassage: req.flash("errorMassage"),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("errorMassage", "no account with that email address found");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExperation = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          from: {
            name: "dubagari",
            address: "d2024abubakar@gmail.com",
          }, // sender address
          to: req.body.email, // list of receivers
          subject: "password reset", // Subject line

          html: `<p> you requested for pass word reset</p>
           <p> click the <a href="http://localhost:3000/reset/${token}"> link </a> to reset the password
           `, // html body
        });
      })
      .catch((err) => console.log());
  });
};

exports.getRestPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExperation: { $gt: Date.now() },
  })
    .then((user) => {
      res.render("auth/new-password", {
        pageTitle: "new password",
        path: "/new-password",
        errorMassage: req.flash("errorMassage"),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewpassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExperation: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashpassord) => {
      resetUser.password = hashpassord;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExperation = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
