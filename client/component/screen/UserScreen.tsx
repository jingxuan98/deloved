import styles from "../../styles/Home.module.css";
import { UserContext } from "../../pages/_app";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abi } from "./abi";
import { Props } from "./props";
import { Button } from "antd";
import ItemSmallCard from "../itemSmallCard";
import Profile from "../Profile";
import { User } from "../Profile/props";

// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "https://data-seed-prebsc-1-s1.binance.org:8545/"
//   )
// );
const web3 = new Web3(window.ethereum);

const UserScreen: React.FC<Props> = (props) => {
  const { id } = props;
  const [itemData, setItemData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);

  const [itemInnerData, setItemInnerData] = useState(null);

  useEffect(() => {
    const userFetch = async () => {
      await fetch(`http://localhost:5002/user/${id}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setItemData(result.item);
          setUserData(result.user);
        });
    };
    userFetch();
  }, []);

  const renderItems = () => {
    return (
      <div className={styles.innerContainer}>
        {itemData ? (
          itemData.map((item) => {
            return <ItemSmallCard data={item} />;
          })
        ) : (
          <div>
            <h2 className={styles.header1}>
              User Have No Items Selling Yet....
            </h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Profile data={userData} />
      <h1 className={styles.header1}>Listed Items</h1>
      {renderItems()}
    </div>
  );
};

export default UserScreen;
