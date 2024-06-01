"use client";

import { SignOut } from "@phosphor-icons/react";
import { useContext } from "react";
import { ConlinContext } from "./context/ConlinContext";

export default function Logout() {
  const { setIsLogged } = useContext(ConlinContext);

  setIsLogged(false);

  return (
    <SignOut
      size={40}
      onClick={() => {
        window.location.replace("../");
      }}
    />
  );
}
