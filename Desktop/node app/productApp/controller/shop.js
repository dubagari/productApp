/** @format */

const Product = require("../model/product");
const Order = require("../model/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((product) => {
      console.log(product);
      res.render("shop/index", {
        prods: product,
        pageTitle: "shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getproductlis = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "shop",
        path: "/product-list",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((order) => {
    res.render("shop/order", {
      pageTitle: "Order",
      path: "/order",
      order: order,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: { name: req.user.name, userId: req.user },
        product: products,
      });
      return order.save();
    })
    .then((resul) => {
      return req.user.clearCart();
    })
    .then((result) => {
      res.redirect("/order");
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "cart",
        path: "/cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
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
    .removeFromCart(prodId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
