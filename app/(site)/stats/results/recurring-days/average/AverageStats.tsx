import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsType } from "./../StatsType";
import { addDays, format, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { AverageType } from "./AverageType";
import getColumns from "./getColumns";
import getTable from "./getTable";
import { useState } from "react";
import { VisibilityState, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export default function AverageStats({ result }: { result: StatsType[] }) {
  const groupStatsByDay = (stats: StatsType[]): AverageType[] => {
    const dayStatsArray: AverageType[] = [];

    stats.forEach((stat) => {
      const dayOfWeek = format(subDays(stat.day, 1), "EEEE", { locale: it });

      const existingStats = dayStatsArray.find(
        (dayStat) => dayStat.dayOfWeek === dayOfWeek
      );

      if (existingStats) {
        existingStats.totalOrders += stat.totalOrders || 0;
        existingStats.totalHours += stat.totalHours || 0;
        existingStats.totalPay += stat.totalPay || 0;
        existingStats.totalTip += stat.totalTip || 0;
        existingStats.totalMoney += stat.totalMoney || 0;
        existingStats.count++;
      } else {
        dayStatsArray.push({
          dayOfWeek,
          totalOrders: stat.totalOrders || 0,
          totalHours: stat.totalHours || 0,
          totalPay: stat.totalPay || 0,
          totalTip: stat.totalTip || 0,
          totalMoney: stat.totalMoney || 0,
          count: 1,
        });
      }
    });

    return dayStatsArray;
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = getColumns();
  const table = getTable(
    groupStatsByDay(result),
    columns,
    columnVisibility,
    setColumnVisibility
  );

  return (
    <div className="flex flex-col gap-4 items-center w-full text-center">
      <Table>
        <TableHeader className="sticky top-0 z-30 bg-background">
          {table.getRowModel().rows?.length > 0 &&
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nessun risultato!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
