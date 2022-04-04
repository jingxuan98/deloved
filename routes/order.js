const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const Order = mongoose.model("Order");
const User = mongoose.model("User");

router.post("/createOrder", (req, res) => {
  const {
    itemId,
    buyerId,
    sellerId,
    txn,
    address1,
    address2,
    postcode,
    state,
    country,
    status,
  } = req.body;
  if (!itemId || !buyerId || !sellerId || !txn) {
    res.status(422).json({
      error: "Please make sure to connect your wallet and complete the fields",
    });
  }
  const order = new Order({
    item: itemId,
    buyer: req.body.buyerId,
    seller: req.body.sellerId,
    txn,
    address1,
    address2,
    postcode,
    state,
    country,
    status,
  });

  order
    .save()
    .then((result) => {
      res.json({
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/updateOrder/:orderId", (req, res) => {
  const { trackingNo, courrierName } = req.body;
  Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $set: {
        trackingNo,
        courrierName,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "update error" });
      }
      res.json({ result, message: "Updated Successfully" });
    }
  );
});

module.exports = router;
