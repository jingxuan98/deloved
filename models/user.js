const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  walletAdd: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1200px-Faenza-avatar-default-symbolic.svg.png",
  },
  // rating: {
  //   type: ObjectId,
  //   ref: "Review",
  // },
  _type: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

mongoose.model("User", userSchema);
