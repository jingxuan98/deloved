import moment from "moment";
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
        key: "receiverName",
        label: "Receiver Name",
        initialValue: data?.receiverName,
      },
      {
        key: "phone",
        label: "Receiver Phone",
        initialValue: data?.phone,
      },
      {
        key: "address1",
        label: "Address Line 1",
        initialValue: data?.address1,
      },
      {
        key: "address2",
        label: "Address Line 2",
        initialValue: data?.address2,
      },
      {
        key: "postcode",
        label: "Postcode",
        initialValue: data?.postcode,
      },
      {
        key: "state",
        label: "State",
        initialValue: data?.state,
      },
      {
        key: "country",
        label: "Country",
        initialValue: data?.country,
      },
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
      {
        key: "createdAt",
        label: "Order Created",
        initialValue: moment(data?.createdAt, "YYYY-MM-DD"),
      },
    ],
  };
};

export default getFieldMeta;
