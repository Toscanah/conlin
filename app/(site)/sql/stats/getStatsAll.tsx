import { StatsType } from "../../stats/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsAll(
  date: DateRange,
  context: string
): Promise<StatsType[]> {
  const { from, to } = date;

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

  // Construct the result based on the context
  const result = await Promise.all(
    aggregatedData.map(async (data) => {
      const rider = await prisma.rider.findUnique({
        where: {
          id: data.rider_id,
        },
        select: {
          nickname: true,
        },
      });

      const { _sum } = data;

      const totalOrders = (_sum.lunch_orders ?? 0) + (_sum.dinner_orders ?? 0);
      const totalHours = (_sum.lunch_time ?? 0) + (_sum.dinner_time ?? 0);
      const totalMoney =
        (_sum.lunch_time ?? 0) * 6 +
        (_sum.dinner_time ?? 0) * 7 +
        (_sum.lunch_orders ?? 0) +
        (_sum.dinner_orders ?? 0);
      const totalTip = _sum.tip ?? 0;

      switch (context) {
        case "orders":
          return { riderName: rider?.nickname ?? "", totalOrders };
        case "time":
          return { riderName: rider?.nickname ?? "", totalHours };
        case "money":
          return { riderName: rider?.nickname ?? "", totalMoney };
        case "tip":
          return { riderName: rider?.nickname ?? "", totalTip };
        case "all":
          return {
            riderName: rider?.nickname ?? "",
            totalOrders,
            totalHours,
            totalMoney,
            totalTip,
          };
        default:
          throw new Error("Invalid context provided");
      }
    })
  );

  result.sort((a, b) => a.riderName.localeCompare(b.riderName));

  return result;
}
