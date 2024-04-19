/** @format */

const express = require("express");

const shopController = require("../controller/shop");
const isAuth = require("../midd/isAuth");

const routes = express.Router();

routes.get("/", shopController.getIndex);

routes.get("/product-list", shopController.getproductlis);

routes.get("/product-details/:productId", shopController.getProductDtails);

routes.get("/cart", isAuth, shopController.getCart);

routes.post("/cart", isAuth, shopController.postCart);

routes.get("/order", isAuth, shopController.getOrder);

routes.post("/order", isAuth, shopController.postOrder);

routes.post("/cart-delete-items", isAuth, shopController.postCartDelete);

module.exports = routes;
