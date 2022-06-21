import { catogeries } from "./../../pages/createPost/settings";
import { InputNumber, Select } from "antd";
import { Props } from "./props";

export const getFieldMeta = (props) => {
  const { data } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "title",
        label: "Item Title",
        placeholder: "Item Title",
        initialValue: data?.title,
        hasFeedback: true,
        rules: [
          {
            required: true,
            message: "This field is required",
          },
        ],
      },
      {
        key: "body",
        label: "Item Description",
        placeholder: "Description",
        initialValue: data?.body,
        hasFeedback: true,
        rules: [
          {
            required: true,
            message: "This field is required",
          },
        ],
      },
      {
        key: "price",
        label: "Price",
        initialValue: data?.price,
        widget: InputNumber,
        rules: [
          {
            required: true,
            message: "This field is required",
          },
        ],
        prefix: "BUSD",
        min: 1,
        max: 9999,
        placeholder: "Price in (BUSD)",
      },
      {
        key: "catogery",
        label: "Catogery",
        initialValue: data?.catogery,
        widget: Select,
        placeholder: "Click To Select",
        options: catogeries,
      },
    ],
  };
};
export default getFieldMeta;
