import { ColumnDef } from "@tanstack/react-table";
import { AverageType } from "./AverageType";
import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";

export default function getColumns(): ColumnDef<AverageType>[] {
  return [
    {
      accessorKey: "dayOfWeek",
      header: ({ column }) => "Giorno",
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">
          {row.original.dayOfWeek.charAt(0).toUpperCase() +
            row.original.dayOfWeek.slice(1)}
        </div>
      ),/**ashdbiasbdu */
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Consegne
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">
          {row.original.totalOrders}
        </div>
      ),
    },
    {
      accessorKey: "totalHours",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ore
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">
          {row.original.totalHours}
        </div>
      ),
    },
    {
      accessorKey: "totalPay",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paghe
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">{row.original.totalPay}</div>
      ),
    },
    {
      accessorKey: "totalTip",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mance
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">{row.original.totalTip}</div>
      ),
    },
    {
      accessorKey: "totalMoney",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Incassi
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-x-2">
          {row.original.totalMoney}
        </div>
      ),
    },
  ];
}
