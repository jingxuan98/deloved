const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
  item: {
    type: ObjectId,
    ref: "Item",
    required: true,
  },
  buyer: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  txn: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  postcode: {
    type: Number,
    minLength: 6,
    maxLength: 6,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  status: {
    type: String,
    enum: ["PROCESSING", "COMPLETED", "SHIPPED"],
    default: "PROCESSING",
  },
  trackingNo: {
    type: String,
  },
  courrierName: {
    type: String,
  },
});

mongoose.model("Order", orderSchema);
