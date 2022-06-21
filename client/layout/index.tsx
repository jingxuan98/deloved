import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { CommentOutlined, MessageOutlined } from "@ant-design/icons";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { UserContext } from "../pages/_app";
import Router, { useRouter } from "next/router";
import { Button, Menu, Modal } from "antd";
import styles from "../styles/Layout.module.css";
import router from "next/router";
import ChatList from "../component/chatList";

type LayoutProps = {
  children: React.ReactNode;
};

const injected = new InjectedConnector({
  supportedChainIds: [56, 97],
});

const logo = require("../public/logo.png");

export default function Layout({ children }: LayoutProps) {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [current, setCurrent] = useState("");
  const [isChatListModalVisible, setIsChatListModalVisible] = useState(false);
  const [chatRoomData, setChatRoomData] = useState([]);

  const fetchUserChatRooms = async () => {
    setChatRoomData([]);
    await fetch(`http://localhost:5002/getUserChatRooms/${user?.data?._id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const { chatRooms } = result;
        setChatRoomData(chatRooms.chatRooms);
      });
  };

  const showChatListModal = async () => {
    await fetchUserChatRooms();
    setIsChatListModalVisible(true);
  };

  const closeChatListModal = () => {
    setIsChatListModalVisible(false);
  };

  const renderChatListModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeChatListModal}
        title="My Messages"
        visible={isChatListModalVisible}
      >
        <ChatList data={chatRoomData} />
      </Modal>
    );
  };

  const fetchUser = async () => {
    console.log(account);
    await fetch("http://localhost:5002/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAdd: account,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const { data, message } = result;
        // console.log(result);
        setUser({ ...user, data });
      });
  };
  //#endregion
  useEffect(() => {
    if (account) {
      fetchUser();
    }
  }, [account]);

  async function connect() {
    try {
      await activate(injected);
      // await fetchUser();
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          //console.log("reconnected", account);
          fetchUser();
          localStorage.setItem("isWalletConnected", "true");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    if (active) {
      // fetchUser();
      connectWalletOnPageLoad();
    } else {
      setUser({});
    }
  }, [active]);
  //#endregion

  const handleNav = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case "home":
        router.push(`/`);
        break;
      case "order":
        router.push(`/myOrders`);
        break;
      case "profile":
        router.push(`/profile`);
        break;
      case "create":
        router.push(`/createPost`);
        break;
      case "staking":
        router.push(`/staking`);
        break;
      default:
        router.push(`/`);
    }
  };

  return (
    <div className="layoutContainer">
      <Head>
        <title>Dreloved</title>
        <meta name="description" content="A Secondhand MarketPlace Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.headerContainer}>
        {renderChatListModal()}
        <img alt="logo" className={styles.logo} src="/newLogo.png" />

        <div className={styles.headerSide}>
          <Menu
            style={{ marginRight: 10 }}
            onClick={handleNav}
            inlineCollapsed={false}
            selectedKeys={[current]}
            mode="horizontal"
            items={[
              { label: "Home", key: "home" }, // remember to pass the key prop
              { label: "Create", key: "create" }, // which is required
              {
                label: "My Order",
                key: "order",
              },
              {
                label: "Staking",
                key: "staking",
              },
              {
                label: "Profile",
                key: "profile",
              },
            ]}
          />
          {active && (
            <CommentOutlined
              onClick={showChatListModal}
              className={styles.chatIcon}
            />
          )}
          <Button
            className={styles.connectBtn}
            onClick={connect}
            type="primary"
          >
            <span className={styles.connectBtnText}>
              {active ? account : "Connect to MetaMask"}
            </span>
          </Button>
        </div>
      </div>

      {/* <button onClick={connect}>Connect to MetaMask</button>
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )} */}
      {children}
    </div>
  );
}
