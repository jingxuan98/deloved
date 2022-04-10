import { User, Item } from "../itemSmallCard/props";

type data = {
  _id?: string | string[];
  item?: Item;
  buyer?: User;
  seller?: User;
  txn?: string;
  address1?: string;
  address2?: string;
  postcode?: string;
  state?: string;
  country?: string;
  status?: "PROCESSING" | "COMPLETED" | "SHIPPED";
  trackingNo?: string;
  courrierName?: string;
};

export type Props = {
  data?: data;
  edit?: boolean;
  key?: string;
};

export const initialProps = {
  edit: false,
};
