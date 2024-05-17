import prisma from "./db";

export default async function getRiderById(id: number) {
  return await prisma.rider.findUnique({ where: { id: id } });
}
