import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import { Collapse, Tabs } from "antd";
import React, { useContext, useState, useEffect } from "react";
import OrderCard from "../component/orderCard";
import OrderForm from "../component/orderForm";
const { Panel } = Collapse;
const { TabPane } = Tabs;

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

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>My Orders</h1>
      {!user?.data ? (
        <h2
          className={styles.header1}
          style={{ fontWeight: 300, fontSize: 28 }}
        >
          Please Connect Your Wallet....
        </h2>
      ) : (
        <>
          <Tabs centered defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="Bought Orders" key="1">
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
            </TabPane>

            <TabPane tab="Sold Orders" key="2">
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
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
}
