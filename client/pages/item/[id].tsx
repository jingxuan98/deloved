// import styles from "../../styles/Home.module.css";
// import { UserContext } from "../_app";
import { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// import Web3 from "web3";
// import { AbiItem } from "web3-utils";
// import { abi } from "../../component/screen/abi";

// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );

export default function Item() {
  const router = useRouter();
  const { id } = router.query;

  const ItemScreen = dynamic(
    () => import("../../component/screen/ItemScreen"),
    { ssr: false }
  );
  //   const { user, setUser } = useContext(UserContext);
  //   const [itemData, setItemData] = useState([]);
  //   const web3 = typeof window !== undefined ? new Web3(window.ethereum) : "";

  //   useEffect(() => {
  //     const itemFetch = async () => {
  //       await fetch(`http://localhost:5002/item/${id}`)
  //         .then((res) => res.json())
  //         .then((result) => {
  //           console.log(result.item);
  //           setItemData(result.item);
  //         });
  //     };
  //     itemFetch();
  //     setItemData([]);
  //   }, []);

  //   const sendTransaction = async (seller: string, price: number) => {
  //     if (!web3) return;
  //     console.log(user?.data?.walletAdd, " + ", seller);
  //     let fromAddress = user?.data?.walletAdd;
  //     let tokenAddress = "0x9a1377A194ca85C74BB3155be0877799D81F45A7";
  //     let toAddress = "0xfC8838E4FEb2A2812A10e84FB9428058C81BA2CE";
  //     // Use BigNumber
  //     let decimals = web3.utils.toBN(18);
  //     let amount = web3.utils.toBN(price);

  //     // Get ERC20 Token contract instance
  //     let contract = new web3.eth.Contract(abi as AbiItem[], tokenAddress);

  //     // calculate ERC20 token amount
  //     let value = price * 10 * 18;
  //     //#endregion

  //     await contract.methods
  //       .transfer(toAddress, value)
  //       .send({ from: fromAddress })
  //       .on("receipt", (receipt) => {
  //         console.log(receipt);
  //       });
  //   };

  return <ItemScreen id={id} />;
}
