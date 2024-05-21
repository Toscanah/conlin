"use client";

import { ListBullets  } from "@phosphor-icons/react";

import Link from "next/link";

export default function SessionPageButton() {
  return (
    <Link href={"/sessions"}>
      <ListBullets  size={48} className="hover:cursor-pointer" />
    </Link>
  );
}