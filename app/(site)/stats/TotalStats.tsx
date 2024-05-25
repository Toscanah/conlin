import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalsType } from "../types/TotalType";

export default function TotalStats({ totals }: { totals: TotalsType }) {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <h1 className="text-4xl">In totale...</h1>
      <Table className="text-xl w-full">
        <TableHeader >
          <TableRow className="flex justify-center w-full items-center">
            {totals.totalOrders !== undefined && (
              <TableHead className="w-[20%] flex items-center">Ordini</TableHead>
            )}
            {totals.totalHours !== undefined && (
              <TableHead className="w-[20%] flex items-center">Ore</TableHead>
            )}
            {totals.totalPay !== undefined && (
              <TableHead className="w-[20%] flex items-center">Paghe</TableHead>
            )}
            {totals.totalTip !== undefined && (
              <TableHead className="w-[20%] flex items-center">Mance</TableHead>
            )}
            {totals.totalMoney !== undefined && (
              <TableHead className="w-[20%] flex items-center">Incassi</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="flex justify-center w-full items-center">
            {totals.totalOrders !== undefined && (
              <TableCell className="w-[20%]">
                <strong>{totals.totalOrders}</strong>
              </TableCell>
            )}
            {totals.totalHours !== undefined && (
              <TableCell className="w-[20%]">
                <strong>{totals.totalHours}</strong>
              </TableCell>
            )}
            {totals.totalPay !== undefined && (
              <TableCell className="w-[20%]">
                <strong>{totals.totalPay}</strong>
              </TableCell>
            )}
            {totals.totalTip !== undefined && (
              <TableCell className="w-[20%]">
                <strong>{totals.totalTip.toFixed(2)}</strong>
              </TableCell>
            )}
            {totals.totalMoney !== undefined && (
              <TableCell className="w-[20%]">
                <strong>{totals.totalMoney}€</strong>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
