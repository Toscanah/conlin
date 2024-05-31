import { Session } from "@prisma/client";
import prisma from "../db";
import { SessionWithRider } from "../../types/SessionWithRider";

export default async function editSession(data: SessionWithRider) {
  function storeCorrectDate(date: Date) {
    const a = new Date(date);
    return new Date(
      Date.parse(a.toUTCString()) - a.getTimezoneOffset() * 60000
    );
  }

  return await prisma.session.update({
    data: {
      date: storeCorrectDate(data.date ?? new Date()),
      lunch_orders: data.lunch_orders,
      dinner_orders: data.dinner_orders,
      lunch_time: data.lunch_time,
      dinner_time: data.dinner_time,
      tip_lunch: data.tip_lunch,
      tip_dinner: data.tip_dinner,
      rider_id: data.rider.id,
    },
    where: { id: data.id },
  });
}
