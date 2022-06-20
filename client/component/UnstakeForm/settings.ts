import { InputNumber } from "antd";
import { Props } from "./props";

export const getFieldMeta = (props: Props) => {
  const { data } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "unstakeAmount",
        label: "Unstake Amount",
        placeholder: "eg. 100",
        widget: InputNumber,
        min: 10,
        hasFeedback: true,
        rules: [
          {
            type: "number",
            message: "The input is not a number",
          },
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
