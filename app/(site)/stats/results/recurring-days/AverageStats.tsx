import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsType } from "./StatsType";
import { addDays, format, subDays } from "date-fns";
import { it } from "date-fns/locale";

interface DayStats {
  dayOfWeek: string;
  totalOrders: number;
  totalHours: number;
  totalPay: number;
  totalTip: number;
  totalMoney: number;
  count: number;
}

export default function AverageStats({ result }: { result: StatsType[] }) {
  // Function to group stats by day of the week
  console.log(result);

  const allKeys = result.reduce((keys: string[], item: StatsType) => {
    return keys.concat(Object.keys(item));
  }, []);

  const groupStatsByDay = (stats: StatsType[]): DayStats[] => {
    const dayStatsArray: DayStats[] = [];

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

  const dayStats = groupStatsByDay(result);

  return (
    <div className="flex flex-col gap-4 items-center w-full text-center">
      <Table className="text-xl w-full text-center">
        <TableHeader>
          <TableRow className="flex justify-center w-full items-center">
            <TableHead className="w-1/6 flex items-center justify-center">
              Giorno
            </TableHead>
            {allKeys.includes("totalOrders") && (
              <TableHead className="w-1/6 flex items-center justify-center">
                Consegne
              </TableHead>
            )}
            {allKeys.includes("totalHours") && (
              <TableHead className="w-1/6 flex items-center justify-center">
                Ore
              </TableHead>
            )}
            {allKeys.includes("totalPay") && (
              <TableHead className="w-1/6 flex items-center justify-center">
                Paghe
              </TableHead>
            )}
            {allKeys.includes("totalTip") && (
              <TableHead className="w-1/6 flex items-center justify-center">
                Mance
              </TableHead>
            )}
            {allKeys.includes("totalMoney") && (
              <TableHead className="w-1/6 flex items-center justify-center">
                Incassi
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dayStats.map((dayStat, index) => (
            <TableRow
              key={index}
              className="flex justify-center w-full items-center"
            >
              <TableCell className="w-1/6">
                <strong>
                  {dayStat.dayOfWeek.charAt(0).toUpperCase() +
                    dayStat.dayOfWeek.slice(1)}
                </strong>
              </TableCell>
              {allKeys.includes("totalOrders") && (
                <TableCell className="w-1/6">
                  <strong>
                    {(dayStat.totalOrders / dayStat.count).toFixed(2)}
                  </strong>
                </TableCell>
              )}
              {allKeys.includes("totalHours") && (
                <TableCell className="w-1/6">
                  <strong>
                    {(dayStat.totalHours / dayStat.count).toFixed(2)}
                  </strong>
                </TableCell>
              )}
              {allKeys.includes("totalPay") && (
                <TableCell className="w-1/6">
                  <strong>
                    {(dayStat.totalPay / dayStat.count).toFixed(2)}
                  </strong>
                </TableCell>
              )}
              {allKeys.includes("totalTip") && (
                <TableCell className="w-1/6">
                  <strong>
                    {(dayStat.totalTip / dayStat.count).toFixed(2)}
                  </strong>
                </TableCell>
              )}
              {allKeys.includes("totalMoney") && (
                <TableCell className="w-1/6">
                  <strong>
                    {(dayStat.totalMoney / dayStat.count).toFixed(2)}
                  </strong>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
