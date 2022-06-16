const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const ChatRoom = mongoose.model("ChatRoom");
const Chat = mongoose.model("Chat");

router.post("/chatRoom", (req, res) => {
  const { sender, receiver, text } = req.body;
  if (!sender || !receiver) {
    res.status(422).json({
      message: "Please make sure you have both User IDs",
    });
  }

  ChatRoom.findOne({ users: { $all: [sender, receiver] } }).exec(
    async (err, chatRoom) => {
      if (err) {
        return res.status(422).json({ message: err });
      }
      if (!chatRoom) {
        const chatroom = await new ChatRoom({
          users: [sender, receiver],
        });

        const chatRoomSaved = await chatroom.save();

        await chatRoomSaved
          .populate("users chats")
          .then((chatroom) => {
            User.findByIdAndUpdate(
              sender,
              {
                $addToSet: { chatRooms: chatroom._id.toString() },
              },
              {
                new: true,
              }
            ).exec((err, result) => {
              if (err) {
                return res.status(422).json({ message: err });
              }
            });
            User.findByIdAndUpdate(
              receiver,
              {
                $addToSet: { chatRooms: chatroom._id.toString() },
              },
              {
                new: true,
              }
            ).exec((err, result) => {
              if (err) {
                return res.status(422).json({ message: err });
              }
            });
            res.json({
              chatroom,
              message: "Chat Room Created",
            });
          })
          .catch((err) => {
            return res.status(422).json({ message: err });
          });
      } else {
        res.json({ chatRoom, message: "Chat Room Exist" });
      }
    }
  );
});

router.post(`/chatRoomSend/:id`, async (req, res) => {
  const { sender, receiver, text } = req.body;

  if (!sender || !receiver || !text) {
    res.status(422).json({
      message: "Please make sure you have both User IDs",
    });
  }

  const chat = await new Chat({
    message: {
      text,
    },
    sender,
  });

  await chat.save();

  ChatRoom.findByIdAndUpdate(
    { _id: req.params.id, users: { $all: [sender, receiver] } },
    {
      $push: { chats: [chat] },
    },
    {
      new: true,
    }
  )
    .populate("users chats")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ message: err });
      } else {
        res.json(result);
      }
    });
});

router.post("/getRoomChats/:id", (req, res) => {
  //   const { sender, receiver } = req.body;

  //   if (!sender || !receiver) {
  //     res.status(422).json({
  //       message: "Please make sure you have both User IDs",
  //     });
  //   }
  ChatRoom.findOne({ _id: req.params.id })
    .populate("chats users")
    .exec((err, chats) => {
      if (err) {
        return res.status(422).json({ message: err });
      } else {
        res.json({ chats, message: "Message Fetched" });
      }
    });
});

router.get("/getUserChatRooms/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate({
      path: "chatRooms",
      options: { sort: "-updatedAt" },
      populate: {
        path: "chats",
        model: "Chat",
        options: { sort: "-updatedAt" },
        limit: 1,
      },
    })
    .populate({
      path: "chatRooms",
      options: { sort: "-updatedAt" },
      populate: {
        path: "users",
        model: "User",
      },
    })
    .then((chatRooms) => {
      res.json({ chatRooms, message: "Message Fetched" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.post("/chatRoom", (req, res) => {
//   const { sender, receiver, text } = req.body;
//   if (!sender || !receiver || !text) {
//     res.status(422).json({
//       message: "Please make sure you complete the fields for sending a chat",
//     });
//   }

//   ChatRoom.findOne({ users: { $all: [sender, receiver] } })
//     .populate("users chats")
//     .exec(async (err, chatRoom) => {
//       if (err) {
//         return res.status(422).json({ message: err });
//       }
//       if (!chatRoom) {
//         const chat = await new Chat({
//           message: {
//             text,
//           },
//           sender,
//         });

//         await chat.save();

//         const chatroom = await new ChatRoom({
//           users: [sender, receiver],
//           chats: [chat],
//         });

//         const chatRoomSaved = await chatroom.save();

//         await chatRoomSaved
//           .populate("users chats")
//           .then((chatroom) => {
//             User.findByIdAndUpdate(
//               sender,
//               {
//                 $addToSet: { chatRooms: chatroom._id.toString() },
//               },
//               {
//                 new: true,
//               }
//             ).exec((err, result) => {
//               if (err) {
//                 return res.status(422).json({ message: err });
//               }
//             });
//             User.findByIdAndUpdate(
//               receiver,
//               {
//                 $addToSet: { chatRooms: chatroom._id.toString() },
//               },
//               {
//                 new: true,
//               }
//             ).exec((err, result) => {
//               if (err) {
//                 return res.status(422).json({ message: err });
//               }
//             });
//             res.json({
//               chatroom,
//               message: "Chat saved successfully",
//             });
//           })
//           .catch((err) => {
//             return res.status(422).json({ message: err });
//           });
//       } else {
//         // res.json({ chatRoom, message: "Chat Room Found" });
//         // chatRoom.populate("chats").execPopulate((c) => {
//         //   res.json(c);
//         // });
//         res.json({ chatRoom, message: "First Message Sent" });
//       }
//     });
// });

module.exports = router;
