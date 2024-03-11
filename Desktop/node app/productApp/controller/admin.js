/** @format */

const mongodb = require("mongodb");
const Product = require("../model/product");

const objectId = mongodb.ObjectId;

exports.getAddproduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "add-products",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    imageUrl,
    price,
    description,
    null,
    req.user._id
  );
  product
    .save()
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.geteditproduct = (req, res, next) => {
  const editingMode = req.query.edit;
  if (!editingMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit products",
        path: "/admin/edit-product",
        editing: editingMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditproduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const UpdatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(
    updatedTitle,
    updatedImageUrl,
    UpdatedPrice,
    updatedDescription,
    prodId
  );
  updatedProduct
    .save()
    .then(() => {
      console.log("product is updated!!");
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  Product.fatchAll()
    .then((product) => {
      res.render("admin/product", {
        prods: product,
        pageTitle: "admin product",
        path: "/admin/product",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDelete = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      res.redirect("/admin/product");
    })
    .catch((err) => console.log(err));
};
