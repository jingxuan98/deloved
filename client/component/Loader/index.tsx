import React from "react";
import { Modal, Spin } from "antd";
import { Props } from "./props";

const Loader: React.FC<Props> = (props) => {
  const { loading, title } = props;

  return (
    <Modal
      closable={false}
      footer={null}
      visible={loading}
      centered
      style={{
        textAlign: "center",
      }}
    >
      <Spin />
      <p style={{ marginBottom: 0 }}>Loading...</p>
    </Modal>
  );
};

export default Loader;
