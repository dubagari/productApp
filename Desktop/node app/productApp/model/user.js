/** @format */
const mongodb = require("mongodb");
const getDb = require("../util/database").getDB;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const updatedCartIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items];

    if (updatedCartIndex >= 0) {
      newQuantity = this.cart.items[updatedCartIndex].quantity + 1;
      updatedCartItems[updatedCartIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });

    return db
      .collection("product")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((product) => {
        return product.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteCartFromItems(productId) {
    const updatedCartItem = this.cart.items.filter((items) => {
      return items.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItem } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((product) => {
        const order = {
          items: product,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrder() {}

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
