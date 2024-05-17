"use client";

import { ArrowBendUpLeft } from "@phosphor-icons/react";

import Link from "next/link";

export default function BackHome() {
  return (
    <Link href={"../"}>
      <ArrowBendUpLeft size={48} className="hover:cursor-pointer" />
    </Link>
  );
}
