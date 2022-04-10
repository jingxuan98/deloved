import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import { Collapse } from "antd";
import React, { useContext, useState, useEffect } from "react";
import OrderCard from "../component/orderCard";
import OrderForm from "../component/orderForm";
const { Panel } = Collapse;

export default function Orders() {
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
          setOrderData(result.order);
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
          setSoldData(result.order);
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
      <h1 className={styles.header1}>My Orders</h1>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Your Wallet....
        </h2>
      ) : (
        <>
          <Collapse style={{ margin: 10 }} defaultActiveKey={["1"]}>
            {orderData ? (
              orderData.map((order, index) => {
                index++;
                console.log(order);
                // return <OrderCard data={order} key={index.toString()} />;
                return (
                  <Panel
                    header={`OrderID: ${order?._id}`}
                    key={index.toString()}
                  >
                    <OrderForm mode="view" data={order} />
                  </Panel>
                );
              })
            ) : (
              <p>No Buy Orders At the Moment</p>
            )}
          </Collapse>

          <h1 className={styles.header1}>My Sold Orders</h1>
          <Collapse style={{ margin: 10 }} defaultActiveKey={["1"]}>
            {soldData ? (
              soldData.map((order, index) => {
                index++;
                console.log(order);
                // return <OrderCard data={order} key={index.toString()} />;
                return (
                  <Panel
                    header={`OrderID: ${order?._id}`}
                    key={index.toString()}
                  >
                    <OrderForm mode="view" sell data={order} />
                  </Panel>
                );
              })
            ) : (
              <p>No Sold Orders At the Moment</p>
            )}
          </Collapse>
        </>
      )}
    </div>
  );
}
