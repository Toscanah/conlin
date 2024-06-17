import { ColumnDef } from "@tanstack/react-table";
import { StatsType } from "./StatsType";
import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { format, subDays } from "date-fns";
import { it } from "date-fns/locale";

export default function getColumns(): ColumnDef<StatsType>[] {
  return [
    {
      accessorKey: "day",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Giorno
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const formattedDate = format(
          subDays(row.original.day, 1),
          "EEEE d MMMM yyyy",
          { locale: it }
        );
        return formattedDate
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      },
    },
    // {
    //   accessorKey: "lunchOrders",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Consegne pranzo
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.lunchOrders == 0 ||
    //       row.original.lunchOrders == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.lunchOrders.toFixed(2)
    //     );
    //   },
    // },
    // {
    //   accessorKey: "dinnerOrders",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Consegne cena
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.dinnerOrders == 0 ||
    //       row.original.dinnerOrders == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.dinnerOrders.toFixed(2)
    //     );
    //   },
    // },
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
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.totalOrders.toFixed(2)
        );
      },
    },
    // {
    //   accessorKey: "lunchHours",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Ore pranzo
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.lunchHours == 0 ||
    //       row.original.lunchHours == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.lunchHours.toFixed(2)
    //     );
    //   },
    // },
    // {
    //   accessorKey: "dinnerHours",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Ore cena
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.dinnerHours == 0 ||
    //       row.original.dinnerHours == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.dinnerHours.toFixed(2)
    //     );
    //   },
    // },
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
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.totalHours.toFixed(2)
        );
      },
    },
    // {
    //   accessorKey: "lunchPay",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Paga pranzo
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.lunchPay == 0 ||
    //       row.original.lunchPay == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.lunchPay.toFixed(2)
    //     );
    //   },
    // },
    // {
    //   accessorKey: "dinnerPay",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Paga cena
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.dinnerPay == 0 ||
    //       row.original.dinnerPay == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.dinnerPay.toFixed(2)
    //     );
    //   },
    // },
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
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.totalPay.toFixed(2)
        );
      },
    },
    // {
    //   accessorKey: "lunchTip",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Mancia pranzo
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.lunchTip == 0 ||
    //       row.original.lunchTip == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.lunchTip.toFixed(2)
    //     );
    //   },
    // },
    // {
    //   accessorKey: "dinnerTip",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Mancia cena
    //         <ArrowsDownUp className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => {
    //     return row.original.dinnerTip == 0 ||
    //       row.original.dinnerTip == undefined ? (
    //       <span className="text-muted-foreground hidden">/</span>
    //     ) : (
    //       row.original.dinnerTip.toFixed(2)
    //     );
    //   },
    // },
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
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.totalTip.toFixed(2)
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
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.totalMoney.toFixed(2)
        );
      },
    },
  ];
}
