import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../pages/_app";
import {
  TagOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { Card, Avatar, notification } from "antd";
import { Props } from "./props";
import { useRouter } from "next/router";
import styles from "../../styles/Component.module.css";
import { isCallLikeExpression } from "typescript";

const { Meta } = Card;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const ItemSmallCard: React.FC<Props> = (props) => {
  const { data, isDelete } = props;
  const [itemData, setItemData] = useState(data);
  const [liked, setLiked] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { title, postedBy, body, price, photo, _id, likes } = itemData;
  const router = useRouter();

  useEffect(() => {
    setLiked(false);
    likes?.map((id) => {
      if (user?.data?._id === id) {
        setLiked(true);
      }
    });
  }, [itemData, user]);

  const like = async () => {
    await fetch(`http://localhost:5002/like/${_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.data?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setItemData(result);
      });
  };

  const unlike = async () => {
    await fetch(`http://localhost:5002/unlike/${_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.data?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setItemData(result);
      });
  };

  return (
    <Card
      hoverable
      style={{ width: 300, margin: 15 }}
      cover={
        <img
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/item/${_id}`)}
          alt="example"
          src={photo || fallback}
        />
      }
      actions={[
        <div
          className={styles.cardPrice}
          style={{ color: "red" }}
          onClick={() => {
            liked ? unlike() : like();
          }}
        >
          {liked ? (
            <HeartFilled key="like" style={{ marginRight: 10 }} />
          ) : (
            <HeartOutlined key="like" style={{ marginRight: 10 }} />
          )}
          Wishlist
        </div>,
        <div
          onClick={() => router.push(`/item/${_id}`)}
          className={styles.cardPrice}
        >
          <TagOutlined key="price" style={{ marginRight: 10 }} /> {price} USMT
        </div>,
      ]}
    >
      <div
        style={{ cursor: "pointer", padding: 24 }}
        onClick={() => router.push(`/item/${_id}`)}
      >
        <Meta title={title} description={body} />
      </div>
    </Card>
  );
};

export default ItemSmallCard;
