const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: ObjectId,
      ref: "Order",
      required: true,
    },
    message: {
      type: String,
      default: "Empty Review Message",
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Review", reviewSchema);
