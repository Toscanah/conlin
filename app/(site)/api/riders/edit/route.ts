import { NextResponse } from "next/server";
import editRiderById from "../../../sql/editRiderById";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await editRiderById(body.riderId, body));
}
