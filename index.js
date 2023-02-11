const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5002;
const { MONGOURI, FRONTENDURL } = require("./config/key");
const socket = require("socket.io");
require('dotenv').config();

mongoose.connect(MONGOURI);
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

mongoose.connection.on("error", (err) => {
  console.log("mongo connecting", err);
});
app.use(cors());

require("./models/user");
require("./models/item");
require("./models/order");
require("./models/review");
require("./models/chatRoom");
require("./models/chat");

app.use(express.json());
app.use(require("./api/user"));
app.use(require("./api/item"));
app.use(require("./api/order"));
app.use(require("./api/review"));
app.use(require("./api/chat"));

const server = app.listen(PORT, () => {
  console.log("server is running", PORT);
});

const io = socket(server, {
  cors: {
    origin: FRONTENDURL,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiver);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});
