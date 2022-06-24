import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "../../styles/Home.module.css";
import { UserContext } from "../_app";
import { Input, Form, Button, notification } from "antd";
import Profile from "../../component/Profile";
import { useRouter } from "next/router";
import { User } from "../../component/Profile/props";
import { SendOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";

const { TextArea } = Input;

export default function ChatPage() {
  const { user, setUser } = useContext(UserContext);
  const socket = useRef();
  const scrollRef = useRef();
  const router = useRouter();
  const [form] = Form.useForm();
  const { id } = router.query;
  const [chatData, setChatData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [senderData, setSenderData] = useState<User>(null);
  const [isChatRoomUser, setIsChatRoomUser] = useState(false);

  useEffect(() => {
    const fetchChatRoomChats = async () => {
      await fetch(`http://localhost:5002/getRoomChats/${id}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setChatData(result.chats);
        });
    };

    if (user?.data) fetchChatRoomChats();
  }, [user, id]);

  useEffect(() => {
    if (user?.data) {
      socket.current = io("http://localhost:5002");
      socket.current.emit("add-user", user?.data._id);
    }
  }, [user]);

  useEffect(() => {
    if (chatData && user?.data) {
      chatData?.users &&
        chatData?.users.map((chatUser) => {
          if (chatUser._id == user?.data?._id) {
            setIsChatRoomUser(true);
          }

          if (chatUser._id != user?.data?._id) {
            setSenderData({ ...chatUser });
            msgReceive(chatUser._id);
          }
        });
      setMessagesData(chatData?.chats);
    }
  }, [chatData]);

  const onFinish = async (values: any) => {
    if (textValue == "") {
      return notification.open({
        message: "No Empty Message",
      });
    }

    await fetch(`http://localhost:5002/chatRoomSend/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: user?.data?._id,
        receiver: senderData?._id,
        text: textValue,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setTextValue("");
        form.resetFields();
      });

    socket.current.emit("send-msg", {
      sender: user?.data?._id,
      receiver: senderData?._id,
      text: textValue,
    });

    const msgs = [...messagesData];
    msgs.push({ sender: user?.data?._id, message: { text: textValue } });
    setMessagesData(msgs);
  };

  const msgReceive = (id: string | string[]) => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({
          sender: data.sender,
          message: { text: data.text },
        });
      });
    }
  };

  useEffect(() => {
    arrivalMessage && setMessagesData((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  return (
    <div className={styles.container}>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Wallet...
        </h2>
      ) : (
        <>
          {isChatRoomUser ? (
            <>
              <Profile data={senderData} showChatBtn={false} />
              <div className={styles.chatContainer}>
                <div className={styles.chatMessagesContainer}>
                  {messagesData && messagesData.length != 0 ? (
                    messagesData.map((chat) => {
                      const { message, sender } = chat;
                      let sendByMe = sender != user?.data?._id;

                      return (
                        <div
                          ref={scrollRef}
                          className={
                            sendByMe ? styles.chatReceived : styles.chatSent
                          }
                        >
                          {message?.text}
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.chatContainerFlex}>
                      <img
                        style={{ width: 100, height: 100, margin: "0px 10px" }}
                        src="https://images.vexels.com/media/users/3/206062/isolated/preview/d0de78df943ea9b630c87ec98cf902ef-hi-speech-bubble-doodle.png"
                      />
                      <h2 className={styles.chatHi}>
                        Say "Hi"
                        <br />
                        Start A Conversation
                      </h2>
                    </div>
                  )}
                </div>
                <div className={styles.chatInput}>
                  <Form className="chatForm" form={form} onFinish={onFinish}>
                    <Form.Item name="message">
                      <TextArea
                        value={textValue}
                        onPressEnter={onFinish}
                        onChange={(e) => {
                          e.preventDefault();
                          setTextValue(e.target.value);
                        }}
                        rows={2}
                        placeholder="Type your message...."
                      />
                    </Form.Item>
                    <Button htmlType="submit" className={styles.sendButton}>
                      <SendOutlined className={styles.sendIcon} />
                    </Button>
                  </Form>
                </div>
              </div>
            </>
          ) : (
            <h2 className={styles.header1} style={{ fontWeight: 300 }}>
              Opps... This is not your Chat
            </h2>
          )}
        </>
      )}
    </div>
  );
}
