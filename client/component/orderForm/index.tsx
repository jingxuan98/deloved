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

const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const OrderForm: React.FC<Props> = (props) => {
  const { data, mode, sell } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

  const showOrderModal = () => {
    setIsOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalVisible(false);
  };

  const renderOrderModal = () => {
    return (
      <Modal
        maskClosable
        footer={null}
        title={data?.item?.title}
        visible={isOrderModalVisible}
      >
        <UpdateOrderForm closeModal={closeOrderModal} _id={data?._id} />
      </Modal>
    );
  };

  return (
    <Form form={form} layout="vertical">
      {renderOrderModal()}
      <div style={{ width: "100%", textAlign: "center", margin: "10px 0px" }}>
        {mode === "view" && (
          <img style={{ width: 300 }} src={data?.item?.photo} alt="profile" />
        )}
      </div>

      <FormBuilder meta={metas} form={form} viewMode={mode === "view"} />
      <div className={styles.orderActionContainer}>
        {sell ? (
          <>
            <Button onClick={showOrderModal} type="ghost">
              Update Order
            </Button>
            <Button type="ghost">Review Buyer</Button>
          </>
        ) : (
          <>
            <Button type="ghost">Release Funds</Button>
            <Button type="ghost">Review Seller</Button>
          </>
        )}
      </div>
    </Form>
  );
};
export default OrderForm;
OrderForm.defaultProps = initialProps;
