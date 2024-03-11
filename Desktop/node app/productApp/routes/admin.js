/** @format */

const express = require("express");

const adminController = require("../controller/admin");

const routes = express.Router();

routes.get("/add-product", adminController.getAddproduct);

routes.post("/add-product", adminController.postProduct);

routes.get("/product", adminController.getProduct);

routes.get("/edit-product/:productId", adminController.geteditproduct);

routes.post("/edit-product", adminController.postEditproduct);

routes.post("/delete-product", adminController.postDelete);

module.exports = routes;
