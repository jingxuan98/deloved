import { InputNumber, Select } from "antd";
// import { Props } from "./props";

export const catogeries = [
  { value: "Services", label: "Services" },
  { value: "Supplements", label: "Supplements" },
  { value: "Electronics", label: "Electronics" },
  { value: "Medical Supplies", label: "Medical Supplies" },
  { value: "Furnitures", label: "Furnitures" },
  { value: "Beauty & Cosmectics", label: "Beauty & Cosmectics" },
  { value: "Weapons", label: "Weapons" },
];

export const getFieldMeta = () => {
  // const { data, sell } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "title",
        label: "Item Title",
        placeholder: "Item Title",
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
        widget: InputNumber,
        rules: [
          {
            required: true,
            message: "This field is required",
          },
        ],
        prefix: "USMT",
        min: 1,
        max: 9999,
        placeholder: "Price in (USMT)",
      },
      {
        key: "catogery",
        label: "Catogery",
        widget: Select,
        placeholder: "Click To Select",
        options: catogeries,
      },
    ],
  };
};

export default getFieldMeta;
