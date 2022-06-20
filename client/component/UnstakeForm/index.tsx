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

const UnstakeForm: React.FC<Props> = (props) => {
  const { onSubmit } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  const onActionSubmit = async (values: any) => {
    onSubmit(values.unstakeAmount);
  };

  return (
    <Form onFinish={onActionSubmit} form={form} layout="vertical">
      <FormBuilder meta={metas} form={form} />
      <Button htmlType="submit" type="primary">
        Unstake
      </Button>
    </Form>
  );
};
export default UnstakeForm;
UnstakeForm.defaultProps = initialProps;
