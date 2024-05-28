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
      tip_lunch: true,
      tip_dinner: true,
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

  // Initialize values
  let lunchOrders = aggregatedOrders._sum.lunch_orders ?? 0;
  let dinnerOrders = aggregatedOrders._sum.dinner_orders ?? 0;
  let totalOrders = 0;

  let lunchHours = aggregatedOrders._sum.lunch_time ?? 0;
  let dinnerHours = aggregatedOrders._sum.dinner_time ?? 0;
  let totalHours = 0;

  let lunchPay = 0;
  let dinnerPay = 0;
  let totalPay = 0;

  let lunchTip = aggregatedOrders._sum.tip_lunch ?? 0;
  let dinnerTip = aggregatedOrders._sum.tip_dinner ?? 0;
  let totalTip = lunchTip + dinnerTip;

  if (session === "both" || session === "lunch") {
    totalOrders += lunchOrders;
    totalHours += lunchHours;
    lunchPay = lunchHours * 6 + lunchOrders;
    totalPay += lunchPay;
  }

  if (session === "both" || session === "dinner") {
    totalOrders += dinnerOrders;
    totalHours += dinnerHours;
    dinnerPay = dinnerHours * 7 + dinnerOrders;
    totalPay += dinnerPay;
  }

  const totalMoney = totalPay + totalTip;

  let riderName: string =
    rider?.nickname && rider.nickname.trim() !== ""
      ? rider.nickname
      : rider?.surname && rider.surname.trim() !== ""
      ? rider.surname
      : "";

  const hasStats =
    ((session === "both" || session === "lunch") &&
      (lunchOrders > 0 || lunchHours > 0 || lunchPay > 0 || lunchTip > 0)) ||
    ((session === "both" || session === "dinner") &&
      (dinnerOrders > 0 || dinnerHours > 0 || dinnerPay > 0 || dinnerTip > 0));

  if (!hasStats) {
    return []; // No stats found for this rider
  }

  let result: StatsType[];

  switch (context) {
    case "orders":
      result = [
        {
          riderName,
          lunchOrders: session !== "dinner" ? lunchOrders : undefined,
          dinnerOrders: session !== "lunch" ? dinnerOrders : undefined,
          totalOrders: session === "both" ? totalOrders : undefined,
        },
      ];
      break;
    case "time":
      result = [
        {
          riderName,
          lunchHours: session !== "dinner" ? lunchHours : undefined,
          dinnerHours: session !== "lunch" ? dinnerHours : undefined,
          totalHours: session === "both" ? totalHours : undefined,
        },
      ];
      break;
    case "pay":
      result = [
        {
          riderName,
          lunchPay:
            session !== "dinner" ? parseFloat(lunchPay.toFixed(2)) : undefined,
          dinnerPay:
            session !== "lunch" ? parseFloat(dinnerPay.toFixed(2)) : undefined,
          totalPay:
            session === "both" ? parseFloat(totalPay.toFixed(2)) : undefined,
        },
      ];
      break;
    case "tip":
      if (
        (lunchTip == 0 && session !== "dinner") ||
        (dinnerTip == 0 && session !== "lunch")
      ) {
        return [];
      }
      result = [
        {
          riderName,
          lunchTip:
            session !== "dinner" && lunchTip !== 0 ? lunchTip : undefined,
          dinnerTip:
            session !== "lunch" && dinnerTip !== 0 ? dinnerTip : undefined,
          totalTip: session === "both" ? totalTip : undefined,
        },
      ];
      break;
    case "total":
      result = [{ riderName, totalMoney: parseFloat(totalMoney.toFixed(2)) }];
      break;
    case "all":
      result = [
        {
          riderName,
          lunchOrders: session !== "dinner" ? lunchOrders : undefined,
          dinnerOrders: session !== "lunch" ? dinnerOrders : undefined,
          totalOrders: session === "both" ? totalOrders : undefined,
          lunchHours: session !== "dinner" ? lunchHours : undefined,
          dinnerHours: session !== "lunch" ? dinnerHours : undefined,
          totalHours: session === "both" ? totalHours : undefined,
          lunchPay:
            session !== "dinner" ? parseFloat(lunchPay.toFixed(2)) : undefined,
          dinnerPay:
            session !== "lunch" ? parseFloat(dinnerPay.toFixed(2)) : undefined,
          totalPay:
            session === "both" ? parseFloat(totalPay.toFixed(2)) : undefined,
          lunchTip: session !== "dinner" ? lunchTip : undefined,
          dinnerTip: session !== "lunch" ? dinnerTip : undefined,
          totalTip: totalTip !== 0 ? totalTip : undefined,
          totalMoney: parseFloat(totalMoney.toFixed(2)),
        },
      ];
      break;
    default:
      throw new Error("Invalid context provided");
  }

  return result;
}
