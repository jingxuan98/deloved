import { useContext, useState, useEffect } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  TagOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Card, Avatar } from "antd";
import { Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";

const { Meta } = Card;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const ItemSmallCard: React.FC<Props> = (props) => {
  const { data } = props;
  const { title, postedby, body, price, photo, _id } = data;
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/item/${_id}`)}
      hoverable
      style={{ width: 300, margin: 15 }}
      cover={<img alt="example" src={photo || fallback} />}
      actions={[
        <div className={styles.cardPrice}>
          <TagOutlined key="price" style={{ marginRight: 10 }} /> {price} USMT
        </div>,
      ]}
    >
      <Meta title={title} description={body} />
    </Card>
  );
};
export default ItemSmallCard;
