import prisma from "../db";

export default async function getMultipliers() {
  const multipliers = await prisma.multiplier.findMany();
  console.log("OK");
  return {
    lunchMultiplier: multipliers.find((m) => m.type === "lunch")?.value ?? 6,
    dinnerMultiplier: multipliers.find((m) => m.type === "dinner")?.value ?? 7,
    ordersMultiplier: multipliers.find((m) => m.type === "orders")?.value ?? 1,
  };
}
