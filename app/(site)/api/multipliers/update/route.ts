import { NextResponse } from "next/server";
import updateMultipliers from "@/app/(site)/sql/multipliers/updateMultipliers";

export async function POST(request: Request) {
  return NextResponse.json(updateMultipliers(await request.json()));
}
