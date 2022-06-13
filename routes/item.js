const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Item = mongoose.model("Item");

router.get("/allItems", (req, res) => {
  Item.find({ status: "UNSOLD" })
    .populate("postedBy", "_id name")
    .populate("boughtBy", "_id name walletAdd")
    .sort("-createdAt")
    .then((items) => {
      res.json({ items });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/item/:id", (req, res) => {
  Item.find({ _id: req.params.id })
    .populate("postedBy", "_id name walletAdd")
    .populate("boughtBy", "_id name walletAdd")
    .sort("-createdAt")
    .then((item) => {
      res.json({ item });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/search", (req, res) => {
  let itemPattern = new RegExp("^.*" + req.body.query + ".*$");
  Item.find({
    title: { $regex: itemPattern, $options: "i" },
    status: "UNSOLD",
  })
    .then((item) => {
      res.json({ item });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/myitem", (req, res) => {
  Item.find({
    postedBy: req.body._id,
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

router.get("/wishlist/:id", (req, res) => {
  Item.find({
    likes: { $in: req.params.id },
  })
    .populate("postedBy", "_id name walletAdd")
    .then((likedItem) => {
      res.json({
        likedItem,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createItem", (req, res) => {
  const { title, body, photo, status, price, catogery } = req.body;
  if (!title || !body || !price || !catogery) {
    res.status(422).json({
      error: "Please make sure to connect your wallet and complete the fields",
    });
  }
  const item = new Item({
    title,
    body,
    photo,
    status,
    price,
    catogery,
    postedBy: req.body._id,
  });

  item
    .save()
    .then((post) => {
      res.json({
        post,
      });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
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
  const { title, body, photo, price, catogery } = req.body;
  Item.findByIdAndUpdate(
    req.params.itemId,
    {
      $set: {
        title,
        body,
        photo,
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

router.put("/like/:id", (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    {
      $push: { likes: req.body.userId },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name walletAdd")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ message: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/unlike/:id", (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.body.userId },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name walletAdd")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ message: err });
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
