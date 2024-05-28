"use client";

import BarLoader from "react-spinners/BarLoader";
import { DateRange } from "react-day-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import { StatsType } from "../../types/StatsType";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTable from "./getTable";
import getColumns from "./getColumns";

export default function StatsResult({
  index,
  riderId,
  date,
  context,
  session,
  isAllRiders,
  onResult,
}: {
  index: number;
  riderId?: number;
  date: DateRange | undefined;
  context: string;
  session: string;
  isAllRiders: boolean;
  onResult: (result: StatsType[], index: number) => void;
}) {
  const [result, setResult] = useState<StatsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = getColumns();
  const table = getTable(
    result,
    columns,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility
  );

  useEffect(() => {
    setLoading(true);
    const body = isAllRiders
      ? { date, context, session, isAllRiders: true }
      : { date, context, session, isAllRiders: false, riderId };

    fetch("/api/stats/get", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          let sortedResult: StatsType[];

          switch (context) {
            case "all":
              sortedResult = result.sort((a: StatsType, b: StatsType) =>
                a.riderName.localeCompare(b.riderName)
              );
              break;
            case "orders":
              sortedResult = result.sort(
                (a: StatsType, b: StatsType) =>
                  (b.totalOrders ?? 0) - (a.totalOrders ?? 0)
              );
              break;
            case "time":
              sortedResult = result.sort(
                (a: StatsType, b: StatsType) =>
                  (b.totalHours ?? 0) - (a.totalHours ?? 0)
              );
              break;
            case "pay":
              sortedResult = result.sort(
                (a: StatsType, b: StatsType) =>
                  (b.totalPay ?? 0) - (a.totalPay ?? 0)
              );
              break;
            case "tip":
              sortedResult = result.sort(
                (a: StatsType, b: StatsType) =>
                  (b.totalTip ?? 0) - (a.totalTip ?? 0)
              );
              break;
            case "total":
              sortedResult = result.sort(
                (a: StatsType, b: StatsType) =>
                  (b.totalMoney ?? 0) - (a.totalMoney ?? 0)
              );
              break;
            default:
              sortedResult = result;
              break;
          }

          setResult(sortedResult);
          onResult(sortedResult, index);
          setLoading(false);
        });
      }
    });
  }, [riderId, date, context, session, isAllRiders]);

  useEffect(() => {
    const isSessionBoth = session === "both";

    const visibility = {
      riderName: true,
      lunchOrders:
        context === "all" ||
        (context === "orders" && (session === "both" || session === "lunch")),
      dinnerOrders:
        context === "all" ||
        (context === "orders" && (session === "both" || session === "dinner")),
      totalOrders: (context === "orders" && isSessionBoth) || context === "all",
      lunchHours:
        context === "all" ||
        (context === "time" && (session === "both" || session === "lunch")),
      dinnerHours:
        context === "all" ||
        (context === "time" && (session === "both" || session === "dinner")),
      totalHours: (context === "time" && isSessionBoth) || context === "all",
      lunchPay:
        context === "all" ||
        (context === "pay" && (session === "both" || session === "lunch")),
      dinnerPay:
        context === "all" ||
        (context === "pay" && (session === "both" || session === "dinner")),
      totalPay: (context === "pay" && isSessionBoth) || context === "all",
      lunchTip:
        context === "all" ||
        (context === "tip" && (session === "both" || session === "lunch")),
      dinnerTip:
        context === "all" ||
        (context === "tip" && (session === "both" || session === "dinner")),
      totalTip: (context === "tip" && isSessionBoth) || context === "all",
      totalMoney: context === "all" || context === "total",
    };

    setColumnVisibility(visibility);
  }, [context, session]);

  return (
    <div className="w-full overflow-y-auto max-h-[400px] rounded-md border">
      {/* <Table className="w-full text-2xl">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {result.some((item) => item.riderName !== undefined) && (
                <TableHead className="w-[12%]">Ragazzo</TableHead>
              )}
              {result.some((item) => item.totalOrders !== undefined) && (
                <TableHead className="w-[12%]">Consegne</TableHead>
              )}
              {result.some((item) => item.totalHours !== undefined) && (
                <TableHead className="w-[12%]">Ore</TableHead>
              )}
              {result.some((item) => item.totalPay !== undefined) && (
                <TableHead className="w-[12%]">Paga</TableHead>
              )}
              {result.some((item) => item.totalTip !== undefined) && (
                <TableHead className="w-[12%]">Mancia</TableHead>
              )}
              {result.some((item) => item.totalMoney !== undefined) && (
                <TableHead className="w-[12%]">Incasso totale</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.riderName}</TableCell>
                {item.totalOrders !== undefined && (
                  <TableCell>{item.totalOrders}</TableCell>
                )}
                {item.totalHours !== undefined && (
                  <TableCell>{item.totalHours}</TableCell>
                )}
                {item.totalPay !== undefined && (
                  <TableCell>{item.totalPay}€</TableCell>
                )}
                {item.totalTip !== undefined && (
                  <TableCell>{item.totalTip.toFixed(2)}€</TableCell>
                )}
                {item.totalMoney !== undefined && (
                  <TableCell>{item.totalMoney}€</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table> */}

      {date && result && result.length !== 0 ? (
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : loading ? (
        <BarLoader color="#00C0FF" loading={loading} width={"100%"} />
      ) : (
        <h1 className="w-full text-center text-4xl overflow-y-hidden my-4">
          Nessun risultato!
        </h1>
      )}
    </div>
  );
}
