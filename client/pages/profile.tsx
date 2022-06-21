import styles from "../styles/Home.module.css";
import { UserContext } from "./_app";
import React, { useContext, useState, useEffect } from "react";
import ItemSmallCard from "../component/itemSmallCard";
import { Avatar, Tabs, Tooltip, Comment } from "antd";
import Profile from "../component/Profile";
import moment from "moment";

const { TabPane } = Tabs;

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [itemData, setItemData] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const [rating, setRating] = useState<any>(0);
  const [reviewData, setReviewData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [wishlistData, setWishlistData] = useState([]);

  const itemsFetch = async () => {
    await fetch(`http://localhost:5002/user/${user?.data?._id}`)
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
    await fetch(`http://localhost:5002/userReview/${user?.data?._id}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setReviewData(result.reviews);
      });
  };

  useEffect(() => {
    if (user?.data?._id) {
      itemsFetch();
      userReviewFetch();
    } else {
      setItemData([]);
    }
  }, [user]);

  useEffect(() => {
    let sum = 0;
    reviewData.forEach((review) => {
      sum += review?.rating;
    });
    setRating(sum / reviewData.length);
  }, [reviewData]);

  useEffect(() => {
    const wishlistFetch = async () => {
      await fetch(`http://localhost:5002/wishlist/${user?.data?._id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setWishlistData(result.likedItem);
        });
    };
    if (user?.data?._id) {
      wishlistFetch();
    } else {
      setWishlistData([]);
    }
  }, [user]);

  const renderItems = () => {
    return (
      <div className={styles.innerContainer}>
        {itemData ? (
          itemData.map((item) => {
            return <ItemSmallCard isDelete data={item} />;
          })
        ) : (
          <div>
            <h2 className={styles.header1}>
              You Have No Items Selling Yet....
            </h2>
          </div>
        )}
      </div>
    );
  };

  const renderWishlist = () => {
    return (
      <div className={styles.innerContainer}>
        {wishlistData ? (
          wishlistData.map((item) => {
            return <ItemSmallCard isDelete data={item} />;
          })
        ) : (
          <div>
            <h2 className={styles.header1}>Wishlist empty....</h2>
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
            <h2 className={styles.header1}>No Reviews Yet....</h2>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {!user?.data ? (
        <h2 className={styles.header1} style={{ fontWeight: 300 }}>
          Please Connect Your Wallet....
        </h2>
      ) : (
        <>
          <Profile isUser={isUser} data={userData} rating={rating} />

          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="My Items" key="1">
              {renderItems()}
            </TabPane>
            <TabPane tab="My Reviews" key="2">
              {renderReviews()}
            </TabPane>
            <TabPane tab="My Wishlist" key="3">
              {renderWishlist()}
            </TabPane>
          </Tabs>
        </>
      )}

      {/* <h1 className={styles.header1}>My Items</h1> */}
    </div>
  );
}
