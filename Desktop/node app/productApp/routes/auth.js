/** @format */

const express = require("express");

const authController = require("../controller/auth");

const routes = express.Router();

routes.get("/login", authController.getLogin);

routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.get("/signup", authController.getSignup);

routes.post("/signup", authController.postSignup);

routes.get("/reset", authController.getRest);

routes.post("/reset", authController.postReset);

routes.get("/reset/:token", authController.getRestPassword);

routes.post("/new-password", authController.postNewpassword);

module.exports = routes;
