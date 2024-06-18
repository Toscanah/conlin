import { NextResponse } from "next/server";
import getStatsSingle from "@/app/(site)/sql/stats/getStatsSingle";
import getStatsAll from "@/app/(site)/sql/stats/getStatsAll";
import { addDays } from "date-fns";
import getReccuring from "@/app/(site)/sql/stats/getReccuring";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.days) {
    return NextResponse.json(await getReccuring(body));
  }

  if (body.isAllRiders) {
    return NextResponse.json(
      await getStatsAll(
        {
          from: addDays(body.dateRange.from, 1),
          to: addDays(body.dateRange.to, 1),
        },
        body.context,
        body.session
      )
    );
  } else {
    return NextResponse.json(
      await getStatsSingle(
        body.riderId,
        {
          from: addDays(body.dateRange.from, 1),
          to: addDays(body.dateRange.to, 1),
        },
        body.context,
        body.session
      )
    );
  }
}
