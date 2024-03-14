const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema(
  {
    customerId: { type: String },
    items: [
      {
        product: {
          _id: { type: String, require: true },
          name: { type: String },
          desc: { type: String },
          banner: { type: String },
          type: { type: String },
          unit: { type: Number },
          price: { type: Number },
          supplier: { type: String },
        },
        unit: { type: Number, default: 1 },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

module.exports = mongoose.model('cart', CartSchema)
