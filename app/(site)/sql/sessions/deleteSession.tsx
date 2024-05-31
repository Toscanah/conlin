import prisma from ".././db";

export default async function deleteSession(id: number) {
  console.log("CIAO");
  return await prisma.session.delete({
    where: {
      id: id,
    },
  });
}
