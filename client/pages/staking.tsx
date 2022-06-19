import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
// import { web3 } from "../component/screen/ItemScreen";
import { tokenABI, stakingABI } from "./abi";
import { getBalanceNumber } from "../helper/formatbalance";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";
import FormBuilder from "antd-form-builder";
import { getFieldMeta } from "../helper/stakeModalFormMetas";

// const { Search } = Input;
// declare var window: any;

export default function Staking() {
  const web3 = new Web3(Web3.givenProvider);
  const { user, setUser } = useContext(UserContext);
  const [form] = Form.useForm();
  const metas = getFieldMeta();
  const [orderData, setOrderData] = useState([]);
  const [tokenBalance, setTokenBalance] = useState("");
  const [stakedTokenBalance, setStakedTokenBalance] = useState("");
  const [stakedYieldBalance, setStakedYieldBalance] = useState("");
  const [isStakeModalVisible, setIsStakeModalVisible] = useState(false);
  const [txn, setTxn] = useState("");
  const [txnSuccess, setTxnSuccess] = useState(false);
  // const [web3, setWeb3] = useState(null);

  //   useEffect(() => {
  //     const fetchWindow = () => {
  //       if (
  //         typeof window.ethereum !== "undefined" ||
  //         typeof window.web3 !== "undefined"
  //       ) {
  //         const provider = new Web3(window.ethereum);
  //         setWeb3(provider);
  //         // other stuff using provider here
  //       }
  //     };
  //   }, []);
  //   //#endregion

  const tokenContractAddress = "0x9a2b05682D7Ae37128A4827184d4f1877E327aE8";
  const stakingContractAddress = "0xB4aCd12223D7E4d6661106C07Ac02D73330971c2";
  // Get Token & Staking contract instance
  const tokenContract = new web3.eth.Contract(
    tokenABI as AbiItem[],
    tokenContractAddress
  );
  const stakingContract = new web3.eth.Contract(
    stakingABI as AbiItem[],
    stakingContractAddress
  );

  useEffect(() => {
    const datafetch = async (walletAdd: string) => {
      let tokenBalanceFetch = await tokenContract.methods
        .balanceOf(walletAdd)
        .call();
      setTokenBalance(getBalanceNumber(tokenBalanceFetch));

      let stakedBalanceFetch = await stakingContract.methods
        .checkStakedtTokenBalance(walletAdd)
        .call();
      setStakedTokenBalance(getBalanceNumber(stakedBalanceFetch));

      let stakedYieldBalanceFetch = await stakingContract.methods
        .checkYieldTotal(walletAdd)
        .call();
      setStakedYieldBalance(getBalanceNumber(stakedYieldBalanceFetch));
    };

    if (user?.data?.walletAdd) datafetch(user?.data?.walletAdd);

    const interval = setInterval(() => {
      if (user?.data?.walletAdd) datafetch(user?.data?.walletAdd);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const onStake = async (amount: string) => {
    console.log("onStakeAmount", amount);
    console.log("walletAdd", user?.data?.walletAdd);

    let amountBN = amount + "000000000000000000";
    let approveReceipt;
    let stakeReceipt;

    try {
      approveReceipt = await tokenContract.methods
        .approve(stakingContractAddress, amountBN)
        .send({ from: user?.data?.walletAdd })
        .on("transactionHash", (hash) => {
          console.log("Approve Token TXN =>", hash);
          notification.open({
            message: `Token Approval Txn Hash is ${hash}`,
          });
        })
        .on("error", () => {
          console.error;
        });
    } catch (err) {
      console.log("Approval Err ==>", err);
    }

    try {
      stakeReceipt = await stakingContract.methods
        .stake(amountBN)
        .send({ from: user?.data?.walletAdd })
        .on("transactionHash", (hash) => {
          console.log("Stake Tokens TXN =>", hash);
          notification.open({
            message: `Stake Token Txn Hash is ${hash}`,
          });
        })
        .on("error", () => {
          console.error;
        });
    } catch (err) {
      console.log("Token Staking Err ==>", err);
    }
  };

  const onFinish = (values: any) => {
    onStake(values.stakedAmount);
  };

  const showStakeModal = () => {
    setIsStakeModalVisible(true);
  };

  const closeStakeModal = () => {
    setIsStakeModalVisible(false);
  };

  const renderStakeModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeStakeModal}
        title="Stake or Top Up your USMT Tokens"
        visible={isStakeModalVisible}
      >
        <div>
          <Form onFinish={onFinish} form={form} layout="vertical">
            <FormBuilder meta={metas} form={form} />
            <Button type="primary" htmlType="submit">
              Stake
            </Button>
          </Form>
        </div>
      </Modal>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>Staking</h1>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Your Wallet....
        </h2>
      ) : (
        <div>
          {renderStakeModal()}
          <p>USMT Token Balance: {tokenBalance}</p>
          <p>Staked USMT Balance: {stakedTokenBalance}</p>
          <p>USMT Rewards Balance: {stakedYieldBalance}</p>

          <div>
            <Button type="primary" onClick={onUnstake}>
              Unstake
            </Button>
            <Button type="primary" onClick={onWithdraw}>
              Withdraw
            </Button>
            <Button type="primary" onClick={showStakeModal}>
              Stake/Top Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
