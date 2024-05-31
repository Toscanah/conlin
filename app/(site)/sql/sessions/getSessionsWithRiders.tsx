import { Session } from "@prisma/client";
import prisma from ".././db";
import { SessionWithRider } from "../../types/SessionWithRider";

export default async function getSessionsWithRiders(): Promise<
  SessionWithRider[]
> {
  return await prisma.session.findMany({
    orderBy: { date: "desc" },
    include: {
      rider: true,
    },
  });
}
