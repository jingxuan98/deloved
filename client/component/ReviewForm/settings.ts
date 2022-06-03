import { Select } from "antd";
import { Props } from "./props";

export const getFieldMeta = (props: Props) => {
  const { data } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "message",
        label: "Review Message",
        placeholder: "Type Your Review Message...",
        hasFeedback: true,
      },
      {
        key: "rating",
        label: "User Rating",
        placeholder: "Select Rating Score",
        hasFeedback: true,
        widget: Select,
        options: [
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
          { value: 5, label: "5" },
        ],
        rules: [
          {
            required: true,
            message: "This field is required",
          },
        ],
      },
    ],
  };
};

export default getFieldMeta;
