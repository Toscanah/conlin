"use client";

import { ListBullets } from "@phosphor-icons/react";

import Link from "next/link";

export default function SessionPageButton() {
  return (
    <Link href={"/sessions"}>
      <ListBullets
        size={40}
        className="hover:cursor-pointer hover:scale-110 hover:bg-white hover:bg-opacity-5 rounded p-1"
      />
    </Link>
  );
}
