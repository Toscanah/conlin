import { Prisma, Rider, Session } from "@prisma/client";

export type SessionWithRider = Prisma.SessionGetPayload<{
  include: { rider: true };
}>;
