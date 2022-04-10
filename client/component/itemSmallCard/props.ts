type User = {
  _id?: string | string[];
  name?: string;
  walletAdd?: string;
};
//#endregion
type data = {
  _id?: string | string[];
  title?: string;
  body?: string;
  photo?: string;
  likes?: Object[];
  postedBy?: User;
  boughtBy?: User;
  status?: "UNSOLD" | "SOLD";
  catogery?: string;
  price?: Number;
};

export type Props = {
  data?: data;
};
