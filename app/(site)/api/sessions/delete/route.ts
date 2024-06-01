import deleteSession from "../../../sql/sessions/deleteSession";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  return NextResponse.json(await deleteSession(id));
}
