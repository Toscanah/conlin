import {
  eachWeekOfInterval,
  eachDayOfInterval,
  format,
  isWithinInterval,
  parse,
  endOfMonth,
  addDays,
  subDays,
} from "date-fns";
import { it } from "date-fns/locale";
import prisma from "../db";
import { StatsType } from "../../stats/results/recurring-days/StatsType";
import getMultipliers from "../multipliers/getMultipliers";

export default async function getReccuring(body: {
  days: string[];
  context: string;
  session: string;
  periodChoice: string;
  month: string;
  year: string;
  yearOfMonth: string;
}) {
  const { days, context, session, periodChoice, month, year, yearOfMonth } = body;

  let startDate: Date;
  let endDate: Date;

  if (periodChoice === "month") {
    startDate = parse(
      `01 ${month} ${yearOfMonth}`,
      "dd LLLL yyyy",
      new Date(),
      {
        locale: it,
      }
    );

    startDate = addDays(startDate, 1);
    endDate = endOfMonth(startDate);
  } else if (periodChoice === "year") {
    startDate = addDays(new Date(Number(year), 0, 1), 1);
    endDate = addDays(new Date(Number(year), 11, 31), 1);
  } else {
    throw new Error("Invalid periodChoice");
  }

  const daysMap: any = { martedì: 2, mercoledì: 3, giovedì: 4, venerdì: 5, sabato: 6, domenica: 0 };
  const selectedDays = days.map((day) => daysMap[day]);

  const datesInRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).filter((date) => selectedDays.includes(subDays(date, 1).getDay()));

  const dayOrder = ["martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"];

  datesInRange.sort((a, b) => {
    return (
      dayOrder.indexOf(days[a.getDay()]) - dayOrder.indexOf(days[b.getDay()])
    );
  });

  const { lunchMultiplier, dinnerMultiplier, ordersMultiplier } =
    await getMultipliers();

  const results: StatsType[] = [];

  for (const date of datesInRange) {
    const aggregatedOrders = await prisma.session.aggregate({
      where: {
        date,
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
    let totalTip = 0;

    if (session === "both" || session === "lunch") {
      totalOrders += lunchOrders;
      totalHours += lunchHours;
      lunchPay = lunchHours * lunchMultiplier + lunchOrders * ordersMultiplier;
      totalPay += lunchPay;
      totalTip += lunchTip;
    }

    if (session === "both" || session === "dinner") {
      totalOrders += dinnerOrders;
      totalHours += dinnerHours;
      dinnerPay =
        dinnerHours * dinnerMultiplier + dinnerOrders * ordersMultiplier;
      totalPay += dinnerPay;
      totalTip += dinnerTip;
    }

    const totalMoney = totalPay + totalTip;

    let result: StatsType;

    switch (context) {
      case "orders":
        result = {
          day: date,
          totalOrders: totalOrders > 0 ? parseFloat(totalOrders.toFixed(2)) : undefined,
        };
        break;
      case "time":
        result = {
          day: date,
          totalHours: totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : undefined,
        };
        break;
      case "pay":
        result = {
          day: date,
          totalPay: totalPay > 0 ?  parseFloat(totalPay.toFixed(2)) : undefined,
        };
        break;
      case "tip":
        result = {
          day: date,
          totalTip: totalTip > 0 ? parseFloat(totalTip.toFixed(2)) : undefined,
        };
        break;
      case "total":
        result = {
          day: date,
          totalMoney:
            totalMoney > 0 ? parseFloat(totalMoney.toFixed(2)) : undefined,
        };
        break;
      case "all":
        result = {
          day: date,
          totalOrders: totalOrders > 0 ? parseFloat(totalOrders.toFixed(2)) : undefined,
          totalHours: totalHours > 0 ? parseFloat(totalHours.toFixed(2)) : undefined,
          totalPay: totalPay > 0 ? parseFloat(totalPay.toFixed(2)) : undefined,
          totalTip: totalTip > 0 ? parseFloat(totalTip.toFixed(2)) : undefined,
          totalMoney:
            totalMoney > 0 ? parseFloat(totalMoney.toFixed(2)) : undefined,
        };
        break;
      default:
        throw new Error("Invalid context provided");
    }

    // Check if any stats exist before adding to results
    if (
      result.totalOrders !== undefined ||
      result.totalHours !== undefined ||
      result.totalPay !== undefined ||
      result.totalTip !== undefined ||
      result.totalMoney !== undefined
    ) {
      results.push(result);
    }
  }

  return results;
  // return [
  //   {
  //     day: new Date(),
  //     totalOrders: 45,
  //     totalHours: 4,
  //     totalPay: 200,
  //     totalTip: 50,
  //     totalMoney: 250,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 30,
  //     totalHours: 5,
  //     totalPay: 180,
  //     totalTip: 40,
  //     totalMoney: 220,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 25,
  //     totalHours: 3.5,
  //     totalPay: 150,
  //     totalTip: 35,
  //     totalMoney: 185,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 50,
  //     totalHours: 6,
  //     totalPay: 240,
  //     totalTip: 60,
  //     totalMoney: 300,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 40,
  //     totalHours: 4.5,
  //     totalPay: 220,
  //     totalTip: 45,
  //     totalMoney: 265,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 35,
  //     totalHours: 4,
  //     totalPay: 190,
  //     totalTip: 50,
  //     totalMoney: 240,
  //   },
  //   {
  //     day: new Date(),
  //     totalOrders: 28,
  //     totalHours: 3,
  //     totalPay: 160,
  //     totalTip: 30,
  //     totalMoney: 190,
  //   },
  // ];
}
