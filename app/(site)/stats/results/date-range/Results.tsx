"use client";

import { ThreeDots } from "react-loader-spinner";
import { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { StatsType } from "./StatsType";
import * as React from "react";
import { VisibilityState, flexRender } from "@tanstack/react-table";
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
import { cn } from "@/lib/utils";
import TotalStats from "../TotalStats";
import { TotalsType } from "../../../types/TotalType";
import Graph from "../Graph";

export default function Results({
  riderId,
  dateRange,
  context,
  session,
  isAllRiders,
}: {
  riderId?: number;
  dateRange: DateRange | undefined;
  context: string;
  session: string;
  isAllRiders: boolean;
}) {
  const [result, setResult] = useState<StatsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totals, setTotals] = useState<TotalsType>({});
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
  const [noResult, setNoResult] = useState<boolean>(false);

  useEffect(() => {
    setResult([]);
    setNoResult(false);

    setLoading(true);
    const body = isAllRiders
      ? { dateRange, context, session, isAllRiders: true }
      : { dateRange, context, session, isAllRiders: false, riderId };

    fetch("/api/stats/get", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          setLoading(false);

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
          setNoResult(sortedResult.length == 0);
        });
      }
    });
  }, [riderId, dateRange, context, session, isAllRiders]);

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

  useEffect(() => {
    if (result) {
      let totals: TotalsType = {};

      result.map((single) => {
        if (single.totalOrders !== undefined)
          totals.totalOrders = (totals.totalOrders ?? 0) + single.totalOrders;
        if (single.totalHours !== undefined)
          totals.totalHours = (totals.totalHours ?? 0) + single.totalHours;
        if (single.totalPay !== undefined)
          totals.totalPay = (totals.totalPay ?? 0) + single.totalPay;
        if (single.totalTip !== undefined)
          totals.totalTip = (totals.totalTip ?? 0) + single.totalTip;
        if (single.totalMoney !== undefined)
          totals.totalMoney = (totals.totalMoney ?? 0) + single.totalMoney;
        return null;
      });

      setTotals(totals);
    }
  }, [result]);

  return (
    <div
      className="w-full flex justify-center 
                  flex-col gap-8 rounded-lg"
    >
      <div className="flex flex-col">
        {!loading && (
          <span className="mb-2 w-full flex justify-center">Risultati:</span>
        )}

        <div
          className="w-full overflow-y-auto max-h-[40vh] rounded-md border-2 border-primary"
          id="main"
        >
          {loading && (
            <div className="p-4">
              <ThreeDots color="#D81B60" visible={loading} width={"100%"} />
            </div>
          )}

          {((dateRange && result && result.length !== 0) || noResult) && (
            <Table>
              <TableHeader className="sticky top-0 z-30 bg-background">
                {table.getRowModel().rows?.length > 0 &&
                  table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            index === 0 &&
                              "sticky left-0 bg-foreground z-40 text-background"
                          )}
                        >
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
                        <TableCell
                          key={cell.id}
                          className={cn(
                            index === 0 &&
                              "sticky left-0 bg-foreground z-20 text-background font-bold"
                          )}
                        >
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
                      Nessun risultato!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && table.getRowModel().rows?.length > 1 && isAllRiders && (
          <span className="text-muted-foreground mt-1 text-xs italic">
            Pro tip: puoi cliccare una colonna per ordinare i risultati in base
            ad essa
          </span>
        )}
      </div>

      {Object.keys(totals).length !== 0 && totals && !loading && (
        <div className="w-[100%] overflow-x-auto rounded-md border-2 border-primary p-4">
          <span className="mb-2 w-full flex justify-center">Totale:</span>
          <div className="w-full">
            <TotalStats totals={totals} />
          </div>
        </div>
      )}

      {/* {result && result.length > 1 && (
        <>
          <span className="text-[0.25rem]">-</span>
          <Graph results={result} />
        </>
      )} */}
    </div>
  );
}
