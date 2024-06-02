"use client";

import { FloppyDisk  } from "@phosphor-icons/react";
import { Session } from "@prisma/client";

export default function SaveSession({
  session,
  onSave,
}: {
  session: Session;
  onSave: (id: number) => void;
}) {
  return (
    <FloppyDisk  size={32} className="hover:cursor-pointer" onClick={() => onSave(session.id)} />
  );
}
