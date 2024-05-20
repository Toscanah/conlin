"use client";

import BarLoader from "react-spinners/BarLoader";
import { DateRange } from "react-day-picker";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsType } from "./StatsType";

export default function StatsResult({
  index,
  riderId,
  date,
  context,
  isAllRiders,
  onResult,
}: {
  index: number;
  riderId?: number;
  date: DateRange | undefined;
  context: string;
  isAllRiders: boolean;
  onResult: (result: StatsType[], index: number) => void;
}) {
  const [result, setResult] = useState<StatsType[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const body = isAllRiders
      ? { date, context, isAllRiders: true }
      : { riderId, date, context, isAllRiders: false };

    fetch("/api/stats/get", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          setResult(result);
          onResult(result, index);
          setLoading(false);
        });
      }
    });
  }, [riderId, date, context, isAllRiders]);

  return (
    <div className="w-full overflow-y-auto max-h-[400px]">
      {date && result && result.length !== 0 ? (
        <Table className="w-full text-2xl">
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
                  <TableCell>{item.totalTip}€</TableCell>
                )}
                {item.totalMoney !== undefined && (
                  <TableCell>{item.totalMoney}€</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : loading ? (
        <BarLoader color="#00C0FF" loading={loading} width={"100%"} />
      ) : (
        <h1 className="w-full text-center text-4xl overflow-y-hidden">
          Nessun risultato!
        </h1>
      )}
    </div>
  );
}
