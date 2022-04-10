import { useContext, useState, useEffect, useImperativeHandle } from "react";
import FormBuilder from "antd-form-builder";
import { Props, initialProps } from "./props";
import styles from "../../styles/Component.module.css";
import { Form } from "antd";
import getFieldMeta from "./settings";

const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const OrderForm: React.FC<Props> = (props) => {
  const { data, mode } = props;

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  //   const onActionSubmit = (values: any) => {
  //     onSubmit?.(values, imageUrl);
  //   };

  return (
    <Form form={form} layout="vertical">
      <div style={{ width: "100%", textAlign: "center", margin: "10px 0px" }}>
        {mode === "view" && (
          <img style={{ width: 300 }} src={data?.item?.photo} alt="profile" />
        )}
      </div>
      <FormBuilder meta={metas} form={form} viewMode={mode === "view"} />
    </Form>
  );
};
export default OrderForm;
OrderForm.defaultProps = initialProps;
