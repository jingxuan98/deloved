import styles from "../../styles/Home.module.css";
import { UserContext } from "../../pages/_app";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abi } from "./abi";
import { Props } from "./props";
import { Button, Modal, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import ShippingForm from "../ShippingForm";
import { busdABI, tokenABI } from "../../helper/abi";
import ProfileCard from "../Profile";
import ItemForm from "../ItemForm";

// export const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );
declare var window: any;
export const USMTPrice = 0.65;
const { confirm } = Modal;

const ItemScreen: React.FC<Props> = (props) => {
  const { id } = props;
  const web3 = new Web3(Web3.givenProvider);
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState(null);
  const [itemInnerData, setItemInnerData] = useState(null);
  const [txn, setTxn] = useState("");
  const [orderId, setOrderId] = useState("");
  const [txnSuccess, setTxnSuccess] = useState(false);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
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

  // useEffect(() => {
  //   // if (txnSuccess) createOrder(itemInnerData, txn);
  //   if (txnSuccess) {
  //     createOrder(itemInnerData, txn);
  //   }
  // }, [txnSuccess]);

  useEffect(() => {
    if (orderId) {
      showShippingModal();
    }
  }, [orderId]);

  const sumbitShippingOrder = (values: any) => {
    updateShipping(values);
  };

  const showShippingModal = () => {
    setIsShippingModalVisible(true);
  };

  const closeShippingModal = () => {
    setIsShippingModalVisible(false);
  };

  const showUpdateModal = () => {
    setIsUpdateModalVisible(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalVisible(false);
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
        <ShippingForm onSubmit={sumbitShippingOrder} />
      </Modal>
    );
  };

  const renderUpdateModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeUpdateModal}
        title="Update Item"
        visible={isUpdateModalVisible}
      >
        <ItemForm data={itemData} />
      </Modal>
    );
  };

  const showBuyModal = () => {
    setIsBuyModalVisible(true);
  };

  const closeBuyModal = () => {
    setIsBuyModalVisible(false);
  };

  const renderBuyModal = () => {
    let price90 = itemData?.price * 0.9;
    let priceUSMT = (price90 / USMTPrice).toFixed(2);

    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeBuyModal}
        title="Payment Selection"
        visible={isBuyModalVisible}
      >
        <p>
          Dreloved only act as an intermediary between the buyer and seller, we
          are not responsible on any loss in trading between buyer and seller.
          <br />
          <br />
          Please BUY ON YOUR OWN RISK by referring seller's rating before buying
        </p>
        <div
          className={styles.paymentSelectBtn}
          onClick={() => sendUSMTTransaction(itemData, priceUSMT)}
        >
          <img
            alt="usmtlogo"
            style={{ height: 25, marginRight: 8 }}
            src="/usmt.png"
          />
          {priceUSMT} USMT, approx. {price90} USD (90% Discount)
        </div>
        <div
          className={styles.paymentSelectBtn}
          onClick={() => sendBUSDTransaction(itemData, itemData?.price)}
        >
          <img
            alt="busdlogo"
            style={{ height: 25, marginRight: 8 }}
            src="/busd.png"
          />
          {itemData?.price} BUSD
        </div>
      </Modal>
    );
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this item?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem();
      },
      onCancel() {},
    });
  };

  const sendUSMTTransaction = async (item, price) => {
    setItemInnerData(item);
    if (!user?.data?.walletAdd) return alert("Please connect your wallet");
    let fromAddress = user?.data?.walletAdd;
    let tokenAddress = "0x9a2b05682D7Ae37128A4827184d4f1877E327aE8";
    let toAddress = item?.postedBy?.walletAdd;
    //let priceBN = price * 1000000000000000000;
    // Use BigNumber
    // let decimals = web3.utils.toBN(18);
    let tokens = web3.utils.toWei(price.toString(), "ether");
    // let amount = web3.utils.toBN(tokens);
    // let value = amount.mul(web3.utils.toBN(10).pow(decimals));

    // Get ERC20 Token contract instance
    let contract = new web3.eth.Contract(tokenABI as AbiItem[], tokenAddress);

    await contract.methods
      .transfer(toAddress, tokens)
      .send({ from: fromAddress })
      .on("transactionHash", (hash) => {
        setTxn(hash);
        notification.open({
          message: `Payment Txn Hash is ${hash}`,
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        if (!txnSuccess) setTxnSuccess(true);
      })
      .on("error", console.error);
  };

  const sendBUSDTransaction = async (item, price) => {
    setItemInnerData(item);
    if (!user?.data?.walletAdd) return alert("Please connect your wallet");
    let fromAddress = user?.data?.walletAdd;
    let tokenAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
    let toAddress = item?.postedBy?.walletAdd;
    // let priceBN = price * 1000000000000000000;
    // Use BigNumber
    // let decimals = web3.utils.toBN(18);
    // let amount = web3.utils.toBN(price);
    // let value = amount.mul(web3.utils.toBN(10).pow(decimals));
    let tokens = web3.utils.toWei(price.toString(), "ether");

    // Get ERC20 Token contract instance
    let contract = new web3.eth.Contract(busdABI as AbiItem[], tokenAddress);

    await contract.methods
      .transfer(toAddress, tokens)
      .send({ from: fromAddress })
      .on("transactionHash", (hash) => {
        setTxn(hash);
        notification.open({
          message: `Payment Txn Hash is ${hash}`,
        });
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        if (!txnSuccess) setTxnSuccess(true);
      })
      .on("error", console.error);
  };

  const createOrder = (item, txn) => {
    fetch("http://localhost:5002/createOrder", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item?._id,
        buyerId: user?.data?._id,
        sellerId: item?.postedBy?._id,
        txn,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOrderId(data.result._id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateShipping = (values) => {
    const {
      receiverName,
      phone,
      address1,
      address2,
      postcode,
      state,
      country,
    } = values;

    fetch(`http://localhost:5002/updateShippingDetails/${orderId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
    await fetch(`http://localhost:5002/deleteItem/${itemData?._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: itemData?.postedBy?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        router.push(`/profile`);
      });
  };

  return (
    <div className={styles.itemPageContainer}>
      <div className={styles.itemRow}>
        {renderShippingModal()}
        {renderBuyModal()}
        {renderUpdateModal()}
        {itemData ? (
          <div className={styles.row}>
            <div>
              <img className={styles.itemImg} src={itemData?.photo} />
            </div>
            <div className={styles.columnItem}>
              <h2 className={styles.itemTitle}>{itemData?.title}</h2>
              <p>{itemData?.body}</p>
              <Button
                type="primary"
                // style={{ width: 300, alignSelf: "center" }}
                disabled={
                  user?.data?._id == itemData?.postedBy?._id ||
                  itemData?.status == "SOLD"
                }
                onClick={() => showBuyModal()}
              >
                {itemData?.status == "UNSOLD"
                  ? `${itemData?.price} USMT`
                  : "Item Sold"}
              </Button>
              <h4 style={{ marginTop: "2rem", fontWeight: 600 }}>Posted by:</h4>
              <ProfileCard
                isItemCard
                data={itemData?.postedBy}
                isUser={user?.data?._id == itemData?.postedBy?._id}
              />
              {user?.data?._id == itemData?.postedBy?._id && (
                <div className={styles.ownerItemContainer}>
                  <Button
                    className={styles.ownerButton}
                    type="ghost"
                    onClick={() => showUpdateModal()}
                  >
                    <EditOutlined /> Edit
                  </Button>
                  <Button
                    className={styles.ownerButton}
                    type="ghost"
                    style={{ color: "red" }}
                    onClick={showDeleteConfirm}
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
    </div>
  );
};
export default ItemScreen;
