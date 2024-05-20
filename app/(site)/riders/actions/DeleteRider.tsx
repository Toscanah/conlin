import { Rider } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "@phosphor-icons/react";

export default function DeleteRider({
  rider,
  onDelete,
}: {
  rider: Rider;
  onDelete: (rider: Rider) => void;
}) {
  return <>
  <Dialog>
    <DialogTrigger asChild>
      <Trash size={32} className="hover:cursor-pointer" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-4">
          Sei sicuro?
        </DialogTitle>
        <div>Stai per eliminare <strong>{rider.nickname}</strong>, sei sicuro?</div>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</>
}
