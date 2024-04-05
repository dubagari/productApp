/** @format */

const express = require("express");

const authController = require("../controller/auth");

const routes = express.Router();

routes.get("/login", authController.getLogin);

routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

module.exports = routes;