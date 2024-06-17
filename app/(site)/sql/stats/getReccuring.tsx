import {
  eachWeekOfInterval,
  eachDayOfInterval,
  format,
  isWithinInterval,
  parse,
  endOfMonth,
  addDays,
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
  period: string;
}) {
  const { days, context, session, periodChoice, period } = body;

  let startDate: Date;
  let endDate: Date;

  if (periodChoice === "month") {
    // se Lin mi chiede di poter essere ancora piu specifico aggiungendo anche l'anno del mese
    // sarebbe meglio avere un parametro aggiuntivo chiamato tipo "annoDelMese" invece che estrapolarlo dal "period"
    // const [monthName, yearStr] = period.split(" "); // Splitting "May 2024" into ["May", "2024"]
    // const year = parseInt(yearStr, 10);

    // altrimenti l'anno di default è l'anno corrente
    const currentYear = new Date().getFullYear();
    startDate = parse(
      `01 ${period} ${currentYear}`,
      "dd LLLL yyyy",
      new Date(),
      {
        locale: it,
      }
    );

    endDate = endOfMonth(startDate);
    startDate = addDays(startDate, 1);
  } else if (periodChoice === "year") {
    startDate = new Date(Number(period), 0, 1);
    endDate = new Date(Number(period), 11, 31);
  } else {
    throw new Error("Invalid periodChoice");
  }

  const daysMap: any = { mar: 2, mer: 3, gio: 4, ven: 5, sab: 6, dom: 0 };
  const selectedDays = days.map((day) => daysMap[day]);

  const datesInRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).filter((date) => selectedDays.includes(date.getDay() - 1));

  const dayOrder = ["mar", "mer", "gio", "ven", "sab", "dom"];

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
          totalOrders: totalOrders > 0 ? totalOrders : undefined,
        };
        break;
      case "time":
        result = {
          day: date,
          totalHours: totalHours > 0 ? totalHours : undefined,
        };
        break;
      case "pay":
        result = {
          day: date,
          totalPay: totalPay > 0 ? totalPay : undefined,
        };
        break;
      case "tip":
        result = {
          day: date,
          totalTip: totalTip > 0 ? totalTip : undefined,
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
          totalOrders: totalOrders > 0 ? totalOrders : undefined,
          totalHours: totalHours > 0 ? totalHours : undefined,
          totalPay: totalPay > 0 ? totalPay : undefined,
          totalTip: totalTip > 0 ? totalTip : undefined,
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
