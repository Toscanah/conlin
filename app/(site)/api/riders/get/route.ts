import { NextResponse } from "next/server";
import getRiderById from "@/app/(site)/sql/getRiderById";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await getRiderById(body.riderId));
}
