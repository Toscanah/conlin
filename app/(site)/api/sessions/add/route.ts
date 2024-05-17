import { NextResponse } from "next/server";
import addSession from "../../../sql/addSession";

export async function POST(request: Request) {
  return NextResponse.json(await addSession(await request.json()));
}
