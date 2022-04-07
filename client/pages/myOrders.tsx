import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import { useContext, useState, useEffect } from "react";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [orderData, setOrderData] = useState([]);
  const [soldData, setSoldData] = useState([]);

  useEffect(() => {
    const ordersFetch = async () => {
      await fetch("http://localhost:5002/myOrders", {
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
          console.log(result.myorder);
          setOrderData(result.myitem);
        });
    };
    const soldOrdersFetch = async () => {
      await fetch("http://localhost:5002/mySold", {
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
          console.log(result.mysold);
          setSoldData(result.myitem);
        });
    };
    if (user?.data?._id) {
      ordersFetch();
      soldOrdersFetch();
    }
    setOrderData([]);
  }, [user]);
  //#endregion

  return (
    <div className={styles.container}>
      <h1>Profile</h1>
      {itemData &&
        itemData.map((item) => {
          return <p>{item.title}</p>;
        })}
    </div>
  );
}
