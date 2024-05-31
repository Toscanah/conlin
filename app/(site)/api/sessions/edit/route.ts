import editSession from "@/app/(site)/sql/sessions/editSession";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(await editSession(await request.json()));
}
