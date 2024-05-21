import { StatsType } from "../../types/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsAll(
  date: DateRange,
  context: string
): Promise<StatsType[]> {
  const { from, to } = date;
  //console.log(date);

  const aggregatedData = await prisma.session.groupBy({
    by: ["rider_id"],
    where: {
      date: {
        lte: to,
        gte: from,
      },
    },
    _sum: {
      lunch_orders: true,
      dinner_orders: true,
      lunch_time: true,
      dinner_time: true,
      tip: true,
    },
  });

  const result = await Promise.all(
    aggregatedData.map(async (data) => {
      const rider = await prisma.rider.findUnique({
        where: {
          id: data.rider_id,
        },
        select: {
          nickname: true,
          surname: true,
        },
      });

      const { _sum } = data;

      const totalOrders = (_sum.lunch_orders ?? 0) + (_sum.dinner_orders ?? 0);
      const totalHours = (_sum.lunch_time ?? 0) + (_sum.dinner_time ?? 0);
      const totalPay =
        (_sum.lunch_time ?? 0) * 6 +
        (_sum.dinner_time ?? 0) * 7 +
        (_sum.lunch_orders ?? 0) +
        (_sum.dinner_orders ?? 0);
      const totalTip = _sum.tip ?? 0;
      const totalMoney = totalPay + totalTip;

      let riderName: string = rider?.nickname ?? rider?.surname ?? "";

      

      switch (context) {
        case "orders":
          return { riderName, totalOrders };
        case "time":
          return { riderName, totalHours };
        case "pay":
          return { riderName, totalPay: parseFloat(totalPay.toFixed(2)) };
        case "tip":
          return { riderName, totalTip };
        case "total":
          return { riderName, totalMoney: parseFloat(totalMoney.toFixed(2)) };
        case "all":
          return {
            riderName,
            totalOrders,
            totalHours,
            totalPay: parseFloat(totalPay.toFixed(2)),
            totalTip,
            totalMoney: parseFloat(totalMoney.toFixed(2)),
          };
        default:
          throw new Error("Invalid context provided");
      }
      
    })

  );

  result.sort((a, b) => a.riderName.localeCompare(b.riderName));
  //console.log(result);

  return result;
}
