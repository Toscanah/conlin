import getMultipliers from "@/app/(site)/sql/multipliers/getMultipliers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(getMultipliers(await request.json()));
}
