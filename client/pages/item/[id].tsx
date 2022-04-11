import { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Item() {
  const router = useRouter();
  const { id } = router.query;

  const ItemScreen = dynamic(
    () => import("../../component/screen/ItemScreen"),
    { ssr: false }
  );

  return <ItemScreen id={id} />;
}
