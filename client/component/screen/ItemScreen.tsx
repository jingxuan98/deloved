import styles from "../../styles/Home.module.css";
import { UserContext } from "../../pages/_app";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abi } from "./abi";
import { Props } from "./props";
import { Button, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import ShippingForm from "../ShippingForm";

// export const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );
declare var window: any;

const ItemScreen: React.FC<Props> = (props) => {
  const { id } = props;
  const web3 = new Web3(Web3.givenProvider);
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState(null);
  const [itemInnerData, setItemInnerData] = useState(null);
  const [txn, setTxn] = useState("");
  const [txnSuccess, setTxnSuccess] = useState(false);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const itemFetch = async () => {
      await fetch(`http://localhost:5002/item/${id}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result.item);
          setItemData(result.item);
        });
    };
    itemFetch();
    setItemData([]);
  }, []);

  useEffect(() => {
    // if (txnSuccess) createOrder(itemInnerData, txn);
    if (txnSuccess) showShippingModal();
  }, [txnSuccess]);

  const sumbitOrder = (values: any) => {
    console.log(values);
    createOrder(itemInnerData, values, txn);
  };

  const showShippingModal = () => {
    setIsShippingModalVisible(true);
  };

  const closeShippingModal = () => {
    setIsShippingModalVisible(false);
  };

  const renderShippingModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeShippingModal}
        title="Shipping Order Form"
        visible={isShippingModalVisible}
      >
        <ShippingForm onSubmit={sumbitOrder} />
      </Modal>
    );
  };

  const sendTransaction = async (item) => {
    setItemInnerData(item);
    if (!user?.data?.walletAdd) return alert("Please connect your wallet");
    let fromAddress = user?.data?.walletAdd;
    let tokenAddress = "0x9a1377A194ca85C74BB3155be0877799D81F45A7";
    let toAddress = item[0]?.postedBy?.walletAdd;

    // Use BigNumber
    let decimals = web3.utils.toBN(18);
    let amount = web3.utils.toBN(item[0].price);
    let value = amount.mul(web3.utils.toBN(10).pow(decimals));

    // Get ERC20 Token contract instance
    let contract = new web3.eth.Contract(abi as AbiItem[], tokenAddress);

    await contract.methods
      .transfer(toAddress, value)
      .send({ from: fromAddress })
      .on("transactionHash", (hash) => {
        setTxn(hash);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        if (!txnSuccess) setTxnSuccess(true);
      })
      .on("error", console.error);
  };

  const createOrder = (item, values, txn) => {
    console.log(item, values, txn);
    const {
      receiverName,
      phone,
      address1,
      address2,
      postcode,
      state,
      country,
    } = values;

    fetch("http://localhost:5002/createOrder", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item[0]?._id,
        buyerId: user?.data?._id,
        sellerId: item[0]?.postedBy?._id,
        txn,
        receiverName,
        phone,
        address1,
        address2,
        postcode,
        state,
        country,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.push(`/myOrders`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteItem = async () => {
    await fetch(`http://localhost:5002/deleteItem/${itemData[0]?._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: itemData[0]?.postedBy?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        router.push(`/profile`);
      });
  };

  return (
    <div className={styles.itemRow}>
      {renderShippingModal()}
      {itemData ? (
        <div className={styles.row}>
          <div>
            <img style={{ marginRight: 20 }} src={itemData?.photo} />
          </div>
          <div className={styles.columnItem}>
            <h2>{itemData?.title}</h2>
            <p>{itemData?.body}</p>
            <Button
              type="primary"
              disabled={user?.data?._id == itemData?.postedBy?._id}
              onClick={() => sendTransaction(itemData)}
            >
              {itemData?.price} USMT
            </Button>
            {user?.data?._id == itemData?.postedBy?._id && (
              <div className={styles.ownerItemContainer}>
                <Button
                  className={styles.ownerButton}
                  type="ghost"
                  onClick={() => {}}
                >
                  <EditOutlined /> Edit
                </Button>
                <Button
                  className={styles.ownerButton}
                  type="ghost"
                  style={{ color: "red" }}
                  onClick={deleteItem}
                >
                  <DeleteOutlined /> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h2 className={styles.header1}>Loading...</h2>
      )}
    </div>
  );
};
export default ItemScreen;
