import { StatsType } from "../../types/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsSingle(
  riderId: number,
  date: DateRange,
  context: string,
  session: string
): Promise<StatsType[]> {
  const { from, to } = date;

  // Fetch all data for the given rider and date range
  const aggregatedOrders = await prisma.session.aggregate({
    where: {
      rider_id: riderId,
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

  const rider = await prisma.rider.findUnique({
    where: {
      id: riderId,
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
  let totalTip = aggregatedOrders._sum.tip ?? 0;

  // Calculate totals based on the session type
  if (session === "both" || session === "lunch") {
    totalOrders += aggregatedOrders._sum.lunch_orders ?? 0;
    totalHours += aggregatedOrders._sum.lunch_time ?? 0;
    totalPay +=
      (aggregatedOrders._sum.lunch_time ?? 0) * 6 +
      (aggregatedOrders._sum.lunch_orders ?? 0);
  }

  if (session === "both" || session === "dinner") {
    totalOrders += aggregatedOrders._sum.dinner_orders ?? 0;
    totalHours += aggregatedOrders._sum.dinner_time ?? 0;
    totalPay +=
      (aggregatedOrders._sum.dinner_time ?? 0) * 7 +
      (aggregatedOrders._sum.dinner_orders ?? 0);
  }

  const totalMoney = totalPay + totalTip;

  let result: StatsType[];
  let riderName: string =
    rider?.nickname && rider.nickname.trim() !== ""
      ? rider.nickname
      : rider?.surname && rider.surname.trim() !== ""
      ? rider.surname
      : "";

  switch (context) {
    case "orders":
      result = [{ riderName, totalOrders }];
      break;
    case "time":
      result = [{ riderName, totalHours }];
      break;
    case "pay":
      result = [{ riderName, totalPay: parseFloat(totalPay.toFixed(2)) }];
      break;
    case "tip":
      result = [{ riderName, totalTip }];
      break;
    case "total":
      result = [{ riderName, totalMoney: parseFloat(totalMoney.toFixed(2)) }];
      break;
    case "all":
      result = [
        {
          riderName,
          totalOrders,
          totalHours,
          totalPay: parseFloat(totalPay.toFixed(2)),
          totalTip,
          totalMoney: parseFloat(totalMoney.toFixed(2)),
        },
      ];
      break;
    default:
      throw new Error("Invalid context provided");
  }

  return totalOrders === 0 && totalHours === 0 ? [] : result;
}
