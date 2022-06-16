const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const chatSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Chat", chatSchema);
