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
  _id?: string | string[];
  userId?: string;
  closeModal?: () => void;
};

export const initialProps = {};
