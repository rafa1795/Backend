const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

cartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price');
  next();
});

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;
