const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    nights: {
      type: Number,
      required: true,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    extraGuestFee: {
      type: Number,
      required: true,
    },

    extraGuests: {
      type: Number,
      required: true,
    },

    baseAmount: {
      type: Number,
      required: true,
    },

    extraGuestAmount: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);