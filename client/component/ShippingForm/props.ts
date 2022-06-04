import { User, Item } from "../itemSmallCard/props";

type data = {
  _id?: string | string[];
  item?: Item;
  buyer?: User;
  seller?: User;
  txn?: string;
  receiverName?: string;
  phone?: string;
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
  onSubmit?: (values: any) => void;
  closeModal?: () => void;
  mode?: "update" | "create";
};

export const initialProps = { mode: "create" };
