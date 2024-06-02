"use client";

import { SignOut } from "@phosphor-icons/react";

export default function Logout() {
  return (
    <SignOut
      size={32}
      onClick={() => {
        window.location.replace("../");
      }}
    />
  );
}
