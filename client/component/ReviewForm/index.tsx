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

const ReviewForm: React.FC<Props> = (props) => {
  const { _id, userId, postedId, closeModal } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const onActionSubmit = async (values: any) => {
    await fetch(`http://localhost:5002/createReview`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: _id,
        userId,
        _id: postedId,
        message: values.message,
        rating: values.rating,
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
        Review
      </Button>
    </Form>
  );
};
export default ReviewForm;
ReviewForm.defaultProps = initialProps;
