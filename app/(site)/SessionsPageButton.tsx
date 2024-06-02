"use client";

import { ListMagnifyingGlass  } from "@phosphor-icons/react";

import Link from "next/link";

export default function SessionPageButton() {
  return (
    <Link
      href={"/sessions"}
      className="flex gap-3 items-center 
      hover:cursor-pointer hover:bg-foreground/5 hover:underline
      rounded p-2"
    >
      <ListMagnifyingGlass  size={32} />
      <span className="text-sm">Turni</span>
    </Link>
  );
}
