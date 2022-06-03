import { useContext, useState, useEffect } from "react";
import { TagOutlined } from "@ant-design/icons";
import { Card, Avatar } from "antd";
import { Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";

const { Meta } = Card;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const ItemSmallCard: React.FC<Props> = (props) => {
  const { data, rating } = props;
  const { name, pic, walletAdd, _id } = data;
  const router = useRouter();

  return (
    <>
      <div className={styles.profileContainer}>
        <img alt="profile" src={pic || fallback} />
        <div className="profileInner">
          <h4>{walletAdd}</h4>
          <h4>{name}</h4>
          <h4>{rating ? rating.toFixed(2) : 0}⭐</h4>
        </div>
      </div>
      <div style={{ border: "1px lightgrey solid", width: "70%" }} />
    </>
  );
};
export default ItemSmallCard;
