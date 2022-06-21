import React, {
  useContext,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import FormBuilder from "antd-form-builder";
import { Props, initialProps } from "./props";
import styles from "../../styles/Component.module.css";
import { Button, Form, notification } from "antd";
import getFieldMeta from "./settings";

const ShippingForm: React.FC<Props> = (props) => {
  const { onSubmit, closeModal } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const onActionSubmit = async (values: any) => {
    onSubmit(values);
    // await fetch(`http://localhost:5002/createReview`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     orderId: _id,
    //     userId,
    //     _id: postedId,
    //     message: values.message,
    //     rating: values.rating,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((result) => {
    //     notification.open({
    //       message: result.message,
    //     });
    //     closeModal();
    //   });
  };

  return (
    <Form
      style={{ paddingBottom: 30 }}
      onFinish={onActionSubmit}
      form={form}
      layout="vertical"
    >
      <FormBuilder meta={metas} form={form} />
      <Button style={{ float: "right" }} htmlType="submit" type="primary">
        Submit
      </Button>
    </Form>
  );
};
export default ShippingForm;
ShippingForm.defaultProps = initialProps;
