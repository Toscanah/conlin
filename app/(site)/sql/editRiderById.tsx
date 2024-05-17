import prisma from "./db";

export default async function editRiderById(
  id: number,
  newRiderInfo: {
    name: string;
    surname: string;
    nickname: string;
    isActive: boolean;
  }
) {
  // TODO: la funzione torna già il record deditato
  await prisma.rider.updateMany({
    where: {
      id: id,
    },
    data: {
      name: newRiderInfo.name,
      surname: newRiderInfo.surname,
      nickname: newRiderInfo.nickname,
      is_active: newRiderInfo.isActive,
    },
  });

  return await prisma.rider.findUnique({
    where: {
      id: id,
    },
  });
}
