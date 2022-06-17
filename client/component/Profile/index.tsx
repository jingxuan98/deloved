import React, { useContext, useState, useEffect } from "react";
import { TagOutlined } from "@ant-design/icons";
import { Card, Avatar, Modal, Button, notification } from "antd";
import { initialProps, Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";
import UpdateProfileForm from "../UpdateProfileForm";
import { UserContext } from "../../pages/_app";
import Loader from "../Loader";

const { Meta } = Card;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const ProfileCard: React.FC<Props> = (props) => {
  const { data, rating, isUser, showChatBtn } = props;
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState(data);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isChatRoomVisible, setIsChatRoomVisible] = useState(false);

  useEffect(() => {
    setUserData(data);
    console.log(userData);
  }, [data]);

  const chatRoomSearch = async () => {
    await fetch(`http://localhost:5002/chatRoom`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: user?.data?._id,
        receiver: userData?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setIsChatRoomVisible(false);
        notification.open({
          message: result.message,
        });
        router.push(`/chat/${result.chatRoom._id}`);
      });
  };

  const showUserModal = () => {
    setIsUserModalVisible(true);
  };

  const closeUserModal = () => {
    setIsUserModalVisible(false);
  };

  const showChatRoomModal = () => {
    setIsChatRoomVisible(true);
  };

  const closeChatRoomModal = () => {
    setIsChatRoomVisible(false);
  };

  const renderUserModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeUserModal}
        title={userData?.walletAdd}
        visible={isUserModalVisible}
      >
        <UpdateProfileForm
          _id={userData?._id}
          pic={userData?.pic}
          name={userData?.name}
          setUserProfile={setUserData}
        />
      </Modal>
    );
  };

  return (
    <>
      <div className={styles.profileContainer}>
        {renderUserModal()}
        <Loader loading={isChatRoomVisible} />
        <img alt="profile" src={userData?.pic || fallback} />
        <div className="profileInner">
          <h4>{userData?.walletAdd}</h4>
          <h4>{userData?.name}</h4>
          {rating && <h4>{rating.toFixed(2) || 0}⭐</h4>}
        </div>
        <div className={styles.profileButtonContainer}>
          {isUser && (
            <Button onClick={showUserModal} type="ghost">
              Edit Profile
            </Button>
          )}
          {user?.data && showChatBtn && (
            <Button
              onClick={() => {
                setIsChatRoomVisible(true);
                chatRoomSearch();
              }}
              type="ghost"
            >
              Chat
            </Button>
          )}
        </div>
      </div>
      <div style={{ border: "1px lightgrey solid", width: "70%" }} />
    </>
  );
};
export default ProfileCard;
ProfileCard.defaultProps = initialProps;
