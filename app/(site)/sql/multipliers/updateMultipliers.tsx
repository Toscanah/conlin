import prisma from "../db";

export default async function updateMultiplier(body: {
  field: string;
  value: number;
}) {
  const { field, value } = body;
  console.log(body);
  return await prisma.multiplier.update({
    where: { type: field },
    data: { value: value },
  });
}
