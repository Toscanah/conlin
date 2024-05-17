import { Rider } from "@prisma/client";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function AllRidersStats({
  date,
  context,
}: {
  date: DateRange | undefined;
  context: string
}) {
  const [orders, setOrders] =
    useState<{ riderName: string; totalOrders: number }[]>();

  useEffect(() => {
    console.log(orders);
    fetch("/api/stats/getAll", {
      method: "POST",
      body: JSON.stringify({
        date: date,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((orders) => {
          setOrders(orders);
        });
      }
    });
  }, [date]);

  return (
    <>
      {date && orders?.length !== 0 && (
        <Table className="w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Ragazzo</TableHead>
              <TableHead>Consegne</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders &&
              orders.map((order) => (
                <TableRow key={order.riderName}>
                  <TableCell>{order.riderName}</TableCell>
                  <TableCell>{order.totalOrders}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {orders?.length == 0 && (
        <h1 className="text-center w-full text-4xl">
          Nessuno ha effettuato ordini in questo periodo
        </h1>
      )}
    </>
  );
}
