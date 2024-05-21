import { Session } from "@prisma/client";

export type SessionWithRider = Session & {
  rider?: { nickname?: string | undefined | null};
};
