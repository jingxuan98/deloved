import styles from "../styles/Home.module.css";
import { UserContext } from "../pages/_app";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import ItemSmallCard from "../component/itemSmallCard";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5002/allitems")
      .then((res) => res.json())
      .then((result) => {
        console.log(result.items);
        setItemData(result.items);
      });
  }, []);
  //#endregion

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>Featured Items</h1>
      <div className={styles.innerContainer}>
        {itemData &&
          itemData.map((item) => {
            return <ItemSmallCard data={item} />;
          })}
      </div>
    </div>
  );
}
