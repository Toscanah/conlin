"use client";

import { UsersThree  } from "@phosphor-icons/react";

import Link from "next/link";

export default function RidersDialog() {
  return (
    <Link href={"/riders"}>
      <UsersThree  size={48} className="hover:cursor-pointer" />
    </Link>
  );
}
