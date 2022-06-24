import styles from "../../styles/Home.module.css";
import { UserContext } from "../../pages/_app";
import React, { useContext, useState, useEffect } from "react";
import { Props } from "./props";
import { Comment, Tooltip, Avatar, Tabs } from "antd";
import moment from "moment";
import ItemSmallCard from "../itemSmallCard";
import Profile from "../Profile";

const { TabPane } = Tabs;

const UserScreen: React.FC<Props> = (props) => {
  const { id } = props;
  const { user, setUser } = useContext(UserContext);
  const [rating, setRating] = useState<any>(0);
  const [isUser, setIsUser] = useState(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [reviewData, setReviewData] = useState<any[]>([]);

  const [itemInnerData, setItemInnerData] = useState(null);
  useEffect(() => {
    const userFetch = async () => {
      await fetch(`http://localhost:5002/user/${id}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setItemData(result.item);
          setUserData(result.user);
          if (result.user._id == user?.data?._id) {
            setIsUser(true);
          }
        });
    };
    const userReviewFetch = async () => {
      await fetch(`http://localhost:5002/userReview/${id}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setReviewData(result.reviews);
        });
    };
    if (id) {
      userFetch();
      userReviewFetch();
    }
  }, []);

  useEffect(() => {
    let sum = 0;
    reviewData.forEach((review) => {
      sum += review?.rating;
    });
    setRating(sum / reviewData.length);
  }, [reviewData]);

  const renderItems = () => {
    return (
      <div className={styles.innerContainer}>
        {itemData ? (
          itemData.map((item) => {
            return <ItemSmallCard data={item} />;
          })
        ) : (
          <div>
            <h2 className={styles.header1}>
              User Have No Items Selling Yet....
            </h2>
          </div>
        )}
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div
        style={{ flexDirection: "column" }}
        className={styles.innerContainer}
      >
        {reviewData.length != 0 ? (
          reviewData.map((review) => {
            return (
              <Comment
                author={
                  <a>{review.postedBy.name || review.postedBy.walletAdd}</a>
                }
                avatar={<Avatar src={review.postedBy.pic} alt="avatar" />}
                content={<p>{review.message}</p>}
                datetime={
                  <Tooltip title={moment().format("YYYY-MM-DD")}>
                    <span>{moment(review.createdAt).format("YYYY-MM-DD")}</span>
                  </Tooltip>
                }
              />
            );
          })
        ) : (
          <div>
            <h2 className={styles.header1}>User Have No Reviews Yet....</h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Profile isUser={isUser} data={userData} rating={rating} />
      {/* <h1 className={styles.header1}>Listed Items</h1> */}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Items Listed" key="1">
          {renderItems()}
        </TabPane>
        <TabPane tab="User Reviews" key="2">
          <div>{renderReviews()}</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserScreen;
