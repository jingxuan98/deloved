import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { UserContext } from "../pages/_app";

type LayoutProps = {
  children: React.ReactNode;
};

const injected = new InjectedConnector({
  supportedChainIds: [56, 97],
});

export default function Layout({ children }: LayoutProps) {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

  const { user, setUser } = useContext(UserContext);

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

  return (
    <div>
      <Head>
        <title>Deloved</title>
        <meta name="description" content="A Secondhand MarketPlace Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={connect}>Connect to MetaMask</button>
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
      <button onClick={disconnect}>Disconnect</button>
      {children}
    </div>
  );
}
