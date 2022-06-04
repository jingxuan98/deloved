import { InputNumber, Select } from "antd";
import { Props } from "./props";

export const getFieldMeta = (props: Props) => {
  const { data, mode } = props;
  const require = mode == "create";

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "receiverName",
        label: "Receiver Name",
        placeholder: "Receiver Name",
        initialValue: data?.receiverName,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "phone",
        label: "Receiver Phone (country code)",
        placeholder: "+XXXXXXXXX",
        initialValue: data?.phone,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "address1",
        label: "Address Line 1",
        placeholder: "Address....",
        initialValue: data?.address1,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "address2",
        label: "Address Line 2",
        placeholder: "Address....",
        initialValue: data?.address2,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "postcode",
        label: "Postcode",
        placeholder: "6 digits Postcode",
        initialValue: data?.postcode,
        widget: InputNumber,
        hasFeedback: true,
        rules: [
          {
            type: "number",
            message: "The input is not a number",
          },
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "state",
        label: "State",
        placeholder: "State",
        initialValue: data?.state,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
      {
        key: "country",
        label: "Country",
        placeholder: "Country",
        initialValue: data?.country,
        hasFeedback: true,
        rules: [
          {
            required: require,
            message: "This field is required",
          },
        ],
      },
    ],
  };
};

export default getFieldMeta;
