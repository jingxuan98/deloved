import styles from "../styles/Home.module.css";
import { UserContext } from "../pages/_app";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
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
    <>
      <h1>Home</h1>
      <div className={styles.container}>
        Hi there
        {itemData &&
          itemData.map((item) => {
            return (
              <div onClick={() => router.push(`/item/${item._id}`)}>
                {item.title}
              </div>
            );
          })}
      </div>
    </>
  );
}
