const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  pickupPerson: String,
  customerTotal: Number,
  orderDate: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  orderData: [
    {
      title: { type: String, required: true },
      description: { type: String, maxlength: 1000 },
      currency: { type: String, required: true },
      pricePerDay: { type: Number, required: true, min: 0 },
      images: [{ type: String }],
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          index: "2dsphere", // Define as a 2dsphere index for geospatial queries
        },
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Customer",
        required: true,
      },
      verificationStatus: {
        type: Boolean,
        required: true,
        default: true,
      },
      isAvailable: { type: Boolean, default: true },
      category: {
        type: String,
        enum: ["Electronics", "Home and Garden", "Party", "Film and Photography", "Sports and leisures", "Construction Tools", "Others"],
      },
      dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
      manufacturer: {
        name: { type: String },
        address: { type: String },
      },
      reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
          comment: { type: String },
          rating: { type: Number, min: 1, max: 5 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      availableDays: {
        type: Date,
        default: () => {
          const currentDate = new Date();
          const dateString = currentDate.toISOString().substring(0, 10);
          return dateString;
        }
      },
      datePosted: { type: String },
      priceRange: { type: String },
    }
  ],
  // borrower: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Customer",
  //   required: true,
  // },
  // startDate: { type: Date, required: true },
  // endDate: { type: Date, required: true },
  // totalPrice: { type: Number, required: true, min: 0 },
  // status: {
  //   type: String,
  //   enum: ["pending", "completed", "cancelled"],
  //   default: "pending",
  // },
  // deliveryAddress: {
  //   addressLine1: { type: String, required: true },
  //   addressLine2: { type: String },
  //   city: { type: String, required: true },
  //   state: { type: String, required: true },
  //   postalCode: { type: String, required: true },
  //   country: { type: String, required: true },
  // },
  // paymentDetails: {
  //   cardNumber: { type: String, required: true, match: /^\d{16}$/ }, // Basic card number validation (16 digits)
  //   cardholderName: { type: String, required: true },
  //   expiryDate: {
  //     type: String,
  //     required: true,
  //     match: /^(0[1-9]|1[0-2])\/\d{2}$/,
  //   }, // MM/YY format
  //   cvv: { type: String, required: true, match: /^\d{3,4}$/ }, // CVV of 3 or 4 digits
  // },
  createdAt: { type: Date, default: Date.now }, // Recording order creation date
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
