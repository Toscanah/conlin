"use client";

import { ArrowBendUpLeft } from "@phosphor-icons/react";

import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BackHome() {
  return (
    <Link href={"../"}>
      <ArrowBendUpLeft size={48} className="hover:cursor-pointer" />
    </Link>
  );
}
