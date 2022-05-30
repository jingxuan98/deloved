import React, { useContext, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Item() {
  const router = useRouter();
  const { id } = router.query;

  const UserScreen = dynamic(
    () => import("../../component/screen/UserScreen"),
    { ssr: false }
  );

  return <UserScreen id={id} />;
}
