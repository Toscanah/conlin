import { StatsType } from "../../types/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsAll(
  date: DateRange,
  context: string,
  session: string
): Promise<StatsType[]> {
  const { from, to } = date;

  // Fetch aggregated data for all riders within the date range
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

      // Initialize totals
      let totalOrders = 0;
      let totalHours = 0;
      let totalPay = 0;
      let totalTip = data._sum.tip ?? 0;

      // Calculate totals based on the session type
      if (session === "both" || session === "lunch") {
        totalOrders += data._sum.lunch_orders ?? 0;
        totalHours += data._sum.lunch_time ?? 0;
        totalPay +=
          (data._sum.lunch_time ?? 0) * 6 + (data._sum.lunch_orders ?? 0);
      }

      if (session === "both" || session === "dinner") {
        totalOrders += data._sum.dinner_orders ?? 0;
        totalHours += data._sum.dinner_time ?? 0;
        totalPay +=
          (data._sum.dinner_time ?? 0) * 7 + (data._sum.dinner_orders ?? 0);
      }

      const totalMoney = totalPay + totalTip;

      let riderName: string =
        rider?.nickname && rider.nickname.trim() !== ""
          ? rider.nickname
          : rider?.surname && rider.surname.trim() !== ""
          ? rider.surname
          : "";

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

  return result;
}
