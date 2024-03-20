/** @format */

const mongoose = require("mongoose");

const schema = mongoose.Schema;

const productSchema = new schema({
  title: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },

  userId: {
    type: schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");

// const getDB = require("../util/database").getDB;

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDB();

//     let dbopp;

//     if (this._id) {
//       dbopp = db
//         .collection("product")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbopp = db.collection("product").insertOne(this);
//     }
//     return dbopp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   static fatchAll() {
//     const db = getDB();
//     return db
//       .collection("product")
//       .find()
//       .toArray()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDB();
//     return db
//       .collection("product")
//       .findOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = getDB();
//     return db
//       .collection("product")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(() => console.log("Product deleted!!"))
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
