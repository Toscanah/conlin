import deleteSession from "../../../sql/sessions/deleteSession";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  return NextResponse.json(await deleteSession(await request.json()));
}
