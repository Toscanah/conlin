import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { StatsType } from "./StatsType";
import getColumns from "./getColumns";
import getTable from "./getTable";
import { VisibilityState, flexRender } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TotalsType } from "@/app/(site)/types/TotalType";
import TotalStats from "../TotalStats";
import { addDays, subDays } from "date-fns";
import { Separator } from "@/components/ui/separator";
import AverageStats from "./average/AverageStats";

export default function Results({
  index,
  daysOfWeek,
  context,
  session,
  periodChoice,
  year,
  yearOfMonth,
  month,
}: {
  index: number;
  daysOfWeek: string[];
  context: string;
  session: string;
  periodChoice: string;
  year: string;
  yearOfMonth: string;
  month: string;
}) {
  const [totals, setTotals] = useState<TotalsType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<StatsType[]>([]);
  const [noResult, setNoResult] = useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  
  useEffect(() => {
    setResult([]);
    setNoResult(false);
    setLoading(true);
    const body = {
      days: daysOfWeek,
      context,
      session,
      periodChoice,
      month,
      year,
      yearOfMonth,
    };

    fetch("/api/stats/get", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        response.json().then((result: StatsType[]) => {
          result.sort((a, b) => {
            const dayOfWeekA = subDays(new Date(a.day), 2).getDay();
            const dayOfWeekB = subDays(new Date(b.day), 2).getDay();
            
            return dayOfWeekA - dayOfWeekB;
          });
          
          setLoading(false);
          setResult(result);
          setNoResult(result.length == 0);
        });
      }
    });
  }, [daysOfWeek, context, session, periodChoice, month, year, yearOfMonth]);
  
  useEffect(() => {
    const visibility = {
      riderName: true,
      totalOrders: context === "orders" || context === "all",
      totalHours: context === "time" || context === "all",
      totalPay: context === "pay" || context === "all",
      totalTip: context === "tip" || context === "all",
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
  
  let previousDay = null;
  
  const columns = getColumns(result);
  const table = getTable(
    result,
    columns,
    columnVisibility,
    setColumnVisibility
  );

  return (
    <div
    className="w-full flex justify-center 
    flex-col gap-8 rounded-lg"
    >
      <div className="flex flex-col">
        {!loading && !noResult && (
          <span className="mb-2 w-full flex justify-center">Risultati:</span>
        )}

        <div
          className="w-full overflow-y-auto max-h-[40vh] 
          rounded-md border-2 border-primary"
          id="main"
          >
          {loading && (
            <div className="p-4">
              <ThreeDots
                color={`hsl(${getComputedStyle(document.documentElement)
                  .getPropertyValue("--foreground")
                  .trim()})`}
                  visible={loading}
                  width={"100%"}
                  />
            </div>
          )}

          {((daysOfWeek.length > 0 &&
            result.length > 0 &&
            ((periodChoice === "year" && year !== "") ||
              (periodChoice === "month" &&
                month !== "" &&
                yearOfMonth !== ""))) ||
            noResult) && (
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

        {!loading && table.getRowModel().rows?.length > 1 && (
          <span className="text-muted-foreground mt-1 text-xs italic">
            Pro tip: puoi cliccare una colonna per ordinare i risultati in base
            ad essa
          </span>
        )}
      </div>

      {!loading && !noResult && (
        <div
          className={cn(
            "flex w-full items-center gap-8 rounded-md border-2 border-primary p-4 flex-col"
          )}
        >
          {Object.keys(totals).length !== 0 && totals && (
            <div className="w-[100%] overflow-x-auto">
              <span className="mb-2 w-full flex justify-center">Totale:</span>
              <div className="w-full">
                <TotalStats totals={totals} />
              </div>
            </div>
          )}

          {/* <Separator orientation="vertical" className="h-auto" /> */}
          <span className="text-[0.25rem]">-</span>

          {result.length !== 0 && (
            <div className="w-[100%] overflow-x-auto">
              <span className="mb-2 w-full flex justify-center">Media:</span>
              <div className="w-full">
                <AverageStats result={result} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
