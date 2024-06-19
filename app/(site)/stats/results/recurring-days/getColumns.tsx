import { ColumnDef } from "@tanstack/react-table";
import { StatsType } from "./StatsType";
import { Button } from "@/components/ui/button";
import {
  ArrowsDownUp,
  CaretDown,
  CaretUp,
  DotOutline,
  Equals,
  Minus,
} from "@phosphor-icons/react";
import { format, subDays } from "date-fns";
import { it } from "date-fns/locale";

interface ColumnConfig {
  accessorKey: keyof StatsType;
  headerLabel: string;
}

// Function to create a sortable column with shared comparison logic
function createSortableColumn({
  accessorKey,
  headerLabel,
}: ColumnConfig): ColumnDef<StatsType> {
  return {
    accessorKey,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {headerLabel}
        <ArrowsDownUp className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, table }) => {
      const currentVal = row.original[accessorKey] as number | undefined;

      if (currentVal == null || isNaN(currentVal)) {
        return <span className="text-muted-foreground hidden">/</span>;
      }

      const sortedRows = table.getSortedRowModel().rows;
      const currentIndex = sortedRows.findIndex((r) => r.id === row.id); // Get current index in sorted rows
      const prevIndex = currentIndex - 1;
      const prevRow = sortedRows[prevIndex];
      const prevVal = sortedRows[prevIndex]?.original[accessorKey] as
        | number
        | undefined;

      let comparisonSymbol = null;
      if (
        prevRow &&
        new Date(prevRow.original.day).getDay() ===
          new Date(row.original.day).getDay()
      ) {
        if (prevVal !== undefined) {
          if (currentVal > prevVal) {
            comparisonSymbol = <CaretUp size={20} color={"green"} />; // Up arrow
          } else if (currentVal < prevVal) {
            comparisonSymbol = <CaretDown size={20} color={"red"} />; // Down arrow
          } else {
            comparisonSymbol = <Equals size={20} color={"orange"} />; // Equal sign
          }
        } else {
          comparisonSymbol = <Minus size={20} color={"gray"} />;
        }
      } else {
        comparisonSymbol = <Minus size={20} color={"gray"} />;
      }

      return (
        <div className="flex items-center gap-x-2">
          {comparisonSymbol}
          {currentVal.toFixed(2)}{" "}
        </div>
      );
    },
  };
}

export default function getColumns(): ColumnDef<StatsType>[] {
  return [
    {
      accessorKey: "day",
      header: ({ column }) => "Giorno",
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

    createSortableColumn({
      accessorKey: "totalOrders",
      headerLabel: "Consegne totali",
    }),

    createSortableColumn({
      accessorKey: "totalHours",
      headerLabel: "Ore totali",
    }),

    createSortableColumn({
      accessorKey: "totalPay",
      headerLabel: "Paga totale",
    }),

    createSortableColumn({
      accessorKey: "totalTip",
      headerLabel: "Mancia totale",
    }),

    createSortableColumn({
      accessorKey: "totalMoney",
      headerLabel: "Incasso totale",
    }),
  ];
}
