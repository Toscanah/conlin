import { NextResponse } from "next/server";
import addRider from "../../../sql/addRider";

export async function POST(request: Request) {
  return NextResponse.json(await addRider(await request.json()));
}
