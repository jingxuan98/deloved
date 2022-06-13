import styles from "../styles/Home.module.css";
import { UserContext } from "../pages/_app";
import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import ItemSmallCard from "../component/itemSmallCard";
import { Input, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    setItemData([]);
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch("http://localhost:5002/allitems")
      .then((res) => res.json())
      .then((result) => {
        setItemData(result.items);
      });
  };

  const onSearch = (value: string) => {
    setItemData([]);

    fetchSearchUsers(value);
  };

  const fetchSearchUsers = (query) => {
    if (query != "") {
      fetch("http://localhost:5002/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then((results) => {
          setItemData(results.item);
        });
    } else {
      fetchItems();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>Featured Items</h1>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Search
          className={styles.searchBar}
          type="text"
          placeholder="Search Items..."
          onSearch={onSearch}
        />
      </div>
      <div className={styles.innerContainer}>
        {itemData &&
          itemData.map((item) => {
            return <ItemSmallCard data={item} />;
          })}
      </div>
    </div>
  );
}
