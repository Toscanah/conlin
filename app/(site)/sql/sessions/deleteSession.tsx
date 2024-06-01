import prisma from ".././db";

export default async function deleteSession(id: number) {
  return await prisma.session.delete({
    where: { id },
  });
}
