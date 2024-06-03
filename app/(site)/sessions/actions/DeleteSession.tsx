"use client";

import { Session } from "@prisma/client";
import { it } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { SessionWithRider } from "../../types/SessionWithRider";
import { format } from "date-fns";

export default function DeleteSession({
  session,
  onDelete,
}: {
  session: SessionWithRider;
  onDelete: (id: number) => void;
}) {
  function handleDelete(id: number) {
    fetch("/api/sessions/delete/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((response) => {
      if (response.ok) {
        onDelete(id);
      }
    });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Trash size={32} className="hover:cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Elimina turno</DialogTitle>
            <div>
              Stai per eliminare il turno di{" "}
              <strong>{session.rider.nickname ?? session.rider.surname}</strong>{" "}
              del giorno{" "}
              <strong>
                {format(session.date ?? new Date(), "PPP", { locale: it })}
              </strong>
              , sei sicuro?
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Indietro
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleDelete(session.id);
              }}
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
