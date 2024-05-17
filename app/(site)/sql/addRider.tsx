import { Rider } from "@prisma/client";
import prisma from "./db";

export default async function addRider(newRiderInfo: Rider) {
  return await prisma.rider.create({
    data: {
      name: newRiderInfo.name,
      surname: newRiderInfo.surname,
      nickname: newRiderInfo.nickname,
      is_active: newRiderInfo.is_active,
    },
  });
}
