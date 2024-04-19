/** @format */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  resetToken: String,
  resetTokenExperation: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },

        quantity: { type: Number, require: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItem = this.cart.items.filter((items) => {
    return items.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItem;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };

  return this.save();
};
module.exports = mongoose.model("User", userSchema);
