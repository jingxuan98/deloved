import React, { useContext, useState, useEffect } from "react";
import { TagOutlined } from "@ant-design/icons";
import { Card, Avatar, Modal, Button } from "antd";
import { Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";
import UpdateProfileForm from "../UpdateProfileForm";

const { Meta } = Card;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const ItemSmallCard: React.FC<Props> = (props) => {
  const { data, rating, isUser } = props;
  const [userData, setUserData] = useState(data);
  const router = useRouter();
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  useEffect(() => {
    setUserData(data);
    console.log(userData);
  }, [data]);

  const showUserModal = () => {
    setIsUserModalVisible(true);
  };

  const closeUserModal = () => {
    setIsUserModalVisible(false);
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
        <img alt="profile" src={userData?.pic || fallback} />
        <div className="profileInner">
          <h4>{userData?.walletAdd}</h4>
          <h4>{userData?.name}</h4>
          <h4>{rating ? rating.toFixed(2) : 0}⭐</h4>
        </div>
        {isUser && (
          <Button onClick={showUserModal} type="ghost">
            Edit Profile
          </Button>
        )}
      </div>
      <div style={{ border: "1px lightgrey solid", width: "70%" }} />
    </>
  );
};
export default ItemSmallCard;
