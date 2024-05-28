import { StatsType } from "../../types/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsAll(
  date: DateRange,
  context: string,
  session: string
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
      tip_lunch: true,
      tip_dinner: true,
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

      let lunchOrders = data._sum.lunch_orders ?? 0;
      let dinnerOrders = data._sum.dinner_orders ?? 0;
      let totalOrders = 0;

      let lunchHours = data._sum.lunch_time ?? 0;
      let dinnerHours = data._sum.dinner_time ?? 0;
      let totalHours = 0;

      let lunchPay = 0;
      let dinnerPay = 0;
      let totalPay = 0;

      let lunchTip = data._sum.tip_lunch ?? 0;
      let dinnerTip = data._sum.tip_dinner ?? 0;
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
          (lunchOrders > 0 ||
            lunchHours > 0 ||
            lunchPay > 0 ||
            lunchTip > 0)) ||
        ((session === "both" || session === "dinner") &&
          (dinnerOrders > 0 ||
            dinnerHours > 0 ||
            dinnerPay > 0 ||
            dinnerTip > 0));

      if (!hasStats) {
        return null; // No stats found for this rider
      }

      switch (context) {
        case "orders":
          // le consegne POSSONO essere zero
          if (lunchOrders == 0 && dinnerOrders == 0) {
            return null;
          }

          if (lunchOrders == 0 && session === "lunch") {
            return null;
          }

          if (dinnerOrders == 0 && session === "dinner") {
            return null;
          }

          return {
            riderName,
            totalOrders,
            lunchOrders:
              session === "both" || session === "lunch"
                ? lunchOrders
                : undefined,
            dinnerOrders:
              session === "both" || session === "dinner"
                ? dinnerOrders
                : undefined,
          };

        case "time":
          if (lunchHours == 0 && dinnerHours == 0) {
            return null;
          }

          if (lunchHours == 0 && session === "lunch") {
            return null;
          }

          if (dinnerHours == 0 && session === "dinner") {
            return null;
          }

          return {
            riderName,
            totalHours,
            lunchHours:
              session === "both" || session === "lunch"
                ? lunchHours
                : undefined,
            dinnerHours:
              session === "both" || session === "dinner"
                ? dinnerHours
                : undefined,
          };
        case "pay":
          if (lunchPay == 0 && dinnerPay == 0) {
            return null;
          }

          if (lunchPay == 0 && session === "lunch") {
            return null;
          }

          if (dinnerPay == 0 && session === "dinner") {
            return null;
          }

          return {
            riderName,
            totalPay: parseFloat(totalPay.toFixed(2)),
            lunchPay:
              session === "both" || session === "lunch"
                ? parseFloat(lunchPay.toFixed(2))
                : undefined,
            dinnerPay:
              session === "both" || session === "dinner"
                ? parseFloat(dinnerPay.toFixed(2))
                : undefined,
          };
        case "tip":
          
          if (lunchTip == 0 && dinnerTip == 0) {
            return null;
          }

          if (lunchTip == 0 && session === "lunch") {
            return null;
          }

          if (dinnerTip == 0 && session === "dinner") {
            return null;
          }

          return {
            riderName,
            totalTip: totalTip == 0 ? undefined : totalTip,
            lunchTip:
              (session === "both" || session === "lunch") && lunchTip !== 0
                ? lunchTip
                : undefined,
            dinnerTip:
              (session === "both" || session === "dinner") && dinnerTip !== 0
                ? dinnerTip
                : undefined,
          };
        case "total":
          return { riderName, totalMoney: parseFloat(totalMoney.toFixed(2)) };
        case "all":
          return {
            riderName,
            lunchOrders:
              session === "both" || session === "lunch"
                ? lunchOrders
                : undefined,
            dinnerOrders:
              session === "both" || session === "dinner"
                ? dinnerOrders
                : undefined,
            totalOrders,
            lunchHours:
              session === "both" || session === "lunch"
                ? lunchHours
                : undefined,
            dinnerHours:
              session === "both" || session === "dinner"
                ? dinnerHours
                : undefined,
            totalHours,
            lunchPay:
              session === "both" || session === "lunch"
                ? parseFloat(lunchPay.toFixed(2))
                : undefined,
            dinnerPay:
              session === "both" || session === "dinner"
                ? parseFloat(dinnerPay.toFixed(2))
                : undefined,
            totalPay: parseFloat(totalPay.toFixed(2)),
            lunchTip:
              session === "both" || session === "lunch" ? lunchTip : undefined,
            dinnerTip:
              session === "both" || session === "dinner"
                ? dinnerTip
                : undefined,
            totalTip,
            totalMoney: parseFloat(totalMoney.toFixed(2)),
          };
        default:
          throw new Error("Invalid context provided");
      }
    })
  );

  const filteredResult = result.filter((r) => r !== null) as StatsType[];

  filteredResult.sort((a, b) => a.riderName.localeCompare(b.riderName));

  return filteredResult;
}
