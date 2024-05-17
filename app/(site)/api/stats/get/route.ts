import { NextResponse } from "next/server";
import getStatsSingle from "@/app/(site)/sql/stats/getStatsSingle";
import getStatsAll from "@/app/(site)/sql/stats/getStatsAll";
import { addDays } from "date-fns";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.isAllRiders) {
    return NextResponse.json(
      await getStatsAll(
        {
          from: addDays(body.date.from, 1),
          to: addDays(body.date.to, 1),
        },
        body.context
      )
    );
  } else {
    return NextResponse.json(
      await getStatsSingle(
        body.riderId,
        {
          from: addDays(body.date.from, 1),
          to: addDays(body.date.to, 1),
        },
        body.context
      )
    );
  }
}
