import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { UserContext } from "../pages/_app";
import Router, { useRouter } from "next/router";
import { Button, Menu } from "antd";
import styles from "../styles/Layout.module.css";
import router from "next/router";

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
  const [current, setCurrent] = useState("home");

  const fetchUser = async () => {
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

  async function connect() {
    try {
      await activate(injected);
      await fetchUser();
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
      connectWalletOnPageLoad();
    } else {
      setUser({});
    }
  }, [active]);

  //   if (active) {
  //     fetchUser();
  //   }

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
        <img alt="logo" style={{ height: 40 }} src="/logo.png" />
        <Menu onClick={handleNav} selectedKeys={[current]} mode="horizontal">
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="create">Create</Menu.Item>
          <Menu.Item key="order">My Orders</Menu.Item>
          <Menu.Item key="profile">Profile</Menu.Item>
        </Menu>
        <div>
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
