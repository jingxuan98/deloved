import React, {
  useContext,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import FormBuilder from "antd-form-builder";
import { Props, initialProps } from "./props";
import UpdateOrderForm from "../UpdateOrderForm";
import styles from "../../styles/Component.module.css";
import { Button, Form, Modal } from "antd";
import getFieldMeta from "./settings";
import ReviewForm from "../ReviewForm";
import ShippingForm from "../ShippingForm";
import router from "next/router";

const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const OrderForm: React.FC<Props> = (props) => {
  const { data, mode, sell } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);

  const showOrderModal = () => {
    setIsOrderModalVisible(true);
  };

  const showShippingModal = () => {
    setIsShippingModalVisible(true);
  };

  const closeShippingModal = () => {
    setIsShippingModalVisible(false);
  };

  const showReviewModal = () => {
    setIsReviewModalVisible(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalVisible(false);
  };

  const closeReviewModal = () => {
    setIsReviewModalVisible(false);
  };

  const renderOrderModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeOrderModal}
        title={data?.item?.title}
        visible={isOrderModalVisible}
      >
        <UpdateOrderForm _id={data?._id} />
      </Modal>
    );
  };

  const renderReviewModal = () => {
    return (
      <Modal
        maskClosable
        onCancel={closeReviewModal}
        footer={null}
        title="Give User A Review"
        visible={isReviewModalVisible}
      >
        <ReviewForm
          _id={data?._id}
          postedId={sell ? data?.seller?._id : data?.buyer?._id}
          userId={sell ? data?.buyer?._id : data?.seller?._id}
        />
      </Modal>
    );
  };

  const submitOrder = async (values) => {
    const {
      receiverName,
      phone,
      address1,
      address2,
      postcode,
      state,
      country,
    } = values;

    await fetch(`http://localhost:5002/updateShippingDetails/${data?._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverName,
        phone,
        address1,
        address2,
        postcode,
        state,
        country,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        location.reload();
      });
  };

  const renderShippingModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        onCancel={closeShippingModal}
        title="Shipping Order Form"
        visible={isShippingModalVisible}
      >
        <ShippingForm data={data} mode="update" onSubmit={submitOrder} />
      </Modal>
    );
  };

  return (
    <Form form={form} layout="vertical">
      {renderOrderModal()}
      {renderShippingModal()}
      {renderReviewModal()}
      <div style={{ width: "100%", textAlign: "center", margin: "10px 0px" }}>
        {mode === "view" && (
          <img
            className={styles.orderImg}
            src={data?.item?.photo}
            alt="profile"
          />
        )}
      </div>

      <FormBuilder meta={metas} form={form} viewMode={mode === "view"} />
      <div className={styles.orderActionContainer}>
        {sell ? (
          <>
            <Button onClick={showOrderModal} type="ghost">
              Update Order
            </Button>
            <Button
              onClick={() => router.push(`/user/${data?.buyer?._id}`)}
              type="ghost"
            >
              View Buyer
            </Button>
            <Button
              onClick={() => router.push(`/item/${data?.item?._id}`)}
              type="ghost"
            >
              View Item
            </Button>
            <Button onClick={showReviewModal} type="ghost">
              Review Buyer
            </Button>
          </>
        ) : (
          <>
            <Button onClick={showShippingModal} type="ghost">
              Update Shipping
            </Button>
            <Button
              onClick={() => router.push(`/item/${data?.item?._id}`)}
              type="ghost"
            >
              View Item
            </Button>
            <Button
              onClick={() => router.push(`/user/${data?.seller?._id}`)}
              type="ghost"
            >
              View Seller
            </Button>
            <Button onClick={showReviewModal} type="ghost">
              Review Seller
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};
export default OrderForm;
OrderForm.defaultProps = initialProps;
