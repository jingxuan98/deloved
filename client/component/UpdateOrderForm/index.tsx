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

const UpdateOrderForm: React.FC<Props> = (props) => {
  const { _id, closeModal } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const onActionSubmit = async (values: any) => {
    await fetch(`http://localhost:5002/updateOrder/${_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingNo: values.trackingNo,
        courrierName: values.courrierName,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        notification.open({
          message: result.message,
        });
        closeModal();
      });
  };

  return (
    <Form onFinish={onActionSubmit} form={form} layout="vertical">
      <FormBuilder meta={metas} form={form} />
      <Button style={{ float: "right" }} htmlType="submit" type="primary">
        Update
      </Button>
    </Form>
  );
};
export default UpdateOrderForm;
UpdateOrderForm.defaultProps = initialProps;
