export type User = {
  _id?: string | string[];
  name?: string;
  pic?: string;
  walletAdd?: string;
};

export type Props = {
  data?: User;
  isUser?: boolean;
  showChatBtn?: boolean;
  isItemCard?: boolean;
  rating?: number;
};

export const initialProps = {
  isUser: false,
  showChatBtn: true,
};
