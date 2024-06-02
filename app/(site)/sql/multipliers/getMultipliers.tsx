import prisma from "../db";

export default async function getMultipliers(): Promise<{
  lunchMultiplier: number;
  dinnerMultiplier: number;
  ordersMultiplier: number;
}> {
  const multipliers = await prisma.multiplier.findMany();

  return {
    lunchMultiplier: multipliers.find((m) => m.type === "lunch")?.value ?? 234,
    dinnerMultiplier:
      multipliers.find((m) => m.type === "dinner")?.value ?? 234,
    ordersMultiplier:
      multipliers.find((m) => m.type === "orders")?.value ?? 234,
  };
}
