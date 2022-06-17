import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../pages/_app";
import {
  TagOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { Card, Avatar, notification, Comment, Tooltip } from "antd";
import { Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";
import moment from "moment";
import { User } from "../Profile/props";
import Loader from "../Loader";

const fallback =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/1200px-Faenza-avatar-default-symbolic.svg.png";

const ChatList: React.FC<Props> = (props) => {
  const { data } = props;
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUserChatRooms = async () => {
  //     await fetch(`http://localhost:5002/getUserChatRooms/${user?.data?._id}`, {
  //       method: "get",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         const { chatRooms } = result;
  //         setChatRoomData(chatRooms.chatRooms);
  //         console.log(chatRooms.chatRooms);
  //       });
  //   };

  //   if (user?.data) {
  //     fetchUserChatRooms();
  //     console.log("fetch Dataed");
  //   }
  // }, []);

  // const like = async () => {
  //   await fetch(`http://localhost:5002/like/${_id}`, {
  //     method: "put",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       userId: user?.data?._id,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       setItemData(result);
  //     });
  // };

  return (
    <div style={{ flexDirection: "column" }} className={styles.innerContainer}>
      {data.length != 0 ? (
        data.map((chatRoom) => {
          const { users, chats } = chatRoom;
          let chatSender: User;

          users.map((roomUser) => {
            if (roomUser._id != user?.data?._id) {
              chatSender = { ...roomUser };
            }
          });

          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                router.replace(`/chat/${chatRoom._id}`);
              }}
            >
              <Comment
                author={<a>{chatSender?.name || chatSender?.walletAdd}</a>}
                avatar={
                  <Avatar src={chatSender?.pic || fallback} alt="avatar" />
                }
                content={
                  chats[0] ? (
                    <p>{chats[0].message.text}</p>
                  ) : (
                    `Say your First HI!`
                  )
                }
                datetime={
                  <span>
                    {chats[0]
                      ? moment(chats[0].createdAt).format("DD-MM-YYYY hh:mm")
                      : ``}
                  </span>
                }
              />
            </div>
          );
        })
      ) : (
        <div>
          <h2 className={styles.header1}>No Chats Yet....</h2>
        </div>
      )}
    </div>
  );
};

export default ChatList;
