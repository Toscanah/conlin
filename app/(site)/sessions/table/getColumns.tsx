"use client";

import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { format, toZonedTime } from "date-fns-tz";
import { it } from "date-fns/locale";
import { SessionWithRider } from "../../types/SessionWithRider";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  CaretUpDown,
  Check,
} from "@phosphor-icons/react";

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
            className="w-[200px]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            *Data
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        // const date = row.original.date;
        // const timeZone = "Europe/Rome"; // Italian timezone
        // const zonedDate = toZonedTime(date ?? new Date(), timeZone);
        // const formattedDate = format(zonedDate, "EEEE dd-MM-yyyy", {
        //   locale: it,
        // });

        // return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !row.original.date && "text-muted-foreground"
                )}
              >
                {row.original.date ? (
                  format(row.original.date, "PPP", { locale: it })
                ) : (
                  <span>Filtra per data</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={it}
                mode="single"
                selected={row.original.date ?? new Date()}
                // onSelect={(date) => setDate(date ?? new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
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
      cell: ({ row }) => {
        return row.original.rider?.nickname == undefined ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          row.original.rider?.nickname
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
            Consegne pranzo
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.lunch_orders == undefined ||
          row.original.lunch_orders == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.lunch_orders} />
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
            Consegne cena
            <ArrowsDownUp className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return row.original.dinner_orders == undefined ||
          row.original.dinner_orders == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.dinner_orders} />
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
      cell: ({ row }) => {
        return row.original.lunch_time == undefined ||
          row.original.lunch_time == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.lunch_time} />
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
      cell: ({ row }) => {
        return row.original.dinner_time == undefined ||
          row.original.dinner_time == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.dinner_time} />
        );
      },
    },
    {
      accessorKey: "tip_lunch",
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
        return row.original.tip_lunch == undefined ||
          row.original.tip_lunch == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.tip_lunch} />
        );
      },
    },
    {
      accessorKey: "tip_dinner",
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
        return row.original.tip_dinner == undefined ||
          row.original.tip_dinner == 0 ? (
          <span className="text-muted-foreground hidden">/</span>
        ) : (
          <Input value={row.original.tip_dinner} />
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
