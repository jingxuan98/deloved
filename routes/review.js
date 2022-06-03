const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Review = mongoose.model("Review");

router.get("/userReview/:id", async (req, res) => {
  Review.find({ user: ObjectId(req.params.id) })
    .populate("order.item", "title photo price")
    .populate("user", "_id walletAdd name pic")
    .sort("-createdAt")
    .then((reviews) => {
      res.json({ reviews, message: "User Reviews Found" });
    })
    .catch((err) => {
      return res.json({ message: "No Review for User" });
    });
});

router.post("/createReview", (req, res) => {
  const { orderId, message, userId, rating } = req.body;
  if (!orderId || !userId || !rating) {
    res.status(422).json({
      message:
        "Please make sure you complete the fields for submitting a review",
    });
  }
  const review = new Review({
    order: orderId,
    message,
    user: userId,
    rating,
  });

  review
    .save()
    .then((review) => {
      res.json({
        review,
      });
    })
    .catch((err) => {
      return res.status(422).json({ message: err });
    });
});

module.exports = router;
