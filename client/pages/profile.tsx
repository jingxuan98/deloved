import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import { useContext, useState, useEffect } from "react";

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
