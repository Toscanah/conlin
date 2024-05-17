import { StatsType } from "../../stats/StatsType";
import prisma from "../db";
import { DateRange } from "react-day-picker";

export default async function getStatsSingle(
  riderId: number,
  date: DateRange,
  context: string
): Promise<StatsType[]> {
  const { from, to } = date;

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
    },
  });

  const totalOrders =
    (aggregatedOrders._sum.lunch_orders ?? 0) +
    (aggregatedOrders._sum.dinner_orders ?? 0);
  const totalHours =
    (aggregatedOrders._sum.lunch_time ?? 0) +
    (aggregatedOrders._sum.dinner_time ?? 0);
  const totalMoney =
    (aggregatedOrders._sum.lunch_time ?? 0) * 6 +
    (aggregatedOrders._sum.dinner_time ?? 0) * 7 +
    (aggregatedOrders._sum.lunch_orders ?? 0) +
    (aggregatedOrders._sum.dinner_orders ?? 0);
  const totalTip = aggregatedOrders._sum.tip ?? 0;

  let result: StatsType[];
  switch (context) {
    case "orders":
      result = [{ riderName: rider?.nickname ?? "", totalOrders }];
      break;
    case "time":
      result = [{ riderName: rider?.nickname ?? "", totalHours }];
      break;
    case "money":
      result = [{ riderName: rider?.nickname ?? "", totalMoney }];
      break;
    case "tip":
      result = [{ riderName: rider?.nickname ?? "", totalTip }];
      break;
    case "all":
      result = [
        {
          riderName: rider?.nickname ?? "",
          totalOrders,
          totalHours,
          totalMoney,
          totalTip,
        },
      ];
      break;
    default:
      throw new Error("Invalid context provided");
  }

  // se ha lavorato allora torna il risultato, 
  //se non ha fatto un cazzo (magari anche ore, ma ordini no) allora vuoto
  return (totalOrders == 0 && totalHours == 0) ? [] : result;
}
