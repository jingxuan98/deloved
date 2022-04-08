import styles from "../../styles/Home.module.css";
import { UserContext } from "../../pages/_app";
import { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abi } from "./abi";
import { Props } from "./props";

// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );
const web3 = new Web3(window.ethereum);

const ItemScreen: React.FC<Props> = (props) => {
  const { id } = props;
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);
  const [itemInnerData, setItemInnerData] = useState(null);
  const [txn, setTxn] = useState("");
  const [txnSuccess, setTxnSuccess] = useState(false);

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
    if (txnSuccess) createOrder(itemInnerData, txn);
  }, [txnSuccess]);

  const sendTransaction = async (item) => {
    setItemInnerData(item);
    if (!user?.data?.walletAdd) return alert("Please connect your wallet");
    let fromAddress = user?.data?.walletAdd;
    let tokenAddress = "0x9a1377A194ca85C74BB3155be0877799D81F45A7";
    let toAddress = item.postedBy.walletAdd;
    // Use BigNumber
    let decimals = web3.utils.toBN(18);
    let amount = web3.utils.toBN(item.price);
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

  const createOrder = (item, txn) => {
    console.log(item, txn);

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
        // address1,
        // address2,
        // postcode,
        // state,
        // country,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <h1>Item</h1>
      {itemData &&
        itemData.map((item) => {
          return (
            <div>
              <p>{item.title}</p>
              <button onClick={() => sendTransaction(item)}>
                {item.price} USMT
              </button>
            </div>
          );
        })}
    </div>
  );
};
export default ItemScreen;
