import { Rider } from "@prisma/client";
import prisma from "./db";

export default async function getRiders(): Promise<Rider[]> {
  return await prisma.rider.findMany({ orderBy: { name: "asc" } });
}
