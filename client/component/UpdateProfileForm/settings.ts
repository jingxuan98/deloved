import { Props } from "./props";

export const getFieldMeta = (props: Props) => {
  const { pic, name } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "name",
        label: "Name",
        placeholder: "Your Name",
        initialValue: name,
        hasFeedback: true,
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
