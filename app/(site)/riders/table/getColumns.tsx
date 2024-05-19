"use client";

import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { Rider } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import EditRider from "../actions/EditRider";

export default function getColumns(
  onEdit: (rider: Rider) => void,
): ColumnDef<Rider>[] {
  return [
    {
      accessorKey: "#",
      cell: ({ row, table }) =>
        (table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         ID
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "surname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cognome
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "nickname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nickname
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Attivo?
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (row.original.is_active ? "✅" : "❌"),
    },
    {
      accessorKey: "Azioni",
      cell: ({ row }) => <EditRider rider={row.original} onEdit={onEdit} />,
    },
  ];
}
