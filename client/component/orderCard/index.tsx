import { useContext, useState, useEffect } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  TagOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";
import { Props, initialProps } from "./props";
import styles from "../../styles/Component.module.css";
import OrderForm from "../orderForm";

const { Panel } = Collapse;
const fallback =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty-300x240.jpg";

const OrderCard: React.FC<Props> = (props) => {
  const { data, key } = props;
  console.log(data, key);
  return (
    <Panel header={`OrderID: ${data?._id}`} key={1}>
      <OrderForm mode="view" data={data} />
    </Panel>
  );
};
export default OrderCard;
OrderCard.defaultProps = initialProps;
