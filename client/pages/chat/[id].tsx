import React, { useContext, useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import { UserContext } from "../_app";
import { Input, Form, Button } from "antd";
import Profile from "../../component/Profile";
import { useRouter } from "next/router";
import { User } from "../../component/Profile/props";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ChatPage() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [form] = Form.useForm();
  const { id } = router.query;
  const [chatData, setChatData] = useState([]);
  const [senderData, setSenderData] = useState<User>(null);

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
  }, [user]);

  useEffect(() => {
    if (chatData != [] && user?.data) {
      chatData?.users.map((chatUser) => {
        if (chatUser._id != user?.data?._id) {
          setSenderData({ ...chatUser });
        }
      });
    }
  }, [chatData]);

  const onFinish = async (values: any) => {
    console.log(values.message);
    await fetch(`http://localhost:5002/chatRoomSend/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: user?.data?._id,
        receiver: senderData?._id,
        text: values.message,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      });
  };

  return (
    <div className={styles.container}>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Your Wallet....
        </h2>
      ) : (
        <>
          <Profile data={senderData} />
          <div className={styles.chatContainer}>
            <div className={styles.chatMessagesContainer}>
              {chatData?.chats ? (
                chatData?.chats.map((chat) => {
                  const { message, sender } = chat;
                  let sendByMe = sender != user?.data?._id;

                  return (
                    <div
                      className={
                        sendByMe ? styles.chatReceived : styles.chatSent
                      }
                    >
                      {message?.text}
                    </div>
                  );
                })
              ) : (
                <div className={styles.chatContainer}>
                  <h2 className={styles.header1}>
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
                  <TextArea rows={2} placeholder="Type your message...." />
                </Form.Item>
                <Button htmlType="submit" className={styles.sendButton}>
                  <SendOutlined className={styles.sendIcon} />
                </Button>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
