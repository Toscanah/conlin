import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalsType } from "./TotalType";

export default function TotalStats({ totals }: { totals: TotalsType }) {
  return (
    <Table className="text-xl w-full">
      <TableHeader >
        <TableRow className="flex justify-center w-full items-center">
          {totals.totalOrders !== undefined && (
            <TableHead className="w-[20%] flex items-center">Ordini totali eseguiti</TableHead>
          )}
          {totals.totalHours !== undefined && (
            <TableHead className="w-[20%] flex items-center">Ore totali lavorate</TableHead>
          )}
          {totals.totalPay !== undefined && (
            <TableHead className="w-[20%] flex items-center">Paghe totale date</TableHead>
          )}
          {totals.totalTip !== undefined && (
            <TableHead className="w-[20%] flex items-center">Mance totali guadagnate</TableHead>
          )}
          {totals.totalMoney !== undefined && (
            <TableHead className="w-[20%] flex items-center">Incassi totali</TableHead>
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
              <strong>{totals.totalTip}</strong>
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
  );
}
