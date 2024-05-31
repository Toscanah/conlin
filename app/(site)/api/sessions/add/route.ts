import { NextResponse } from "next/server";
import addSession from "../../../sql/sessions/addSession";

export async function POST(request: Request) {
  return NextResponse.json(await addSession(await request.json()));
}
