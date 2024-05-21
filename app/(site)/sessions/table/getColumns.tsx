"use client";

import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format, toZonedTime } from "date-fns-tz";
import { it } from "date-fns/locale";
import { SessionWithRider } from "../../types/SessionWithRider";

export default function getColumns(
  onEdit?: (session: SessionWithRider) => void,
  onDelete?: (session: SessionWithRider) => void
): ColumnDef<SessionWithRider>[] {
  return [
    {
      accessorKey: "#",
      cell: ({ row, table }) =>
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            *Data
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.date;
        const timeZone = "Europe/Rome"; // Italian timezone
        const zonedDate = toZonedTime(date ?? new Date(), timeZone);
        const formattedDate = format(zonedDate, "EEEE dd-MM-yyyy", {
          locale: it,
        });

        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      },
    },
    {
      accessorKey: "rider.nickname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ragazzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      // cell: ({ row }) => row.original.rider?.nickname,
    },
    {
      accessorKey: "lunch_orders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ordini pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "lunch_time",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ore pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dinner_orders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ordini cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "dinner_time",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ore cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "tip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mancia
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Azioni",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {/* <EditRider rider={row.original} onEdit={onEdit} /> */}
            {/* <DeleteRider rider={row.original} onDelete={onDelete} /> */}
          </div>
        );
      },
    },
  ];
}
