import { Props } from "./props";

export const getFieldMeta = (props: Props) => {
  const { data, sell } = props;

  return {
    formItemLayout: [24, 24],
    fields: [
      {
        key: "title",
        label: "Item Title",
        initialValue: data?.item?.title,
      },
      ...(sell
        ? [
            {
              key: "buyer",
              label: "Buyer Name",
              initialValue: data?.buyer?.name,
            },
            {
              key: "buyerAdd",
              label: "Buyer Wallet Address",
              initialValue: data?.buyer?.walletAdd,
            },
          ]
        : [
            {
              key: "seller",
              label: "Seller Name",
              initialValue: data?.seller?.name,
            },
            {
              key: "sellerAdd",
              label: "Seller Wallet Address",
              initialValue: data?.seller?.walletAdd,
            },
          ]),
      {
        key: "trackingNo",
        label: "Tracking No",
        initialValue: data?.trackingNo,
      },
      {
        key: "courrierName",
        label: "Courrier Name",
        initialValue: data?.courrierName,
      },
      {
        key: "txn",
        label: "Transaction Hash",
        initialValue: data?.txn,
      },
      {
        key: "status",
        label: "Status",
        initialValue: data?.status,
      },
    ],
  };
};

export default getFieldMeta;
