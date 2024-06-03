"use client";

import { SignOut } from "@phosphor-icons/react";
import Link from "next/link";

export default function Logout() {
  return (
    <Link
      href={"../"}
      className="flex gap-3 items-center 
                  hover:cursor-pointer hover:bg-foreground/5 hover:underline
                  rounded p-2"
    >
      <SignOut size={32} />
      <span className="text-sm">Esci</span>
    </Link>
  );
}
