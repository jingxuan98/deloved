import styles from "../styles/Home.module.css";
import { UserContext } from "../pages/_app";
import { useContext, useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);

  fetch("http://localhost:5002/allitems")
    .then((res) => res.json())
    .then((result) => {
      console.log(result.items);
      setItemData(result.items);
    });

  //#endregion

  return (
    <>
      <h1>Home</h1>
      <div className={styles.container}>
        Hi there
        {itemData &&
          itemData.map((item) => {
            return <p>{item.title}</p>;
          })}
      </div>
    </>
  );
}
