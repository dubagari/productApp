/** @format */

const Product = require("../model/product");
const Cart = require("../model/cart");

exports.getIndex = (req, res, next) => {
  Product.fatchAll()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDtails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/product-list",
      });
    })
    .catch((err) => console.log(err));
};

exports.getproductlis = (req, res, next) => {
  Product.fatchAll()
    .then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "shop",
        path: "/product-list",
      });
    })
    .catch((err) => console.log(err));
};

// exports.getOrder = (req, res, next) => {
//   res.render("shop/order", {
//     pageTitle: "Order",
//     path: "/order",
//   });
// };

// exports.postOrder = (req, res, next) => {
//   req.user
//     .addOrder()
//     .then((result) => {
//       res.redirect("/order");
//     })
//     .catch((err) => console.log(err));
// };

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCartFromItems(prodId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
