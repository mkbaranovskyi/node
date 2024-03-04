const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    address: [{ type: Schema.Types.ObjectId, ref: 'address', require: true }],
    cart: [
      {
        // Previously we refered to the Product model within the same microservice, but now we need to refer to the Product model in the product microservice.
        // product: { type: Schema.Types.ObjectId, ref: 'product', require: true },
        product: {
          _id: { type: Schema.Types.ObjectId, require: true },
          name: { type: String, require: true },
          banner: { type: String },
          price: { type: Number, require: true },
        },
        unit: { type: Number, require: true },
      },
    ],
    wishlist: [
      // Again, we need to refer to the Product model in the product microservice instead of the Product model in the same microservice.
      // {
      //   type: Schema.Types.ObjectId,
      //   ref: 'product',
      //   require: true,
      // },
      {
        _id: { type: Schema.Types.ObjectId, require: true },
        name: { type: String, require: true },
        description: { type: String },
        banner: { type: String },
        price: { type: Number, require: true },
        available: { type: Boolean },
      },
    ],
    // Same
    // orders: [{ type: Schema.Types.ObjectId, ref: 'order', require: true }],
    orders: [
      {
        _id: { type: Schema.Types.ObjectId, require: true },
        amount: { type: Number },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.salt
        delete ret.__v
      },
    },
    timestamps: true,
  }
)

module.exports = mongoose.model('customer', CustomerSchema)
