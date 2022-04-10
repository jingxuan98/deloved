import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import React, { useContext, useState, useEffect } from "react";
import ItemSmallCard from "../component/itemSmallCard";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    const itemsFetch = async () => {
      await fetch("http://localhost:5002/myitem", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: user?.data?._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result.myitem);
          setItemData(result.myitem);
        });
    };
    if (user?.data?._id) itemsFetch();
    setItemData([]);
  }, [user]);
  //#endregion
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
              You Have No Items Selling Yet....
            </h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>My Items</h1>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Your Wallet....
        </h2>
      ) : (
        renderItems()
      )}
    </div>
  );
}
