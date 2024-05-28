import { ColumnDef } from "@tanstack/react-table";
import { StatsType } from "../../types/StatsType";
import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";

export default function getColumns(): ColumnDef<StatsType>[] {
  return [
    {
      accessorKey: "riderName",
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
    },
    {
      accessorKey: "lunchOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Consegne pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.lunchOrders == 0 ||
          row.original.lunchOrders == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.lunchOrders
        );
      },
    },
    {
      accessorKey: "dinnerOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Consegne cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.dinnerOrders == 0 ||
          row.original.dinnerOrders == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.dinnerOrders
        );
      },
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Consegne totali
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.totalOrders == 0 ||
          row.original.totalOrders == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.totalOrders
        );
      },
    },
    {
      accessorKey: "lunchHours",
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
      cell: ({ row }) => {
        return row.original.lunchHours == 0 ||
          row.original.lunchHours == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.lunchHours
        );
      },
    },
    {
      accessorKey: "dinnerHours",
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
      cell: ({ row }) => {
        return row.original.dinnerHours == 0 ||
          row.original.dinnerHours == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.dinnerHours
        );
      },
    },
    {
      accessorKey: "totalHours",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ore totali
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.totalHours == 0 ||
          row.original.totalHours == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.totalHours
        );
      },
    },
    {
      accessorKey: "lunchPay",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Paga pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.lunchPay == 0 ||
          row.original.lunchPay == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.lunchPay
        );
      },
    },
    {
      accessorKey: "dinnerPay",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Paga cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.dinnerPay == 0 ||
          row.original.dinnerPay == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.dinnerPay
        );
      },
    },
    {
      accessorKey: "totalPay",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Paga totale
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.totalPay == 0 ||
          row.original.totalPay == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.totalPay
        );
      },
    },
    {
      accessorKey: "lunchTip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mancia pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.lunchTip == 0 ||
          row.original.lunchTip == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.lunchTip
        );
      },
    },
    {
      accessorKey: "dinnerTip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mancia cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.dinnerTip == 0 ||
          row.original.dinnerTip == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.dinnerTip
        );
      },
    },
    {
      accessorKey: "totalTip",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mancia totale
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.totalTip == 0 ||
          row.original.totalTip == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.totalTip
        );
      },
    },
    {
      accessorKey: "totalMoney",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Incasso totale
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.totalMoney == 0 ||
          row.original.totalMoney == undefined ? (
          <span className="text-muted-foreground">/</span>
        ) : (
          row.original.totalMoney
        );
      },
    },
  ];
}
