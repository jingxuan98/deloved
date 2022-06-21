import React, { useContext, useState, useEffect } from "react";
import FormBuilder from "antd-form-builder";
import { Props, initialProps } from "./props";
import styles from "../../styles/Component.module.css";
import { Button, Form, notification } from "antd";
import getFieldMeta from "./settings";
import { UserContext } from "../../pages/_app";

const ItemForm: React.FC<Props> = (props) => {
  const { data } = props;
  const { user, setUser } = useContext(UserContext);
  const [image, setImage] = useState<File | null>(null);
  const [item, setItem] = useState(null);
  const [url, setUrl] = useState(null);
  const metas = getFieldMeta(props);
  const [form] = Form.useForm();

  useEffect(() => {
    //callback to run code after url is set
    if (item) {
      fetch(`http://localhost:5002/updateItem/${data?._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title,
          body: item.body,
          photo: url,
          price: item.price,
          catogery: item.catogery,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            console.log({ html: data.error });
          } else {
            //Success
            notification.open({ message: result.message });
            location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const onActionSubmit = (values: any) => {
    setItem(values);
    if (image != null) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "usmforum");
      data.append("cloud_name", "dfoc7c90v");

      fetch("https://api.cloudinary.com/v1_1/dfoc7c90v/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(url);
          setUrl(data.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetch(`http://localhost:5002/updateItem/${data?._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          body: values.body,
          photo: data?.photo,
          price: values.price,
          catogery: values.catogery,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            console.log({ html: data.error });
          } else {
            //Success
            notification.open({ message: result.message });
            location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <Form form={form} layout="vertical" onFinish={onActionSubmit}>
          <div className="file-field input-field">
            <FormBuilder meta={metas} form={form} />
            <img src={data?.photo} style={{ width: 200, marginBottom: 24 }} />
            <div className="btn">
              <span style={{ fontWeight: "600" }}>Photo</span>
              <input
                type="file"
                style={{ marginTop: 8 }}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          <Form.Item style={{ textAlign: "right" }}>
            <Button htmlType="submit" type="primary">
              Update Item
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default ItemForm;
ItemForm.defaultProps = initialProps;
