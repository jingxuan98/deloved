const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Item = mongoose.model("Item");

router.get("/allItems", (req, res) => {
  Item.find()
    .populate("postedBy", "_id name")
    .sort("-createdAt")
    .then((items) => {
      res.json({ items });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myitem", (req, res) => {
  Item.find({
    postedBy: req.user._id,
  })
    .populate("postedBy", "_id name walletAdd")
    .then((myitem) => {
      res.json({
        myitem,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createItem", (req, res) => {
  const { title, body, pic, status, price, catogery } = req.body;
  if (!title || !body || !price || !catogery) {
    res.status(422).json({
      error: "Please make sure to connect your wallet and complete the fields",
    });
  }
  const item = new Item({
    title,
    body,
    photo: pic,
    status,
    price,
    catogery,
    postedBy: req.body._id,
  });

  item
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

router.delete("/deleteItem/:itemId", (req, res) => {
  Item.findOne({ _id: req.params.itemId })
    .populate("postedBy", "_id name walletAdd")
    .exec((err, item) => {
      if (err || !item) {
        return res.status(422).json({ error: err });
      }
      if (item.postedBy._id.toString() === req.body._id.toString()) {
        item
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.put("/updateItem/:itemId", (req, res) => {
  const { title, body, pic, price, catogery } = req.body;
  Item.findByIdAndUpdate(
    req.params.itemId,
    {
      $set: {
        title,
        body,
        photo: pic,
        price,
        catogery,
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

router.put("/like", (req, res) => {
  Item.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.body._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name walletAdd")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike", (req, res) => {
  Item.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.body._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name walletAdd")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
