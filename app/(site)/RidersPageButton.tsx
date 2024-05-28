"use client";

import { UsersThree } from "@phosphor-icons/react";

import Link from "next/link";

export const revalidate = 0;

export default function RidersPageButton() {
  return (
    <Link href={"/riders"}>
      <UsersThree
        size={40}
        className="hover:cursor-pointer hover:scale-110 hover:bg-white hover:bg-opacity-5 rounded p-1"
      />
    </Link>
  );
}
