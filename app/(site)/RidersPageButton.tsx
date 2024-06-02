"use client";

import { Moped  } from "@phosphor-icons/react";

import Link from "next/link";

export const revalidate = 0;

export default function  RidersPageButton() {
  return (
    <Link
      href={"/riders"}
      className="flex gap-3 items-center 
    hover:cursor-pointer hover:bg-foreground/5 hover:underline
    rounded p-2"
    >
      <Moped  size={32} />
      <span className="text-sm">Ragazzi</span>
    </Link>
  );
}
