import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      //reference the user model using ref keyword
      ref: "User",
    },
    // array of orderItems
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    // shippingAddress are embedded objects
    shippingAddress: {
      addressFromState: { type: String, required: true },
      cityFromState: { type: String, required: true },
      postalCodeFromState: { type: String, required: true },
      countryCodeFromState: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: false,
    },
    // comes from paypal api
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  //   second argument timestamps will create a timestamp field automatically i.e(created at)
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
