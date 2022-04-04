const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Item = mongoose.model("Item");

router.get("/user/:id", async (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      Item.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, item) => {
          if (err) {
            return res.status(422).json({ error: err });
          }

          res.json({
            user,
            item,
          });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.get("/allusers", (req, res) => {
  User.find()
    .sort("-createdAt")
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/register", (req, res) => {
  const { name, walletAdd, pic, _type } = req.body;

  if (!walletAdd) {
    return res.status(422).send({ error: "Cannot fetch wallet address" });
  }
  User.findOne({ walletAdd: walletAdd })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(200).send({ message: "Success" });
      }
      const user = new User({
        name,
        walletAdd,
        pic,
        _type,
      });

      user.save().then((user) => {
        res.json({ message: "User created successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/updatepic", (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "pic canot post" });
      }
      res.json({ result, message: "Updated Successfully" });
    }
  );
});

router.put("/update", (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    { $set: { name: req.body.name } },
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
