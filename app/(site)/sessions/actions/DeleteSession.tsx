"use client";

import { Session } from "@prisma/client";
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

export default function DeleteSession({
  session,
}: {
  session: Session;
}) {
  function onDelete(id: number) {
    fetch("/api/sessions/delete/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((response) => {
      if (response.ok) {
        window.location.reload();
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
            <DialogTitle className="mb-4">Sei sicuro?</DialogTitle>
            <div>
              Stai per eliminare <strong>{JSON.stringify(session)}</strong>, sei
              sicuro?
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                onDelete(session.id);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
