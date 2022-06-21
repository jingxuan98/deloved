import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
// import { web3 } from "../component/screen/ItemScreen";
import { tokenABI, stakingABI } from "../helper/abi";
import { getBalanceNumber } from "../helper/formatbalance";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";
import FormBuilder from "antd-form-builder";
import { getFieldMeta } from "../helper/stakeModalFormMetas";
import UnstakeForm from "../component/UnstakeForm";

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
  const [isUnstakeModalVisible, setIsUnstakeModalVisible] = useState(false);
  const [txn, setTxn] = useState("");
  const [txnSuccess, setTxnSuccess] = useState(false);

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

  const onUnstake = async (amount: string) => {
    console.log("onUnStakeAmount", amount);
    console.log("walletAdd", user?.data?.walletAdd);

    let amountBN = amount + "000000000000000000";
    let unstakeReceipt;

    try {
      unstakeReceipt = await stakingContract.methods
        .unstake(amountBN)
        .send({ from: user?.data?.walletAdd })
        .on("transactionHash", (hash) => {
          console.log("Unstake Tokens TXN =>", hash);
          notification.open({
            message: `Unstake Token Txn Hash is ${hash}`,
          });
        })
        .on("error", () => {
          console.error;
        });
    } catch (err) {
      console.log("Token Unstaking Err ==>", err);
    }
  };

  const onWithdraw = async () => {
    console.log("walletAdd", user?.data?.walletAdd);

    let withdrawReceipt;

    try {
      withdrawReceipt = await stakingContract.methods
        .withdrawYield()
        .send({ from: user?.data?.walletAdd })
        .on("transactionHash", (hash) => {
          console.log("Withdraw Yield TXN =>", hash);
          notification.open({
            message: `Withdraw Yield Txn Hash is ${hash}`,
          });
        })
        .on("error", () => {
          console.error;
        });
    } catch (err) {
      console.log("Withdraw Yield Err ==>", err);
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

  const showUnstakeModal = () => {
    setIsUnstakeModalVisible(true);
  };

  const closeUnstakeModal = () => {
    setIsUnstakeModalVisible(false);
  };

  const renderUnstakeModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeUnstakeModal}
        title="Unstake your USMT Tokens"
        visible={isUnstakeModalVisible}
      >
        <div>
          <UnstakeForm onSubmit={onUnstake} />
        </div>
      </Modal>
    );
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
        <div className={styles.stakingContainer}>
          {renderStakeModal()}
          {renderUnstakeModal()}
          <div className={styles.stakedRowBorderBtm}>
            <img src="/usmt.png" style={{ width: 150 }} />
            <div className={styles.stakeColumn}>
              <div className={styles.yieldRow}>
                <h4 style={{ marginBottom: 0 }} className={styles.h4Label}>
                  USMT Rewards:
                </h4>
                <span className={styles.apyDisplay}> 730% APY Now!</span>
              </div>
              <h4 className={styles.yieldDisplay} style={{ marginBottom: 0 }}>
                {stakedYieldBalance} USMT
              </h4>
            </div>
          </div>
          <div className={styles.stakedRow}>
            <div style={{ width: "auto" }} className={styles.stakeColumn}>
              <h4 className={styles.h4Label}>USMT Staked: </h4>
              <h4 className={styles.balanceDisplay}>
                {stakedTokenBalance} USMT
              </h4>
            </div>
            <div className={styles.stakeColumn}>
              <h4 className={styles.h4Label}>Wallet USMT Balance: </h4>
              <h4 className={styles.balanceDisplay}>{tokenBalance} USMT</h4>
            </div>
          </div>

          <div className={styles.stakedBtnRow}>
            <Button
              className={styles.stakedBtn}
              type="ghost"
              onClick={showUnstakeModal}
            >
              Unstake
            </Button>
            <Button
              className={styles.stakedBtn}
              type="primary"
              onClick={onWithdraw}
            >
              Withdraw
            </Button>
            <Button
              className={styles.stakedBtn}
              type="primary"
              onClick={showStakeModal}
            >
              Stake/Top Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
