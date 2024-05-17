import { Rider } from "@prisma/client";
import prisma from "./db";

export default async function getActiveRiders(): Promise<Rider[]> {
  return await prisma.rider.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
