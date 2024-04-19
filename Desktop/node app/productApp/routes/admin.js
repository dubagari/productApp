/** @format */

const express = require("express");

const adminController = require("../controller/admin");
const isAuth = require("../midd/isAuth");

const routes = express.Router();

routes.get("/add-product", isAuth, adminController.getAddproduct);

routes.post("/add-product", isAuth, adminController.postProduct);

routes.get("/product", isAuth, adminController.getProduct);

routes.get("/edit-product/:productId", adminController.geteditproduct);

routes.post("/edit-product", isAuth, adminController.postEditproduct);

routes.post("/delete-product", isAuth, adminController.postDelete);

module.exports = routes;
