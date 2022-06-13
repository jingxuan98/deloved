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

const UpdateProfileForm: React.FC<Props> = (props) => {
  const { _id, pic, setUserProfile, closeModal } = props;
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [item, setItem] = useState(null);

  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  useEffect(() => {
    if (url && item) {
      fetch(`http://localhost:5002/update`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          name: item.name,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          notification.open({
            message: result.message,
          });
          setUserProfile(result.result);
        });
    }
  }, [url]);

  const onActionSubmit = async (values: any) => {
    if (image) {
      const data = new FormData();
      setItem(values);
      data.append("file", image);
      data.append("upload_preset", "usmforum");
      data.append("cloud_name", "dfoc7c90v");

      fetch("https://api.cloudinary.com/v1_1/dfoc7c90v/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url);
          setUrl(data.url);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(url);
    } else {
      fetch(`http://localhost:5002/update`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          name: item.name,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          notification.open({
            message: result.message,
          });
          setUserProfile(result.result);
        });
    }
  };

  return (
    <Form onFinish={onActionSubmit} form={form} layout="vertical">
      <img src={pic} style={{ height: 300, width: 300 }} />
      <div className="btn">
        <span>Attachment</span>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </div>
      <FormBuilder meta={metas} form={form} />
      <Button htmlType="submit" type="primary">
        Update
      </Button>
    </Form>
  );
};
export default UpdateProfileForm;
UpdateProfileForm.defaultProps = initialProps;
