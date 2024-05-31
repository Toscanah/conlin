import { Session } from "@prisma/client";
import prisma from "../db";

export default async function editSession(data: Session) {
  function storeCorrectDate(date: Date) {
    const a = new Date(date);
    return new Date(
      Date.parse(a.toUTCString()) - a.getTimezoneOffset() * 60000
    );
  }

  const boh: any = await prisma.session.update({
    data: {
      date: storeCorrectDate(data.date ?? new Date()),
      lunch_orders: data.lunch_orders,
      dinner_orders: data.dinner_orders,
      lunch_time: data.lunch_time,
      dinner_time: data.dinner_time,
      tip_lunch: data.tip_lunch,
      tip_dinner: data.tip_dinner,
    },
    where: { id: data.id },
  });

  return boh;

}
