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
  } = req.body;
  if (!itemId || !buyerId || !sellerId || !txn) {
    res.status(422).json({
      error: "Please make sure to connect your wallet and complete the fields",
    });
  }
  Order.findOne({ item: itemId }).then((savedItem) => {
    if (savedItem) {
      return res
        .status(200)
        .send({ message: "Already Bought", data: savedItem });
    }
    const order = new Order({
      item: itemId,
      buyer: buyerId,
      seller: sellerId,
      txn,
      address1,
      address2,
      postcode,
      state,
      country,
      status: "PROCESSING",
    });

    Item.findByIdAndUpdate(
      itemId,
      {
        $set: {
          boughtBy: buyerId,
        },
      },
      {
        new: true,
      },
      (err, item) => {
        if (err) {
          return res.status(422).json({ error: "update error" });
        }
        order
          .save()
          .then((result) => {
            res.json({ result, item, message: "Updated Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    );
  });
});

router.post("/myOrders", (req, res) => {
  Order.find({
    buyer: req.body._id,
  })
    .populate("item", "_id title photo price")
    .populate("buyer", "_id name walletAdd")
    .populate("seller", "_id name walletAdd")
    .then((order) => {
      res.json({
        order,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/mySold", (req, res) => {
  Order.find({
    seller: req.body._id,
  })
    .populate("item", "_id title photo price")
    .populate("buyer", "_id name walletAdd")
    .populate("seller", "_id name walletAdd")
    .then((order) => {
      res.json({
        order,
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
