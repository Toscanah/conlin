import { Session } from "@prisma/client";
import prisma from "./db";

export default async function addSession(newSession: Session) {
  function storeCorrectDate(date: Date) {
    const a = new Date(date);
    return new Date(
      Date.parse(a.toUTCString()) - a.getTimezoneOffset() * 60000
    );
  }
  
  return await prisma.session.create({
    data: {
      rider_id: newSession.rider_id,
      lunch_orders: newSession.lunch_orders,
      dinner_orders: newSession.dinner_orders,
      lunch_time: newSession.lunch_time,
      dinner_time: newSession.dinner_time,
      date: storeCorrectDate(newSession?.date ?? new Date()),
      tip: newSession.tip
    },
  });
}
