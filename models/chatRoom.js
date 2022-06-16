const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const chatRoomSchema = new mongoose.Schema(
  {
    users: [{ type: ObjectId, ref: "User" }],
    chats: [{ type: ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);

mongoose.model("ChatRoom", chatRoomSchema);
