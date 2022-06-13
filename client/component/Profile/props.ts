export type User = {
  _id?: string | string[];
  name?: string;
  pic?: string;
  walletAdd?: string;
};

export type Props = {
  data?: User;
  isUser?: boolean;
  rating?: Number;
};

export const initialProps = {
  isUser: false,
};
